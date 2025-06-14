from sentence_transformers import SentenceTransformer, util
from ..models import SimilarityRequest, SimilarityResponse, SimilarityResult
import logging

# Initialize the model (this will be loaded once when the module is imported)
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

def compute_similarities(request: SimilarityRequest) -> SimilarityResponse:
    """
    Compute semantic similarity between a query and a list of texts using SBERT.
    
    Args:
        request: SimilarityRequest containing query and texts
        
    Returns:
        SimilarityResponse with similarity scores for each text
    """
    try:
        # Encode the query
        query_emb = model.encode(request.query, convert_to_tensor=True)
        
        # Encode all texts
        text_embs = model.encode(request.texts, convert_to_tensor=True)
        
        # Compute cosine similarities
        similarities = util.pytorch_cos_sim(query_emb, text_embs)[0]
        
        # Format results
        results = [
            SimilarityResult(text=text, score=round(float(score), 4))
            for text, score in zip(request.texts, similarities)
        ]
        
        return SimilarityResponse(results=results)
        
    except Exception as e:
        logging.error(f"Error computing similarities: {str(e)}")
        raise
