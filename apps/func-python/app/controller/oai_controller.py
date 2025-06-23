"""
OAI-PMH controller for exposing repository harvesting APIs
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List, Optional
import logging

# Assuming your models are in app.models and service in app.service
from ..models import (
    OAIEndpointUpdateRequest, OAIEndpointResponse, OAIRecord, OAIResponse # OAI specific models
)
from ..service.oai_service import OAIService # Corrected import path

logger = logging.getLogger(__name__)

# Default OAI Configuration Constants
DEFAULT_OAI_BASE_URL = "https://tesis.pucp.edu.pe/oai/request" # Example, adjust as needed

# Global variables for current OAI configuration
CURRENT_OAI_BASE_URL = DEFAULT_OAI_BASE_URL

_oai_service_instance: OAIService | None = None
_current_oai_url_for_service: str = CURRENT_OAI_BASE_URL

def get_oai_service_instance() -> OAIService:
    global _oai_service_instance
    global _current_oai_url_for_service
    global CURRENT_OAI_BASE_URL

    if _oai_service_instance is None or _current_oai_url_for_service != CURRENT_OAI_BASE_URL:
        logger.info(f"Re-initializing OAIService with OAI Base URL: {CURRENT_OAI_BASE_URL}")
        try:
            _oai_service_instance = OAIService(oai_base_url=CURRENT_OAI_BASE_URL)
            _current_oai_url_for_service = CURRENT_OAI_BASE_URL
        except ValueError as ve:
            logger.error(f"ValueError during OAIService initialization: {ve}")
            raise HTTPException(status_code=400, detail=str(ve))
        except ConnectionError as ce:
            logger.error(f"ConnectionError during OAIService initialization: {ce}")
            # This error might occur if the OAI endpoint is invalid or unreachable at init time.
            # Depending on requirements, you might want to allow the app to start and handle this later,
            # or prevent startup. For now, raising HTTPException to signal immediate issue.
            raise HTTPException(status_code=503, detail=f"Could not connect to OAI endpoint: {ce}")
    return _oai_service_instance

# Controller Functions

# Endpoint to get the current OAI base URL
def get_current_oai_endpoint() -> OAIEndpointResponse:
    logger.info(f"Querying current OAI base URL: {CURRENT_OAI_BASE_URL}")
    return OAIEndpointResponse(
        message="Current OAI base URL retrieved.",
        current_oai_base_url=CURRENT_OAI_BASE_URL
    )

# Endpoint to update the OAI base URL
def update_oai_endpoint(request: OAIEndpointUpdateRequest) -> OAIEndpointResponse:
    global CURRENT_OAI_BASE_URL
    global _oai_service_instance # To reset the service instance
    global _current_oai_url_for_service

    previous_url = CURRENT_OAI_BASE_URL
    new_url = request.oai_base_url.strip()

    if not new_url:
        raise HTTPException(status_code=400, detail="OAI base URL cannot be empty.")
    if not new_url.startswith("http://") and not new_url.startswith("https://"):
        logger.error(f"Invalid OAI base URL provided: {new_url}. Must start with http:// or https://")
        raise HTTPException(status_code=400, detail="Invalid OAI base URL. Must start with http:// or https://")

    CURRENT_OAI_BASE_URL = new_url

    # Reset service instance so it's recreated with the new configuration
    _oai_service_instance = None 
    _current_oai_url_for_service = "" # Force re-init by making it different
    
    logger.info(f"OAI base URL updated from '{previous_url}' to '{CURRENT_OAI_BASE_URL}'")

    # Attempt to create a new service instance to validate the new URL immediately
    try:
        get_oai_service_instance() # This will try to initialize with the new URL
        message = f"OAI base URL updated to '{CURRENT_OAI_BASE_URL}'. Service re-initialized."
    except HTTPException as http_exc: # Catch exceptions from get_oai_service_instance
        # If service init fails, revert to previous URL or handle as an error state
        # For now, we'll report the error but keep the URL change, user can try again or fix.
        # Alternatively, revert: CURRENT_OAI_BASE_URL = previous_url
        logger.error(f"Failed to re-initialize OAIService with new URL {CURRENT_OAI_BASE_URL}: {http_exc.detail}")
        message = f"OAI base URL updated to '{CURRENT_OAI_BASE_URL}', but service initialization failed: {http_exc.detail}"
        # We might want to raise an error here to indicate the update was problematic
        # raise HTTPException(status_code=400, detail=f"OAI URL updated, but service connection failed: {http_exc.detail}")

    return OAIEndpointResponse(
        message=message,
        current_oai_base_url=CURRENT_OAI_BASE_URL
    )

# Endpoint to get OAI repository sets (collections)
def get_oai_repository_sets(force_refresh: bool = Query(False, description="Force a refresh of the sets cache.")) -> Dict[str, Any]:
    oai_service = get_oai_service_instance()
    try:
        sets = oai_service.get_repository_sets(auto_refresh_if_empty=True, force_refresh=force_refresh)
        return {
            "success": True, 
            "message": f"Retrieved {len(sets)} OAI sets.",
            "count": len(sets),
            "sets": sets
            }
    except Exception as e:
        logger.error(f"Error getting OAI repository sets: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to retrieve OAI sets: {str(e)}")

# Endpoint to refresh OAI repository sets cache
def refresh_oai_repository_sets_cache() -> Dict[str, Any]:
    oai_service = get_oai_service_instance()
    try:
        refreshed = oai_service.refresh_repository_sets_cache(force_refresh=True)
        if refreshed:
            count = len(oai_service._repository_sets_cache) if oai_service._repository_sets_cache else 0
            return {"success": True, "message": f"OAI sets cache refreshed successfully. Found {count} sets."}
        else:
            raise HTTPException(status_code=500, detail="Failed to refresh OAI sets cache.")
    except Exception as e:
        logger.error(f"Error refreshing OAI sets cache: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to refresh OAI sets cache: {str(e)}")

# Endpoint to get all records from the OAI repository
def get_all_oai_records(
    max_records_per_set: Optional[int] = Query(None, description="Maximum records to fetch per set. Fetches all if None."),
    metadata_prefix: str = Query("oai_dc", description="The metadata prefix to request (e.g., 'oai_dc').")
) -> OAIResponse:
    oai_service = get_oai_service_instance()
    try:
        logger.info(f"Controller: Attempting to retrieve all OAI records. Max per set: {max_records_per_set}, Prefix: {metadata_prefix}")
        result = oai_service.get_all_records_from_repository(
            max_records_per_set=max_records_per_set,
            metadata_prefix=metadata_prefix
        )
        
        if not result.success:
            error_detail = result.error or "Failed to retrieve all OAI records."
            logger.error(f"Service call to get_all_records_from_repository failed: {error_detail}")
            raise HTTPException(status_code=500, detail=error_detail)
            
        logger.info(f"Successfully retrieved {result.total_records_harvested} OAI records from {result.total_sets_processed} sets.")
        return result
        
    except HTTPException: # Re-raise HTTPException if already handled
        raise
    except Exception as e:
        logger.error(f"Controller error in get_all_oai_records: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

# Endpoint to get records for a specific OAI set with pagination
def get_oai_records_by_set(
    set_spec: str = Query(..., description="The setSpec of the OAI set to harvest records from."),
    limit: Optional[int] = Query(None, description="Maximum records to fetch (pagination limit)."),
    offset: Optional[int] = Query(None, description="Number of records to skip (pagination offset)."),
    include_total_count: bool = Query(False, description="Include total count in response (slower operation)."),
    metadata_prefix: str = Query("oai_dc", description="The metadata prefix (e.g., 'oai_dc').")
) -> OAIResponse:
    oai_service = get_oai_service_instance()
    try:
        logger.info(f"Controller: Getting records for set: {set_spec}, Limit: {limit}, Offset: {offset}, Include count: {include_total_count}, Prefix: {metadata_prefix}")
        result = oai_service.get_records_by_set(
            set_spec=set_spec,
            max_records=limit,
            offset=offset,
            include_total_count=include_total_count,
            metadata_prefix=metadata_prefix
        )
        if not result.success:
            raise HTTPException(status_code=500, detail=result.error or f"Failed to get records for set {set_spec}")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting records for OAI set {set_spec}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get records for set {set_spec}: {str(e)}")

# Endpoint to get a single OAI record by identifier
def get_oai_single_record(
    identifier: str = Query(..., description="The OAI identifier of the record."),
    metadata_prefix: str = Query("oai_dc", description="The metadata prefix (e.g., 'oai_dc').")
) -> OAIResponse:
    oai_service = get_oai_service_instance()
    try:
        logger.info(f"Controller: Getting single record by ID: {identifier}, Prefix: {metadata_prefix}")
        result = oai_service.get_single_record(identifier=identifier, metadata_prefix=metadata_prefix)
        if not result.success:
            status_code = 404 if "not found" in (result.error or "").lower() else 500
            raise HTTPException(status_code=status_code, detail=result.error or f"Failed to get record {identifier}")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting single OAI record {identifier}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get record {identifier}: {str(e)}")

# Endpoint to get record count for a specific set (for pagination)
def get_oai_records_count(
    set_spec: str = Query(..., description="The setSpec of the OAI set to count records from."),
    metadata_prefix: str = Query("oai_dc", description="The metadata prefix (e.g., 'oai_dc')."),
    force_refresh: bool = Query(False, description="Force a fresh count (bypasses cache).")
) -> Dict[str, Any]:
    oai_service = get_oai_service_instance()
    try:
        logger.info(f"Controller: Getting record count for set: {set_spec}, Prefix: {metadata_prefix}, Force refresh: {force_refresh}")
        count = oai_service.get_records_count_cached(
            set_spec=set_spec,
            metadata_prefix=metadata_prefix,
            force_refresh=force_refresh
        )
        return {
            "success": True,
            "message": f"Successfully retrieved count for set {set_spec}.",
            "set_spec": set_spec,
            "total_count": count,
            "metadata_prefix": metadata_prefix
        }
    except Exception as e:
        logger.error(f"Error getting record count for set {set_spec}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get record count for set {set_spec}: {str(e)}")

# Note: Async import functionality is handled by the Java backend
# The Python microservice only provides OAI data fetching capabilities
# Database operations and tema creation are managed by Java/Spring Boot

# Deprecated DSpace-specific functions (can be removed or commented out)
# def set_dspace_authentication(request: DSpaceAuthRequest) -> Dict[str, Any]: ...
# def search_dspace_documents(request: DocumentSearchRequest) -> Dict[str, Any]: ...
# def get_dspace_communities(include_hierarchy: bool = Query(True, description="Include hierarchical structure")) -> Dict[str, Any]: ...
# def search_dspace_communities(request: CommunitySearchRequest) -> Dict[str, Any]: ...
# def get_dspace_collections(community_id: Optional[str] = Query(None, description="Community ID to filter collections")) -> Dict[str, Any]: ...
# def get_dspace_document_by_id(item_id: str) -> Dict[str, Any]: ...
# def bulk_search_by_topics(request: BulkTopicSearchRequest) -> Dict[str, Any]: ...
# def get_ingestion_ready_documents(request: IngestionRequest) -> Dict[str, Any]: ...
# def get_dspace_statistics() -> Dict[str, Any]: ...
# def get_ingenieria_informatica_documents(...) -> IngenieriaInformaticaSearchResponse: ...
# def get_all_dspace_documents(...) -> AllDSpaceDocumentsResponse: ...
