from fastapi import HTTPException
from ..models import (
    AddTopicsRequest, AddTopicsResponse,
    SearchTopicsRequest, SearchTopicsResponse, TopicResult,
    FAISSStatsResponse, ListTopicsResponse
)
from ..service.faiss_service import faiss_service
import logging

def add_topics_endpoint(request: AddTopicsRequest) -> AddTopicsResponse:
    """Add topics to FAISS index for fast similarity search"""
    try:
        if not request.topics:
            raise HTTPException(status_code=400, detail="Topics list cannot be empty")
          # Convert Pydantic models to dicts
        topics_data = [
            {
                'topic_id': topic.topic_id,
                'title': topic.title,
                'content': topic.content,
                'preprocessed_text': topic.preprocessed_text
            }
            for topic in request.topics
        ]
        
        topics_added = faiss_service.add_topics(topics_data)
        
        return AddTopicsResponse(
            topics_added=topics_added,
            message=f"Successfully added {topics_added} topics to FAISS index"
        )
        
    except Exception as e:
        logging.error(f"Error adding topics to FAISS: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

def search_topics_endpoint(request: SearchTopicsRequest) -> SearchTopicsResponse:
    """Search for similar topics using FAISS"""
    try:
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        if request.top_k <= 0 or request.top_k > 100:
            raise HTTPException(status_code=400, detail="top_k must be between 1 and 100")
        
        results = faiss_service.search_similar_topics(
            query=request.query,
            top_k=request.top_k,
            threshold=request.threshold
        )
        
        # Convert to response format
        topic_results = [
            TopicResult(
                topic_id=result['topic_id'],
                title=result['title'],
                content=result['content'],
                similarity_score=result['similarity_score']
            )
            for result in results
        ]
        
        return SearchTopicsResponse(
            query=request.query,
            results=topic_results,
            total_found=len(topic_results)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error searching topics in FAISS: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

def get_faiss_stats_endpoint() -> FAISSStatsResponse:
    """Get FAISS index statistics"""
    try:
        stats = faiss_service.get_stats()
        return FAISSStatsResponse(**stats)
        
    except Exception as e:
        logging.error(f"Error getting FAISS stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

def rebuild_index_endpoint():
    """Rebuild FAISS index to remove deleted items"""
    try:
        faiss_service.rebuild_index()
        return {"message": "FAISS index rebuilt successfully"}
        
    except Exception as e:
        logging.error(f"Error rebuilding FAISS index: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

def list_topics_endpoint(include_deleted: bool = False) -> ListTopicsResponse:
    """List all topics in FAISS cache"""
    try:
        topics = faiss_service.list_all_topics(include_deleted=include_deleted)
        
        # Count statistics
        total_count = len(topics)
        active_count = len([t for t in topics if not t.get('deleted', False)])
        deleted_count = total_count - active_count
        
        return ListTopicsResponse(
            topics=topics,
            total_count=total_count,
            active_count=active_count,
            deleted_count=deleted_count
        )
        
    except Exception as e:
        logging.error(f"Error listing topics: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

def search_topics_by_title_endpoint(title_query: str, limit: int = 20):
    """Search topics by title (simple text matching)"""
    try:
        if not title_query.strip():
            raise HTTPException(status_code=400, detail="Title query cannot be empty")
        
        topics = faiss_service.search_topics_by_title(title_query, limit)
        
        return {
            "query": title_query,
            "results": topics,
            "total_found": len(topics)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error searching topics by title: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
