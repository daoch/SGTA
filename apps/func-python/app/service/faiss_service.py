import faiss
import numpy as np
import pickle
import os
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Tuple, Optional
import logging
from dataclasses import dataclass

@dataclass
class TopicEmbedding:
    topic_id: str
    title: str
    content: str
    embedding: np.ndarray

class FAISSEmbeddingService:
    def __init__(self, model_name: str = 'paraphrase-multilingual-MiniLM-L12-v2'):
        """
        Initialize FAISS service for fast similarity search
        
        Args:
            model_name: SBERT model to use for embeddings
        """
        self.model = SentenceTransformer(model_name)
        self.embedding_dim = self.model.get_sentence_embedding_dimension()
        
        # FAISS index for fast similarity search
        self.index = faiss.IndexFlatIP(self.embedding_dim)  # Inner Product (cosine sim)
        
        # Metadata storage
        self.topic_metadata: Dict[int, Dict] = {}  # index_id -> topic info
        self.topic_id_to_index: Dict[str, int] = {}  # topic_id -> index_id
        
        # Cache file paths
        self.cache_dir = "cache"
        self.index_path = os.path.join(self.cache_dir, "faiss_index.bin")
        self.metadata_path = os.path.join(self.cache_dir, "metadata.pkl")
        
        # Ensure cache directory exists
        os.makedirs(self.cache_dir, exist_ok=True)
        
        # Load existing cache if available
        self._load_cache()
        
        logging.info(f"FAISS service initialized with {self.index.ntotal} pre-stored topics")

    def add_topics(self, topics: List[Dict]) -> int:
        """
        Add multiple topics to the FAISS index
        
        Args:
            topics: List of dicts with keys: topic_id, title, content, preprocessed_text
            
        Returns:
            Number of topics added
        """
        if not topics:
            return 0
            
        texts_to_encode = []
        topic_infos = []
        
        for topic in topics:
            # Skip if topic already exists
            if topic['topic_id'] in self.topic_id_to_index:
                logging.warning(f"Topic {topic['topic_id']} already exists, skipping")
                continue
            
            # Validate required fields
            required_fields = ['topic_id', 'title', 'content']
            if not all(field in topic for field in required_fields):
                logging.warning(f"Topic {topic.get('topic_id', 'unknown')} missing required fields, skipping")
                continue
                
            # Use preprocessed_text for embeddings if available (better similarity without stopwords)
            if 'preprocessed_text' in topic and topic['preprocessed_text'].strip():
                embedding_text = topic['preprocessed_text'].strip()
                logging.debug(f"Using preprocessed_text for topic {topic['topic_id']}")
            else:
                # Fallback to title + content if preprocessed_text is not available or empty
                embedding_text = f"{topic['title']}. {topic['content']}"
                logging.warning(f"Topic {topic['topic_id']} missing preprocessed_text, using title+content fallback")
            
            texts_to_encode.append(embedding_text)
            topic_infos.append(topic)
        
        if not texts_to_encode:
            return 0
            
        # Generate embeddings in batch (more efficient)
        embeddings = self.model.encode(texts_to_encode, convert_to_tensor=False, normalize_embeddings=True)
        embeddings = np.array(embeddings, dtype=np.float32)
        
        # Add to FAISS index
        start_idx = self.index.ntotal
        self.index.add(embeddings)
        
        # Store metadata
        for i, topic_info in enumerate(topic_infos):
            index_id = start_idx + i
            self.topic_metadata[index_id] = {
                'topic_id': topic_info['topic_id'],
                'title': topic_info['title'],
                'content': topic_info['content'],
                'preprocessed_text': topic_info.get('preprocessed_text', ''),
                'embedding_text': texts_to_encode[i]  # Text actually used for embedding
            }
            self.topic_id_to_index[topic_info['topic_id']] = index_id
        
        logging.info(f"Added {len(topic_infos)} topics to FAISS index")
        
        # Save to cache
        self._save_cache()
        
        return len(topic_infos)

    def search_similar_topics(self, query: str, top_k: int = 10, threshold: float = 0.0) -> List[Dict]:
        """
        Search for similar topics using FAISS
        
        Args:
            query: Search query text
            top_k: Number of top results to return
            threshold: Minimum similarity score (0.0 to 1.0)
            
        Returns:
            List of similar topics with scores
        """
        if self.index.ntotal == 0:
            return []
            
        # Encode query
        query_embedding = self.model.encode([query], convert_to_tensor=False, normalize_embeddings=True)
        query_embedding = np.array(query_embedding, dtype=np.float32)
        
        # Search in FAISS index
        scores, indices = self.index.search(query_embedding, min(top_k, self.index.ntotal))
          # Format results
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1:  # FAISS returns -1 for invalid indices
                continue
                
            # Skip deleted topics
            if idx in self.topic_metadata and self.topic_metadata[idx].get('deleted', False):
                continue
                
            similarity_score = float(score)  # Already normalized cosine similarity
            if similarity_score >= threshold:
                topic_info = self.topic_metadata[idx].copy()
                topic_info['similarity_score'] = round(similarity_score, 4)
                results.append(topic_info)
            
        return results

    def search_with_temp_embedding(self, query_text: str, threshold=0.0, top_k=10) -> List[Dict]:
        """
        Search for similar topics using a temporary embedding (no persistence)
        
        Args:
            query_text: Text to search for (will be embedded on-the-fly)
            threshold: Minimum similarity score (0.0 to 1.0)
            top_k: Number of top results to return
            
        Returns:
            List of similar topics with scores
        """
        if self.index.ntotal == 0:
            return []
            
        # Generate temporary embedding for the query
        query_embedding = self.model.encode([query_text], convert_to_tensor=False, normalize_embeddings=True)
        query_embedding = np.array(query_embedding, dtype=np.float32)
        
        # Search in FAISS index (same as search_similar_topics but with pre-computed embedding)
        scores, indices = self.index.search(query_embedding, min(top_k, self.index.ntotal))
        
        # Format results
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1:  # FAISS returns -1 for invalid indices
                continue
                
            # Skip deleted topics
            if idx in self.topic_metadata and self.topic_metadata[idx].get('deleted', False):
                continue
            
            similarity_score = float(score)  # Already normalized cosine similarity
            if similarity_score >= threshold:
                topic_info = self.topic_metadata[idx].copy()
                topic_info['similarity_score'] = round(similarity_score, 4)
                results.append(topic_info)
        
        return results

    def get_topic_by_id(self, topic_id: str) -> Optional[Dict]:
        """Get topic information by ID"""
        if topic_id not in self.topic_id_to_index:
            return None
            
        index_id = self.topic_id_to_index[topic_id]
        topic_info = self.topic_metadata[index_id].copy()
        
        # Return None if topic is deleted
        if topic_info.get('deleted', False):
            return None
            
        return topic_info

    def remove_topic(self, topic_id: str) -> bool:
        """
        Remove a topic from the index
        Note: FAISS doesn't support efficient deletion, so this marks as deleted
        """
        if topic_id not in self.topic_id_to_index:
            return False
            
        index_id = self.topic_id_to_index[topic_id]
          # Mark as deleted (we'll rebuild index periodically)
        if index_id in self.topic_metadata:
            self.topic_metadata[index_id]['deleted'] = True
            del self.topic_id_to_index[topic_id]
            
            # Save cache to persist the deletion
            self._save_cache()
            logging.info(f"Topic {topic_id} marked as deleted")
            
            return True
        
        return False

    def get_stats(self) -> Dict:
        """Get statistics about the FAISS index"""
        active_topics = len([t for t in self.topic_metadata.values() if not t.get('deleted', False)])
        
        return {
            'total_topics': self.index.ntotal,
            'active_topics': active_topics,
            'deleted_topics': self.index.ntotal - active_topics,
            'embedding_dimension': self.embedding_dim,
            'cache_exists': os.path.exists(self.index_path)
        }

    def list_all_topics(self, include_deleted: bool = False) -> List[Dict]:
        """
        List all topics in the FAISS index
        
        Args:
            include_deleted: Whether to include topics marked as deleted
            
        Returns:
            List of all topics with metadata
        """
        topics = []
        
        for idx, topic_info in self.topic_metadata.items():
            is_deleted = topic_info.get('deleted', False)
            
            if include_deleted or not is_deleted:
                topic_data = {
                    'index_id': idx,
                    'topic_id': topic_info['topic_id'],
                    'title': topic_info['title'],
                    'content': topic_info['content'],
                    'preprocessed_text': topic_info.get('preprocessed_text', ''),
                    'embedding_text': topic_info.get('embedding_text', ''),
                    'deleted': is_deleted
                }
                topics.append(topic_data)
        
        # Sort by topic_id for consistent ordering
        topics.sort(key=lambda x: x['topic_id'])
        
        return topics

    def search_topics_by_title(self, title_query: str, limit: int = 20) -> List[Dict]:
        """
        Search topics by title (simple text matching, not semantic)
        
        Args:
            title_query: Text to search in titles
            limit: Maximum number of results
            
        Returns:
            List of matching topics
        """
        matching_topics = []
        title_query_lower = title_query.lower()
        
        for topic_info in self.topic_metadata.values():
            if topic_info.get('deleted', False):
                continue
                
            if title_query_lower in topic_info['title'].lower():
                matching_topics.append({
                    'topic_id': topic_info['topic_id'],
                    'title': topic_info['title'],
                    'content': topic_info['content'],
                    'preprocessed_text': topic_info.get('preprocessed_text', ''),
                    'embedding_text': topic_info.get('embedding_text', '')
                })
        
        return matching_topics[:limit]

    def _save_cache(self):
        """Save FAISS index and metadata to disk"""
        try:
            faiss.write_index(self.index, self.index_path)
            
            with open(self.metadata_path, 'wb') as f:
                pickle.dump({
                    'topic_metadata': self.topic_metadata,
                    'topic_id_to_index': self.topic_id_to_index
                }, f)
            
            logging.info("FAISS cache saved successfully")
        except Exception as e:
            logging.error(f"Error saving FAISS cache: {str(e)}")

    def _load_cache(self):
        """Load FAISS index and metadata from disk"""
        try:
            if os.path.exists(self.index_path) and os.path.exists(self.metadata_path):
                self.index = faiss.read_index(self.index_path)
                
                with open(self.metadata_path, 'rb') as f:
                    data = pickle.load(f)
                    self.topic_metadata = data['topic_metadata']
                    self.topic_id_to_index = data['topic_id_to_index']
                
                logging.info(f"FAISS cache loaded: {self.index.ntotal} topics")
            else:
                logging.info("No existing FAISS cache found, starting fresh")
        except Exception as e:
            logging.error(f"Error loading FAISS cache: {str(e)}")
            # Reset to empty state
            self.index = faiss.IndexFlatIP(self.embedding_dim)
            self.topic_metadata = {}
            self.topic_id_to_index = {}

    def rebuild_index(self):
        """Rebuild index to remove deleted items (expensive operation)"""
        active_topics = []
        
        for idx, topic_info in self.topic_metadata.items():
            if not topic_info.get('deleted', False):
                active_topics.append({
                    'topic_id': topic_info['topic_id'],
                    'title': topic_info['title'],
                    'content': topic_info['content'],
                    'preprocessed_text': topic_info.get('preprocessed_text', '')
                })
        
        # Clear current index
        self.index = faiss.IndexFlatIP(self.embedding_dim)
        self.topic_metadata = {}
        self.topic_id_to_index = {}
        
        # Re-add active topics
        if active_topics:
            self.add_topics(active_topics)
        
        logging.info(f"Index rebuilt with {len(active_topics)} active topics")

    def clear_index(self):
        """
        Completely clear the FAISS index and all metadata.
        Use this when you want to start fresh from your Java application.
        """
        try:
            # Clear FAISS index
            self.index = faiss.IndexFlatIP(self.embedding_dim)
            
            # Clear all metadata
            self.topic_metadata = {}
            self.topic_id_to_index = {}
            
            # Remove cache files
            if os.path.exists(self.index_path):
                os.remove(self.index_path)
                logging.info("Removed FAISS index cache file")
            
            if os.path.exists(self.metadata_path):
                os.remove(self.metadata_path)
                logging.info("Removed metadata cache file")
            
            logging.info("FAISS index completely cleared")
            return True
            
        except Exception as e:
            logging.error(f"Error clearing FAISS index: {str(e)}")
            return False

# Global instance
faiss_service = FAISSEmbeddingService()
