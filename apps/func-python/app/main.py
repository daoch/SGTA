from fastapi import FastAPI
from .controller.asignacion_controller import asignar_temas_bloques
from .controller.similarity_controller import similarity_endpoint
from .controller.faiss_controller import (
    add_topics_endpoint, search_topics_endpoint, 
    get_faiss_stats_endpoint, rebuild_index_endpoint,
    list_topics_endpoint, search_topics_by_title_endpoint,
    clear_index_endpoint, remove_topic_endpoint,
    search_temp_embedding_endpoint
)
from .models import (
    AddTopicsRequest, AddTopicsResponse,
    SearchTopicsRequest, SearchTopicsResponse,
    FAISSStatsResponse, ListTopicsResponse
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

@app.get("/topics/search-temp")
def search_with_temp_embedding(query_text: str, top_k: int = 10, threshold: float = 0.0):
    """Search for similar topics using temporary embedding (no persistence)"""
    return search_temp_embedding_endpoint(query_text, top_k, threshold)

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

    #Para desarrollo
    #uvicorn.run(app, host="0.0.0.0", port=8000)

