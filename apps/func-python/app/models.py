from pydantic import BaseModel
from typing import List

class SimilarityRequest(BaseModel):
    query: str
    texts: List[str]

class SimilarityResult(BaseModel):
    text: str
    score: float

class SimilarityResponse(BaseModel):
    results: List[SimilarityResult]

# FAISS Topic Models
class TopicData(BaseModel):
    topic_id: str
    title: str
    content: str
    preprocessed_text: str = ""  # New field for preprocessed text without stopwords

class AddTopicsRequest(BaseModel):
    topics: List[TopicData]

class AddTopicsResponse(BaseModel):
    topics_added: int
    message: str

class SearchTopicsRequest(BaseModel):
    query: str
    top_k: int = 10
    threshold: float = 0.0

class TopicResult(BaseModel):
    topic_id: str
    title: str
    content: str
    similarity_score: float

class SearchTopicsResponse(BaseModel):
    query: str
    results: List[TopicResult]
    total_found: int

class FAISSStatsResponse(BaseModel):
    total_topics: int
    active_topics: int
    deleted_topics: int
    embedding_dimension: int
    cache_exists: bool

class TopicInfo(BaseModel):
    index_id: int
    topic_id: str
    title: str
    content: str
    preprocessed_text: str = ""
    embedding_text: str = ""
    deleted: bool = False

class ListTopicsResponse(BaseModel):
    topics: List[TopicInfo]
    total_count: int
    active_count: int
    deleted_count: int

class SearchTempRequest(BaseModel):
    query_text: str
    top_k: int = 10
    threshold: float = 0.0

class SearchTempResponse(BaseModel):
    query_text: str
    results: List[TopicResult]
    total_found: int
