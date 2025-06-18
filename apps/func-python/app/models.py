from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

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

# Model for the nested metadata in FAISS formatted documents
class FaissFormattedDocumentMetadata(BaseModel):
    authors: List[str] = []
    subjects: List[str] = []
    date_published: Optional[str] = None
    type: Optional[str] = None
    language: Optional[str] = 'es'

# Model for documents formatted for FAISS (compatible with TopicData for core fields)
class FaissFormattedDocument(BaseModel):
    topic_id: str
    title: str
    content: str
    preprocessed_text: str
    metadata: FaissFormattedDocumentMetadata

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

# DSpace Models
class DSpaceAuthRequest(BaseModel):
    xsrf_token: str
    jsessionid: str

class DocumentSearchRequest(BaseModel):
    query: str = ""
    size: int = 20
    page: int = 0
    scope: Optional[str] = None
    filters: Optional[Dict[str, Any]] = None

class CommunitySearchRequest(BaseModel):
    search_term: str
    include_subcommunities: bool = True

class BulkTopicSearchRequest(BaseModel):
    topics: List[str]
    max_results_per_topic: int = 50

class IngestionRequest(BaseModel):
    query: Optional[str] = None
    topics: Optional[List[str]] = None
    communities: Optional[List[str]] = None
    max_results: int = 100
    include_content: bool = True

class DSpaceDocument(BaseModel):
    id: str
    uuid: str
    handle: str
    title: str
    authors: List[str]
    abstract: str
    subjects: List[str]
    keywords: List[str]
    language: str
    date_published: str
    date_available: str
    publisher: str
    type: str
    format: str
    searchable_text: str # This field was present in the original file context for DSpaceDocument
    preprocessed_text: str # This field was present in the original file context for DSpaceDocument
    source: str
    extraction_timestamp: str
    # Adding basic_info and full_metadata if they are part of the output of _format_document_for_ingestion
    basic_info: Optional[Dict[str, Any]] = None
    full_metadata: Optional[Dict[str, Any]] = None


class DSpaceCommunity(BaseModel):
    id: str
    name: str
    handle: str
    hierarchy_path: Optional[str] = None
    parent_path: Optional[str] = None
    subcommunities: Optional[List['DSpaceCommunity']] = None

class DSpaceCollection(BaseModel):
    id: str
    name: str
    handle: str

class DSpaceResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None # Changed from Union[Dict, List] to be more specific if possible
    error: Optional[str] = None
    timestamp: str

# New model for the response of get_ingenieria_informatica_documents
class IngenieriaInformaticaSearchResponse(BaseModel):
    success: bool
    message: str | None = None
    total_documents_found: int = 0
    documents: list[DSpaceDocument | FaissFormattedDocument] = [] # Can contain either full docs or FAISS formatted
    error: str | None = None

# Update forward references
DSpaceCommunity.model_rebuild()

# New model for fetching all documents from the DSpace repository
class AllDSpaceDocumentsResponse(BaseModel):
    success: bool
    message: str | None = None
    total_documents_found: int = 0
    total_communities_processed: int = 0
    total_collections_processed: int = 0 # Added this field
    documents: list[DSpaceDocument] = []
    error: str | None = None

# Models for DSpace base URL configuration
class OAIEndpointUpdateRequest(BaseModel):
    oai_base_url: str = Field(description="The base URL for the OAI-PMH endpoint (e.g., 'https://example.com/oai/request').")

class OAIEndpointResponse(BaseModel):
    current_oai_base_url: str
    message: str

# OAI-PMH Models
class OAIRecord(BaseModel):
    identifier: str
    datestamp: str
    set_specs: List[str] = Field(default_factory=list)
    title: str
    authors: List[str] = Field(default_factory=list)
    description: Optional[str] = None
    subjects: List[str] = Field(default_factory=list)
    date_issued: Optional[str] = None
    publisher: Optional[str] = None
    record_type: Optional[str] = None # From dc:type
    language: Optional[str] = None
    source_url: Optional[str] = None # Link to the OAI record itself
    metadata: Dict[str, Any] # Raw metadata from OAI feed

class OAIResponse(BaseModel):
    success: bool
    message: str
    error: Optional[str] = None
    total_records_harvested: int = 0
    total_sets_processed: int = 0
    set_spec_filter: Optional[str] = None # If the response is for a specific set
    records: List[OAIRecord] = Field(default_factory=list)
