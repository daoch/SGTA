from fastapi import FastAPI
from typing import Optional # Add Optional for type hinting
from .controller.asignacion_controller import asignar_temas_bloques
from .controller.similarity_controller import similarity_endpoint
from .controller.faiss_controller import (
    add_topics_endpoint, search_topics_endpoint, 
    get_faiss_stats_endpoint, rebuild_index_endpoint,
    list_topics_endpoint, search_topics_by_title_endpoint,
    clear_index_endpoint, remove_topic_endpoint,
    search_temp_embedding_endpoint
)

# Import OAI controller functions
from .controller.oai_controller import (
    get_current_oai_endpoint, update_oai_endpoint,
    get_oai_repository_sets, refresh_oai_repository_sets_cache,
    get_all_oai_records, get_oai_records_by_set, get_oai_single_record
)

from .models import (
    AddTopicsRequest, AddTopicsResponse,
    SearchTopicsRequest, SearchTopicsResponse,
    FAISSStatsResponse, ListTopicsResponse,
    SearchTempRequest, SearchTempResponse,
    OAIEndpointUpdateRequest, OAIEndpointResponse, OAIRecord, OAIResponse # Add OAI models
)
import uvicorn

app = FastAPI()

app.post("/asignar")(asignar_temas_bloques)
app.post("/similarity")(similarity_endpoint)

# FAISS-based topic similarity endpoints
@app.post("/topics/add", response_model=AddTopicsResponse)
def add_topics(request: AddTopicsRequest):
    """Add topics to FAISS index for fast similarity search"""
    return add_topics_endpoint(request)

@app.post("/topics/search", response_model=SearchTopicsResponse)
def search_topics(request: SearchTopicsRequest):
    """Search for similar topics using FAISS (fast!)"""
    return search_topics_endpoint(request)

@app.get("/topics/stats", response_model=FAISSStatsResponse)
def get_faiss_stats():
    """Get FAISS index statistics"""
    return get_faiss_stats_endpoint()

@app.post("/topics/rebuild")
def rebuild_faiss_index():
    """Rebuild FAISS index to optimize performance"""
    return rebuild_index_endpoint()

@app.get("/topics/list", response_model=ListTopicsResponse)
def list_all_topics(include_deleted: bool = False):
    """List all topics in FAISS cache"""
    return list_topics_endpoint(include_deleted)

@app.get("/topics/search-by-title")
def search_topics_by_title(title_query: str, limit: int = 20):
    """Search topics by title (simple text matching, not semantic)"""
    return search_topics_by_title_endpoint(title_query, limit)

@app.post("/topics/clear")
def clear_faiss_index():
    """Completely clear FAISS index and cache (for fresh start from Java app)"""
    return clear_index_endpoint()

@app.post("/topics/search-temp", response_model=SearchTempResponse)
def search_with_temp_embedding(request: SearchTempRequest):
    """Search for similar topics using temporary embedding (no persistence)"""
    return search_temp_embedding_endpoint(request)

@app.delete("/topics/{topic_id}")
def remove_topic(topic_id: str):
    """Remove a topic from FAISS index (soft delete)"""
    return remove_topic_endpoint(topic_id)

@app.get("/topics/{topic_id}")
def get_topic_by_id(topic_id: str):
    """Get specific topic by ID"""
    from .service.faiss_service import faiss_service
    try:
        topic = faiss_service.get_topic_by_id(topic_id)
        if topic is None:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Topic not found")
        return topic
    except Exception as e:
        import logging
        from fastapi import HTTPException
        logging.error(f"Error getting topic by ID: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# OAI-PMH Repository API endpoints
@app.get("/oai/config/endpoint", response_model=OAIEndpointResponse, summary="Get current OAI-PMH endpoint URL", tags=["OAI-PMH Configuration"])
def handle_get_current_oai_endpoint():
    return get_current_oai_endpoint()

@app.put("/oai/config/endpoint", response_model=OAIEndpointResponse, summary="Update OAI-PMH endpoint URL", tags=["OAI-PMH Configuration"])
def handle_update_oai_endpoint(request: OAIEndpointUpdateRequest):
    return update_oai_endpoint(request)

@app.get("/oai/sets", summary="List all OAI sets (collections)", tags=["OAI-PMH Harvesting"])
def handle_get_oai_sets(force_refresh: bool = False):
    return get_oai_repository_sets(force_refresh)

@app.post("/oai/sets/refresh", summary="Refresh OAI sets cache", tags=["OAI-PMH Harvesting"])
def handle_refresh_oai_sets_cache():
    return refresh_oai_repository_sets_cache()

@app.get("/oai/records", response_model=OAIResponse, summary="Harvest all records from the OAI repository", tags=["OAI-PMH Harvesting"])
def handle_get_all_oai_records(
    max_records_per_set: Optional[int] = None,
    metadata_prefix: str = 'oai_dc'
):
    return get_all_oai_records(max_records_per_set=max_records_per_set, metadata_prefix=metadata_prefix)

@app.get("/oai/records/set/{set_spec}", response_model=OAIResponse, summary="Harvest records for a specific OAI set", tags=["OAI-PMH Harvesting"])
def handle_get_oai_records_by_set(
    set_spec: str,
    max_records: Optional[int] = None,
    metadata_prefix: str = 'oai_dc'
):
    return get_oai_records_by_set(set_spec=set_spec, max_records=max_records, metadata_prefix=metadata_prefix)

@app.get("/oai/records/identifier/{identifier:path}", response_model=OAIResponse, summary="Get a single OAI record by its identifier", tags=["OAI-PMH Harvesting"])
def handle_get_oai_single_record(
    identifier: str, # Path parameter, FastAPI will decode it
    metadata_prefix: str = 'oai_dc'
):
    # The identifier might contain slashes, so it's captured as a path.
    # No need to manually URL decode, FastAPI handles it.
    return get_oai_single_record(identifier=identifier, metadata_prefix=metadata_prefix)

