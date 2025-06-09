from fastapi import HTTPException
from ..models import SimilarityRequest, SimilarityResponse
from ..service.sbert_service import compute_similarities
import logging

def similarity_endpoint(request: SimilarityRequest) -> SimilarityResponse:
    """
    Endpoint to compute semantic similarity between a query and multiple texts.
    
    Returns similarity scores using SBERT (Sentence-BERT) embeddings.
    """
    try:
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        if not request.texts or len(request.texts) == 0:
            raise HTTPException(status_code=400, detail="Texts list cannot be empty")
        
        return compute_similarities(request)
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error in similarity endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
