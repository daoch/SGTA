import requests
import json
import os
from typing import Dict, List, Optional, Any
from datetime import datetime
import urllib.parse
import logging # Import logging

logger = logging.getLogger(__name__) # Setup logger for this module


class DSpaceQueryTool:
    """
    A comprehensive tool for querying DSpace repositories
    Supports authentication, searching, and metadata extraction
    """
    
    def __init__(self, base_url: str = "https://tesis.pucp.edu.pe", 
                 xsrf_token: str = None, jsessionid: str = None,
                 api_context_path: str = "server/api",
                 dspace_version: str = "7"):
        """
        Initialize DSpace connection
        
        Args:
            base_url: Base URL of the DSpace instance
            xsrf_token: XSRF token for authentication
            jsessionid: Session ID for authentication
            api_context_path: API context path (e.g., "server/api" for DSpace 7, "rest" for DSpace 5/6)
            dspace_version: Major DSpace version ("6" or "7") to adapt API calls.
        """
        self.base_url = base_url.rstrip('/')
        self.api_context_path = api_context_path.strip('/')
        self.api_base_url = f"{self.base_url}/{self.api_context_path}"
        self.dspace_version = str(dspace_version) # Ensure it's a string
        self.session = requests.Session()
        
        # Default headers as per user request
        self.headers = {
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0"
        }
        
        # Set authentication if provided
        if xsrf_token and jsessionid:
            self.set_authentication(xsrf_token, jsessionid)
    
    def set_authentication(self, xsrf_token: str, jsessionid: str):
        """Set authentication cookies and headers"""
        domain = self.base_url.replace("https://", "").replace("http://", "")
        
        # Set cookies
        self.session.cookies.set("DSPACE-XSRF-COOKIE", xsrf_token, domain=domain)
        self.session.cookies.set("JSESSIONID", jsessionid, domain=domain)
        
        # Set XSRF header
        self.headers["X-XSRF-TOKEN"] = xsrf_token
        
        logger.info(f"Authentication configured for {domain}") # Changed print to logger.info
    
    def _make_request(self, endpoint: str, params: Dict = None) -> Optional[Dict]:
        """Make authenticated request to DSpace API"""
        url = f"{self.api_base_url}/{endpoint.lstrip('/')}"
        
        logger.debug(f"Making DSpace API request to: {url} with params: {params}") # Changed print to logger.debug
        
        try:
            response = self.session.get(url, headers=self.headers, params=params)
            logger.debug(f"DSpace API response status: {response.status_code} from {url}") # Changed print to logger.debug
            logger.debug(f"Final URL after potential redirects: {response.url}") # Added this line

            content_type = response.headers.get("Content-Type", "")
            if "application/json" not in content_type:
                logger.warning(f"Response from {url} (final URL: {response.url}) is not JSON. Content-Type: {content_type}.") # Updated log
                logger.warning(f"Response text (first 500 chars): {response.text[:500]}") # Changed print to logger.warning
                response.raise_for_status() 
                return None 

            response.raise_for_status() 
            
            return response.json()
            
        except requests.exceptions.HTTPError as http_err:
            logger.error(f"HTTP error occurred: {http_err} - Status: {http_err.response.status_code}", exc_info=True) # Changed print to logger.error
            if hasattr(http_err.response, 'text'):
                logger.error(f"Response body: {http_err.response.text[:500]}") # Changed print to logger.error
            return None
        except json.JSONDecodeError as json_err:
            logger.error(f"JSONDecodeError: {json_err} - Failed to decode JSON from response.", exc_info=True) # Changed print to logger.error
            if 'response' in locals() and hasattr(response, 'text') and "application/json" in content_type:
                 response_text = response.text
                 logger.error(f"Problematic JSON Response text (first 500 chars): {response_text[:500]}") # Changed print to logger.error
            return None
        except requests.exceptions.RequestException as e: 
            logger.error(f"Request failed: {e}", exc_info=True) # Changed print to logger.error
            if hasattr(e, 'response') and e.response is not None and hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text[:500]}") # Changed print to logger.error
            return None
    
    def search_items(self, query: str = "", size: int = 20, page: int = 0, 
                    scope: str = None, filters: Optional[Dict[str, str]] = None, expand: Optional[str] = None) -> List[Dict]:
        """
        Search for items in DSpace.
        Args:
            query: Search query string (behavior varies by DSpace version).
            size: Number of results per page.
            page: Page number (0-indexed).
            scope: UUID of collection/community to search within.
            filters: Additional filters (DSpace 7 specific for now).
            expand: Comma-separated list of elements to expand (e.g., "metadata,bitstreams").
        Returns:
            List of item dictionaries.
        """
        params = {}
        
        if self.dspace_version.startswith("6"):
            params["limit"] = min(size, 100) # DSpace 6 often uses limit
            params["offset"] = page * params["limit"]
            if expand:
                params["expand"] = expand
            else: # Default expand for D6 search results
                params["expand"] = "metadata" 

            # DSpace 6 search is simpler.
            # If scope (UUID of collection or community) is provided, search within it.
            # Query and filters are harder to map directly to DSpace 6 general item listing.
            # This implementation will list items, optionally scoped.
            # For actual text querying in D6, one might use /items/find-by-metadata-field or Solr if exposed.
            if scope:
                # Determine if scope is a community or collection to use the right endpoint.
                # This is a simplification; a robust way would be to check the type of the scope UUID.
                # Assuming for now /items can be scoped or we use collection/community specific item lists.
                # Let's try a common pattern: /collections/{uuid}/items or /communities/{uuid}/items
                # For now, we'll assume `scope` is a collection ID for D6 if provided.
                # A more robust solution would be needed if scope could be community for D6 item listing.
                logger.warning("DSpace 6 search_items: 'query' and 'filters' are not directly supported in this simplified version. 'scope' is assumed to be a collection UUID if used.")
                endpoint = f"collections/{scope}/items" if scope else "items"
            else:
                endpoint = "items"
                if query: # Basic query support for D6 /items if available (often not)
                    params["query"] = query # This is speculative for D6 /items

            result = self._make_request(endpoint, params)
            # DSpace 6 /items or /collections/{id}/items returns a list of items directly
            return result if isinstance(result, list) else []

        else: # DSpace 7+
            params["size"] = min(size, 100)
            params["page"] = page
            if query:
                params["query"] = query
            if scope:
                params["scope"] = scope
            if filters:
                for key, value in filters.items(): # DSpace 7 style filters
                    params[key] = value
            if expand: # DSpace 7 also uses expand, but often within _links or specific configurations
                params["expand"] = expand

            endpoint = "discover/search/objects"
            result = self._make_request(endpoint, params)
            
            items = []
            if result and "_embedded" in result and "searchResult" in result["_embedded"]:
                search_results_embedded = result["_embedded"]["searchResult"].get("_embedded")
                if search_results_embedded and "objects" in search_results_embedded:
                    for search_result in search_results_embedded["objects"]:
                        if "_embedded" in search_result and "indexableObject" in search_result["_embedded"]:
                            items.append(search_result["_embedded"]["indexableObject"])
            return items
        
    def get_item_by_id(self, item_id: str, expand: Optional[str] = None) -> Optional[Dict]:
        """Get a specific item by its UUID"""
        params = {}
        if expand:
            params["expand"] = expand
            
        if self.dspace_version.startswith("6"):
            endpoint = f"items/{item_id}"
        else: # DSpace 7+
            endpoint = f"core/items/{item_id}"
        return self._make_request(endpoint, params)

    def get_item_metadata(self, item_id: str) -> Dict[str, Any]:
        """Extract metadata from an item"""
        # For DSpace 6, it's good to expand metadata directly
        expand_options = "metadata" if self.dspace_version.startswith("6") else None
        item = self.get_item_by_id(item_id, expand=expand_options)
        if not item:
            return {}
        
        metadata_dict = {}
        
        # Basic information - common across versions (though field names might slightly vary, 'id' and 'name' are typical)
        metadata_dict["id"] = item.get("uuid", item.get("id", "")) # DSpace 7 uses uuid more prominently, D6 uses id.
        metadata_dict["uuid"] = item.get("uuid", item.get("id", "")) # Ensure uuid is populated
        metadata_dict["name"] = item.get("name", "")
        metadata_dict["handle"] = item.get("handle", "")
        if self.dspace_version.startswith("6"):
            metadata_dict["lastModified"] = item.get("lastModified", "") # DSpace 6 has this top-level
        else: # DSpace 7+
            metadata_dict["lastModified"] = item.get("lastModified", "") # DSpace 7 also has this

        # Extract metadata fields
        if self.dspace_version.startswith("6"):
            # DSpace 6: item["metadata"] is List[Dict[str, str]] (e.g., [{"key": "dc.title", "value": "Title1"}])
            if "metadata" in item and isinstance(item["metadata"], list):
                for meta_entry in item["metadata"]:
                    key = meta_entry.get("key")
                    value = meta_entry.get("value")
                    if key and value is not None:
                        if key in metadata_dict:
                            if isinstance(metadata_dict[key], list):
                                metadata_dict[key].append(value)
                            else:
                                metadata_dict[key] = [metadata_dict[key], value]
                        else:
                            metadata_dict[key] = value
        else: # DSpace 7+
            # DSpace 7: item["metadata"] is Dict[str, List[Dict[str, str]]] (e.g., {"dc.title": [{"value": "Title1"}]})
            if "metadata" in item and isinstance(item["metadata"], dict):
                for field, values_list in item["metadata"].items():
                    if values_list:
                        extracted_values = [v.get("value", "") for v in values_list if isinstance(v, dict)]
                        if len(extracted_values) == 1:
                            metadata_dict[field] = extracted_values[0]
                        elif len(extracted_values) > 1:
                            metadata_dict[field] = extracted_values
                        # If extracted_values is empty, do nothing to avoid empty lists for non-existent values.
        
        return metadata_dict

    def get_collections(self, size: int = 50, page: int = 0) -> List[Dict]:
        """Get all collections"""
        if self.dspace_version.startswith("6"):
            params = {"limit": size, "offset": page * size}
            endpoint = "collections"
            result = self._make_request(endpoint, params)
            return result if isinstance(result, list) else []
        else: # DSpace 7+
            params = {"size": size, "page": page} # DSpace 7 uses page
            endpoint = "core/collections"
            result = self._make_request(endpoint, params)
            if result and "_embedded" in result:
                return result["_embedded"].get("collections", [])
            return []
    
    def get_communities(self, size: int = 50, page: int = 0) -> List[Dict]:
        """Get all communities"""
        if self.dspace_version.startswith("6"):
            # DSpace 6 /rest/communities usually returns all top-level communities.
            # Pagination params like limit/offset might not be supported or needed.
            logger.info("DSpace 6: Fetching all top-level communities from /rest/communities.")
            endpoint = "communities"
            result = self._make_request(endpoint) # No params for DSpace 6
            return result if isinstance(result, list) else []
        else: # DSpace 7+
            params = {"size": size, "page": page} # DSpace 7 uses page
            endpoint = "core/communities"
            result = self._make_request(endpoint, params)
            
            if result and "_embedded" in result and "communities" in result["_embedded"]:
                return result["_embedded"].get("communities", [])
            
            logger.warning(f"get_communities (DSpace 7+): Did not receive valid JSON structure or an error occurred. Result (first 200 chars): {str(result)[:200]}")
            return []

    def get_subcommunities(self, community_id: str, size: int = 50, page: int = 0) -> List[Dict]:
        """Get subcommunities of a specific community"""
        if self.dspace_version.startswith("6"):
            params = {"limit": size, "offset": page * size}
            # DSpace 6 uses /communities/{community_id}/communities for subcommunities
            endpoint = f"communities/{community_id}/communities" 
            result = self._make_request(endpoint, params)
            return result if isinstance(result, list) else []
        else: # DSpace 7+
            params = {"size": size, "page": page}
            endpoint = f"core/communities/{community_id}/subcommunities"
            result = self._make_request(endpoint, params)
            if result and "_embedded" in result:
                return result["_embedded"].get("subcommunities", [])
            return []

    def get_community_collections(self, community_id: str, size: int = 50, page: int = 0) -> List[Dict]:
        """Get collections within a specific community"""
        if self.dspace_version.startswith("6"):
            params = {"limit": size, "offset": page * size}
            endpoint = f"communities/{community_id}/collections"
            result = self._make_request(endpoint, params)
            return result if isinstance(result, list) else []
        else: # DSpace 7+
            params = {"size": size, "page": page}
            endpoint = f"core/communities/{community_id}/collections"
            result = self._make_request(endpoint, params)
            if result and "_embedded" in result:
                return result["_embedded"].get("collections", [])
            return []

    def download_bitstream(self, bitstream_id: str, output_path: str = None) -> bool:
        """Download a bitstream (file) from DSpace"""
        if self.dspace_version.startswith("6"):
            endpoint = f"bitstreams/{bitstream_id}/retrieve"
        else: # DSpace 7+
            endpoint = f"core/bitstreams/{bitstream_id}/content"
        
        url = f"{self.api_base_url}/{endpoint.lstrip('/')}"
        
        try:
            response = self.session.get(url, headers=self.headers, stream=True)
            response.raise_for_status()
            
            # Determine filename
            if not output_path:
                content_disp = response.headers.get('content-disposition', '')
                if 'filename=' in content_disp:
                    output_path = content_disp.split('filename=')[1].strip('"')
                else:
                    output_path = f"bitstream_{bitstream_id}"
            
            # Save file
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            logger.info(f"Downloaded: {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"Download failed: {e}", exc_info=True)
            return False
    
    def export_search_results(self, query: str, output_file: str = None, 
                            format: str = "json", max_results: int = 100):
        """Export search results to file"""
        if not output_file:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"dspace_export_{timestamp}.{format}"
        
        all_items = []
        page = 0
        page_size = 20
        
        logger.info(f"Searching DSpace for: '{query}'")
        
        while len(all_items) < max_results:
            items = self.search_items(query, size=page_size, page=page)
            if not items:
                break
                
            for item in items:
                if len(all_items) >= max_results:
                    break
                
                # Get detailed metadata
                metadata = self.get_item_metadata(item["id"])
                all_items.append(metadata)
            
            page += 1
            logger.info(f"Processed page {page}, total items: {len(all_items)}")
        
        # Save results
        if format.lower() == "json":
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(all_items, f, indent=2, ensure_ascii=False)
        elif format.lower() == "csv":
            import pandas as pd
            df = pd.json_normalize(all_items)
            df.to_csv(output_file, index=False, encoding='utf-8')
        
        logger.info(f"Exported {len(all_items)} items to: {output_file}")
        return output_file


def main():
    """Example usage of DSpace Query Tool with hierarchical community features"""
    # Initialize tool
    dspace = DSpaceQueryTool("https://tesis.pucp.edu.pe")
    
    # Set authentication (replace with actual values)
    xsrf_token = "2a228b30-aee6-4ed0-ad6d-670d783e4479"
    jsessionid = "<your_jsessionid>"  # Replace with actual session ID
    
    if jsessionid != "<your_jsessionid>":
        dspace.set_authentication(xsrf_token, jsessionid)
    
    # Example queries
    logger.info("=" * 60)
    logger.info("🔍 DSpace Document Query Tool - Enhanced Community Features")
    logger.info("=" * 60)
    
    # 1. Search for items
    logger.info("\n1. Searching for recent theses...")
    items = dspace.search_items("", size=3)  # Empty query for recent items
    logger.info(f"Found {len(items)} items")
    
    for i, item in enumerate(items[:2], 1):
        logger.info(f"  {i}. {item.get('name', 'Untitled')[:60]}...")
    
    # 2. Get collections
    logger.info("\n2. Available Collections:")
    collections = dspace.get_collections(size=5)
    for i, collection in enumerate(collections[:3], 1):
        logger.info(f"  {i}. {collection.get('name', 'Unnamed')[:50]}...")
    
    # 3. Search communities by name
    logger.info("\n3. Searching communities by name...")
    search_results = dspace.search_communities_by_name("ingeniería", include_subcommunities=True)
    logger.info(f"Found {len(search_results)} communities containing 'ingeniería'")
    
    for i, community in enumerate(search_results[:3], 1):
        logger.info(f"  {i}. {community.get('name', 'Unnamed')}")
        logger.info(f"     Path: {community.get('hierarchy_path', 'N/A')}")
        logger.info(f"     ID: {community.get('id', 'N/A')}")
    
    # 4. Display community tree structure
    logger.info("\n4. Community Tree Structure (first 2 levels):")
    try:
        # Get top-level communities first
        top_communities = dspace.get_communities(size=3)
        for community in top_communities[:2]:
            logger.info(f"📁 {community.get('name', 'Unnamed')}")
            # Get subcommunities
            subcommunities = dspace.get_subcommunities(community.get('id', ''))
            for i, subcomm in enumerate(subcommunities[:3], 1):
                logger.info(f"  └── {subcomm.get('name', 'Unnamed')}")
    except Exception as e:
        logger.error(f"  ❌ Error displaying tree: {e}", exc_info=True)
    
    # 5. Export search results
    logger.info("\n5. Exporting search results...")
    try:
        export_file = dspace.export_search_results("machine learning", max_results=5)
        logger.info(f"Results exported to: {export_file}")
    except Exception as e:
        logger.error(f"  ❌ Export failed: {e}", exc_info=True)


if __name__ == "__main__":
    main()