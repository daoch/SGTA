# SGTA Function App

## Overview
This FastAPI application provides services for:
- Assignment optimization (`/asignar`)
- Semantic similarity scoring using SBERT (`/similarity`)
- **Fast topic similarity search using FAISS (`/topics/search`)**
- **Bulk topic management (`/topics/add`)**

## 🚀 Quick Start

### Docker Deployment (Recommended)

1. **Build and run with Docker Compose:**
```bash
docker-compose up -d
```

2. **Or build manually:**
```bash
# Windows
.\docker-build.ps1

# Linux/Mac
chmod +x docker-build.sh
./docker-build.sh

# Run the container
docker run -p 8000:8000 -v ./cache:/app/cache sgta-function-app:latest
```

3. **Access the API:**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Alternative docs: http://localhost:8000/redoc

### Local Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
# On Windows
.\start.ps1

# On Linux/Mac
bash start.sh

# Or directly
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Usage

The application will be available at `http://localhost:8000`

- API documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

## 🔍 FAISS Topic Similarity Service

**High-performance semantic search for 5,000+ topics using pre-computed embeddings.**

### Key Features:
- ⚡ **Lightning-fast search** (< 50ms for 5k topics)
- 💾 **Persistent cache** - embeddings saved to disk
- 🔄 **Bulk operations** - efficient topic management
- 🎯 **High accuracy** - multilingual SBERT embeddings

### FAISS Endpoints

#### POST `/topics/add`
Add topics to FAISS index for fast similarity search.

**Request:**
```json
{
  "topics": [
    {
      "topic_id": "ai_001",
      "title": "Machine Learning en la Medicina",
      "content": "Aplicación de algoritmos de aprendizaje automático para diagnóstico médico..."
    }
  ]
}
```

**Response:**
```json
{
  "topics_added": 1,
  "message": "Successfully added 1 topics to FAISS index"
}
```

#### POST `/topics/search`
Search for similar topics using FAISS (ultra-fast!).

**Request:**
```json
{
  "query": "inteligencia artificial y machine learning",
  "top_k": 5,
  "threshold": 0.1
}
```

**Response:**
```json
{
  "query": "inteligencia artificial y machine learning",
  "results": [
    {
      "topic_id": "ai_001",
      "title": "Machine Learning en la Medicina",
      "content": "Aplicación de algoritmos...",
      "similarity_score": 0.8234
    }
  ],
  "total_found": 1
}
```

#### GET `/topics/stats`
Get FAISS index statistics.

**Response:**
```json
{
  "total_topics": 1000,
  "active_topics": 1000,
  "deleted_topics": 0,
  "embedding_dimension": 384,
  "cache_exists": true
}
```

## SBERT Similarity Service

The SBERT similarity service computes semantic similarity scores between a query and multiple text documents using Sentence-BERT embeddings.

### Endpoints

#### POST `/similarity`

Computes semantic similarity scores between a query and a list of texts.

**Request Body:**
```json
{
  "query": "What is machine learning?",
  "texts": [
    "Machine learning is a subset of artificial intelligence",
    "Python is a programming language",
    "Deep learning uses neural networks"
  ]
}
```

**Response:**
```json
{
  "results": [
    {
      "text": "Machine learning is a subset of artificial intelligence",
      "score": 0.8234
    },
    {
      "text": "Python is a programming language",
      "score": 0.2145
    },
    {
      "text": "Deep learning uses neural networks",
      "score": 0.6789
    }
  ]
}
```

## Model Information

The SBERT service uses the `all-MiniLM-L6-v2` model, which provides:
- Fast inference
- Good performance on semantic similarity tasks
- Lightweight model size (~80MB)

The model will be downloaded automatically on first use and cached locally.
