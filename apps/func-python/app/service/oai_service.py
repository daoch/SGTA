"""
OAI-PMH service for document harvesting
Provides structured access to OAI-PMH compliant repository data
"""

from typing import Dict, List, Optional, Any, Iterator
from datetime import datetime, timezone
import logging
from ..conn_oai import OAIQueryTool
from ..models import OAIRecord, OAIResponse # Placeholder for OAI specific models

logger = logging.getLogger(__name__)

class OAIService:
    """
    Service layer for OAI-PMH repository operations.
    Handles harvesting of sets and records.
    """
    
    def __init__(self, oai_base_url: str):
        """Initialize OAIService"""
        if not oai_base_url:
            raise ValueError("OAI base URL cannot be empty for OAIService.")
        self.oai_base_url = oai_base_url.rstrip('/')
        try:
            self.oai_tool = OAIQueryTool(oai_base_url=self.oai_base_url)
            logger.info(f"OAIService initialized with OAI endpoint: {self.oai_base_url}")
        except ConnectionError as e:
            logger.error(f"Failed to initialize OAIQueryTool for OAIService: {e}")
            # Depending on desired behavior, either raise e or set self.oai_tool to None
            # and handle it in other methods. For now, let it raise.
            raise
            
        self._repository_sets_cache: List[Dict[str, str]] | None = None
        self._sets_cache_last_updated: datetime | None = None
        
        # Record count cache for efficient pagination
        self._record_count_cache: Dict[str, int] = {}  # key: f"{set_spec}:{metadata_prefix}"
        self._count_cache_last_updated: Dict[str, datetime] = {}
        
        # Records cache for recently accessed data
        self._records_cache: Dict[str, List[OAIRecord]] = {}  # key: f"{set_spec}:{metadata_prefix}:{offset}:{limit}"
        self._records_cache_last_updated: Dict[str, datetime] = {}

    def _is_cache_valid(self, cache_lifetime_seconds: int = 3600) -> bool:
        """Checks if the sets cache is still valid."""
        if self._repository_sets_cache is None or self._sets_cache_last_updated is None:
            return False
        cache_age = (datetime.now(timezone.utc) - self._sets_cache_last_updated).total_seconds()
        return cache_age < cache_lifetime_seconds
    
    def _is_count_cache_valid(self, cache_key: str, cache_lifetime_seconds: int = 7200) -> bool:
        """Checks if a specific count cache entry is still valid (2 hour default)."""
        if cache_key not in self._record_count_cache or cache_key not in self._count_cache_last_updated:
            return False
        cache_age = (datetime.now(timezone.utc) - self._count_cache_last_updated[cache_key]).total_seconds()
        return cache_age < cache_lifetime_seconds
    
    def _is_records_cache_valid(self, cache_key: str, cache_lifetime_seconds: int = 1800) -> bool:
        """Checks if a specific records cache entry is still valid (30 min default)."""
        if cache_key not in self._records_cache or cache_key not in self._records_cache_last_updated:
            return False
        cache_age = (datetime.now(timezone.utc) - self._records_cache_last_updated[cache_key]).total_seconds()
        return cache_age < cache_lifetime_seconds
    
    def _get_count_cache_key(self, set_spec: Optional[str], metadata_prefix: str) -> str:
        """Generate cache key for record counts."""
        return f"{set_spec or 'all'}:{metadata_prefix}"
    
    def _get_records_cache_key(self, set_spec: Optional[str], metadata_prefix: str, 
                              offset: Optional[int], limit: Optional[int]) -> str:
        """Generate cache key for records."""
        return f"{set_spec or 'all'}:{metadata_prefix}:{offset or 0}:{limit or 'all'}"
    
    def _cleanup_old_cache_entries(self, max_cache_entries: int = 100) -> None:
        """Clean up old cache entries to prevent memory issues."""
        # Clean up records cache if too large
        if len(self._records_cache) > max_cache_entries:
            # Remove oldest entries
            sorted_keys = sorted(self._records_cache_last_updated.items(), key=lambda x: x[1])
            keys_to_remove = [key for key, _ in sorted_keys[:len(sorted_keys) // 2]]
            for key in keys_to_remove:
                self._records_cache.pop(key, None)
                self._records_cache_last_updated.pop(key, None)
        
        # Clean up count cache if too large
        if len(self._record_count_cache) > max_cache_entries:
            sorted_keys = sorted(self._count_cache_last_updated.items(), key=lambda x: x[1])
            keys_to_remove = [key for key, _ in sorted_keys[:len(sorted_keys) // 2]]
            for key in keys_to_remove:
                self._record_count_cache.pop(key, None)
                self._count_cache_last_updated.pop(key, None)

    def refresh_repository_sets_cache(self, force_refresh: bool = False) -> bool:
        """
        Refreshes the cache of OAI sets (collections).

        Args:
            force_refresh: If True, forces a refresh even if the cache is considered valid.

        Returns:
            True if the cache was successfully refreshed, False otherwise.
        """
        if not force_refresh and self._is_cache_valid():
            logger.info("OAI sets cache is still valid. Skipping refresh.")
            return True

        logger.info("Refreshing OAI repository sets cache...")
        try:
            sets = self.oai_tool.list_sets()
            if sets is not None: # list_sets returns [] on error, so explicit None check might not be needed if it always returns a list
                self._repository_sets_cache = sets
                self._sets_cache_last_updated = datetime.now(timezone.utc)
                logger.info(f"Successfully refreshed OAI sets cache. Found {len(sets)} sets.")
                return True
            else: # Should not happen if list_sets always returns a list
                logger.warning("Failed to refresh OAI sets cache: list_sets returned None.")
                self._repository_sets_cache = None # Invalidate cache
                return False
        except Exception as e:
            logger.error(f"Error refreshing OAI sets cache: {e}", exc_info=True)
            self._repository_sets_cache = None # Invalidate cache
            return False

    def get_repository_sets(self, auto_refresh_if_empty: bool = True, force_refresh: bool = False) -> List[Dict[str, str]]:
        """
        Retrieves all OAI sets (collections) from the repository, using a cache.

        Args:
            auto_refresh_if_empty: If True and the cache is empty/invalid, trigger a refresh.
            force_refresh: If True, forces a refresh of the cache.
        
        Returns:
            A list of dictionaries, where each dictionary represents an OAI set 
            (e.g., {"setSpec": "...", "setName": "..."}). Returns empty list on failure.
        """
        if force_refresh or (auto_refresh_if_empty and not self._is_cache_valid()):
            self.refresh_repository_sets_cache(force_refresh=force_refresh)
        
        return self._repository_sets_cache if self._repository_sets_cache is not None else []

    def get_records_count_cached(self, set_spec: Optional[str] = None, 
                                metadata_prefix: str = 'oai_dc', 
                                force_refresh: bool = False) -> int:
        """
        Get the total count of records for a set with caching.
        
        Args:
            set_spec: The setSpec of the OAI set. If None, counts all records.
            metadata_prefix: The metadata prefix to use.
            force_refresh: If True, bypasses cache and fetches fresh count.
            
        Returns:
            Total number of records available.
        """
        cache_key = self._get_count_cache_key(set_spec, metadata_prefix)
        
        # Return cached count if valid and not forcing refresh
        if not force_refresh and self._is_count_cache_valid(cache_key):
            logger.info(f"Returning cached count for {cache_key}: {self._record_count_cache[cache_key]}")
            return self._record_count_cache[cache_key]
        
        # Fetch fresh count
        logger.info(f"Fetching fresh count for {cache_key}...")
        try:
            count = self.oai_tool.count_records(metadata_prefix=metadata_prefix, set_spec=set_spec)
            
            # Cache the result
            self._record_count_cache[cache_key] = count
            self._count_cache_last_updated[cache_key] = datetime.now(timezone.utc)
            
            # Cleanup old entries periodically
            self._cleanup_old_cache_entries()
            
            logger.info(f"Cached fresh count for {cache_key}: {count}")
            return count
            
        except Exception as e:
            logger.error(f"Error getting cached record count for {cache_key}: {e}", exc_info=True)
            # Return cached value if available, even if stale
            return self._record_count_cache.get(cache_key, 0)

    def _format_oai_record(self, oai_record_data: Dict[str, Any]) -> Optional[OAIRecord]:
        """
        Formats raw OAI record data (header and metadata) into an OAIRecord Pydantic model.
        This is a basic example and needs to be adapted based on the actual OAIRecord model structure
        and the metadata format (e.g., oai_dc).
        """
        try:
            header = oai_record_data.get("header", {})
            metadata = oai_record_data.get("metadata", {}) # This is already a dict from Sickle

            # Helper to consistently extract and type-cast metadata fields
            def get_meta_field(key: str, default: Any = None, return_list: bool = False) -> Any:
                value = metadata.get(key)
                
                if value is None: # No value found
                    return [] if return_list else default

                if return_list: # Expecting a list of strings
                    if isinstance(value, list):
                        return [str(v) for v in value if v is not None]
                    else: # Single value, wrap in list
                        return [str(value)]
                else: # Expecting a single string value
                    if isinstance(value, list):
                        return str(value[0]) if value and value[0] is not None else default
                    else:
                        return str(value)

            identifier = str(header.get("identifier", ""))
            datestamp = str(header.get("datestamp", ""))
            set_specs = [str(s) for s in header.get("setSpecs", []) if s is not None]

            title = get_meta_field("title", default="No Title Provided")
            
            # dc:creator often used for authors
            authors = get_meta_field("creator", return_list=True) 
            
            # dc:description can be a list, join them
            description_list = get_meta_field("description", return_list=True)
            description_str = ' '.join(d for d in description_list if d)

            subjects = get_meta_field("subject", return_list=True)
            
            # dc:date often used for issued date
            date_issued = get_meta_field("date") 
            publisher = get_meta_field("publisher")
            
            # dc:type for record type
            record_type = get_meta_field("type")
            language = get_meta_field("language")

            # The OAIRecord model is currently a placeholder comment in this file.
            # This will raise a NameError until OAIRecord is properly defined and imported.
            return OAIRecord(
                identifier=identifier,
                datestamp=datestamp,
                set_specs=set_specs,
                title=title,
                authors=authors,
                description=description_str,
                subjects=subjects,
                date_issued=date_issued,
                publisher=publisher,
                record_type=record_type,
                language=language,
                source_url=f"{self.oai_base_url}?verb=GetRecord&metadataPrefix=oai_dc&identifier={identifier}",
                metadata=metadata 
            )
        except Exception as e:
            # Ensure header is available for logging, even if partially formed
            log_identifier = header.get('identifier', 'UNKNOWN_IDENTIFIER') if isinstance(header, dict) else 'UNKNOWN_IDENTIFIER'
            logger.error(f"Error formatting OAI record {log_identifier}: {e}", exc_info=True)
            return None

    def get_all_records_from_repository(self, 
                                        max_records_per_set: Optional[int] = None,
                                        metadata_prefix: str = 'oai_dc') -> OAIResponse:
        """
        Retrieves all records from all sets in the OAI-PMH repository.

        Args:
            max_records_per_set: Optional limit for records per set. If None, fetches all.
            metadata_prefix: The metadata prefix to request (e.g., 'oai_dc').

        Returns:
            An OAIResponse object containing the retrieved records and processing summary.
        """
        all_oai_records: List[OAIRecord] = []
        total_records_harvested = 0
        processed_sets_count = 0
        
        logger.info(f"Starting to fetch all records from OAI repository. Max per set: {max_records_per_set}, Prefix: {metadata_prefix}")

        try:
            sets = self.get_repository_sets(auto_refresh_if_empty=True)
            if not sets:
                logger.warning("No OAI sets found or cache is empty. Cannot fetch records.")
                return OAIResponse(
                    success=False, 
                    message="Failed to retrieve OAI sets for fetching records.",
                    error="OAI sets list is empty."
                )

            for oai_set in sets:
                set_spec = oai_set.get("setSpec")
                set_name = oai_set.get("setName", "Unknown Set")
                if not set_spec:
                    logger.warning(f"Skipping set without setSpec: {set_name}")
                    continue
                
                processed_sets_count += 1
                logger.info(f"Processing OAI set: {set_name} (Spec: {set_spec})")
                
                try:
                    records_iterator = self.oai_tool.list_records(
                        metadata_prefix=metadata_prefix, 
                        set_spec=set_spec
                    )
                    
                    records_in_set_count = 0
                    for i, raw_record_data in enumerate(records_iterator):
                        if max_records_per_set is not None and i >= max_records_per_set:
                            logger.info(f"Reached max_records_per_set ({max_records_per_set}) for set {set_name}.")
                            break
                        
                        formatted_record = self._format_oai_record(raw_record_data)
                        if formatted_record:
                            all_oai_records.append(formatted_record)
                            total_records_harvested += 1
                            records_in_set_count +=1
                    logger.info(f"  Harvested {records_in_set_count} records from set {set_name}.")

                except Exception as e:
                    logger.error(f"  Error processing records for set {set_spec} ({set_name}): {e}", exc_info=True)
            
            logger.info(f"Finished processing all OAI sets. Total records harvested: {total_records_harvested}")
            return OAIResponse(
                success=True,
                message=f"Successfully processed {processed_sets_count} OAI sets. Harvested {total_records_harvested} records.",
                total_records_harvested=total_records_harvested,
                total_sets_processed=processed_sets_count,
                records=all_oai_records
            )

        except Exception as e:
            logger.error(f"Error in get_all_records_from_repository: {e}", exc_info=True)
            return OAIResponse(
                success=False,
                message="An unexpected error occurred while retrieving all records from OAI repository.",
                error=str(e),
                total_records_harvested=total_records_harvested,
                total_sets_processed=processed_sets_count,
                records=[]
            )

    def get_records_by_set(self, set_spec: str, metadata_prefix: str = 'oai_dc', 
                          max_records: Optional[int] = None, offset: Optional[int] = None, 
                          include_total_count: bool = False) -> OAIResponse:
        """
        Retrieves records for a specific OAI set with pagination support.

        Args:
            set_spec: The setSpec of the OAI set.
            metadata_prefix: The metadata prefix.
            max_records: Optional limit for the number of records to retrieve.
            offset: Optional number of records to skip before starting to return records.
            include_total_count: Whether to include total count in response (slower operation).

        Returns:
            An OAIResponse object with pagination information.
        """
        oai_records: List[OAIRecord] = []
        records_harvested_count = 0
        total_available = None
        
        logger.info(f"Fetching records for set_spec: {set_spec}, prefix: {metadata_prefix}, max_records: {max_records}, offset: {offset}")
        
        # Check cache first
        cache_key = self._get_records_cache_key(set_spec, metadata_prefix, offset, max_records)
        if not include_total_count and self._is_records_cache_valid(cache_key):
            logger.info(f"Returning cached records for {cache_key}")
            cached_records = self._records_cache[cache_key]
            return OAIResponse(
                success=True,
                message=f"Retrieved {len(cached_records)} cached records for set {set_spec}.",
                total_records_harvested=len(cached_records),
                total_sets_processed=1,
                records=cached_records,
                set_spec_filter=set_spec
            )

        try:
            # Get total count if requested (expensive operation)
            if include_total_count:
                total_available = self.get_records_count_cached(set_spec=set_spec, metadata_prefix=metadata_prefix)
            
            # Use paginated record fetching
            records_iterator = self.oai_tool.list_records(
                metadata_prefix=metadata_prefix, 
                set_spec=set_spec,
                limit=max_records,
                offset=offset
            )
            
            for raw_record_data in records_iterator:
                formatted_record = self._format_oai_record(raw_record_data)
                if formatted_record:
                    oai_records.append(formatted_record)
                    records_harvested_count += 1
            
            # Cache the results (if reasonable size)
            if records_harvested_count <= 100:  # Don't cache very large result sets
                self._records_cache[cache_key] = oai_records
                self._records_cache_last_updated[cache_key] = datetime.now(timezone.utc)
                self._cleanup_old_cache_entries()
            
            logger.info(f"Harvested {records_harvested_count} records for set {set_spec}.")
            
            response = OAIResponse(
                success=True,
                message=f"Successfully harvested {records_harvested_count} records for set {set_spec}.",
                total_records_harvested=records_harvested_count,
                total_sets_processed=1,
                records=oai_records,
                set_spec_filter=set_spec
            )
            
            # Add pagination metadata if total count was requested
            if total_available is not None:
                response.total_available = total_available
                response.has_more = (offset or 0) + records_harvested_count < total_available
            
            return response
        except Exception as e:
            logger.error(f"Error fetching records for set {set_spec}: {e}", exc_info=True)
            return OAIResponse(
                success=False,
                message=f"Failed to harvest records for set {set_spec}.",
                error=str(e),
                set_spec_filter=set_spec
            )

    def get_single_record(self, identifier: str, metadata_prefix: str = 'oai_dc') -> OAIResponse:
        """
        Retrieves a single record by its OAI identifier.

        Args:
            identifier: The OAI identifier of the record.
            metadata_prefix: The metadata prefix.

        Returns:
            An OAIResponse object. If successful, 'records' list will contain one item.
        """
        logger.info(f"Fetching single record with identifier: {identifier}, prefix: {metadata_prefix}")
        try:
            raw_record_data = self.oai_tool.get_record(identifier=identifier, metadata_prefix=metadata_prefix)
            if raw_record_data:
                formatted_record = self._format_oai_record(raw_record_data)
                if formatted_record:
                    return OAIResponse(
                        success=True,
                        message=f"Successfully retrieved record {identifier}.",
                        total_records_harvested=1,
                        records=[formatted_record]
                    )
                else:
                    return OAIResponse(success=False, message=f"Failed to format record {identifier}.", error="Formatting error.")
            else:
                return OAIResponse(success=False, message=f"Record {identifier} not found or error retrieving it.", error="Record not found or OAI tool error.")
        except Exception as e:
            logger.error(f"Error fetching single record {identifier}: {e}", exc_info=True)
            return OAIResponse(success=False, message=f"Failed to retrieve record {identifier}.", error=str(e))
