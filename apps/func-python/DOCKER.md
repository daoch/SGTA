# SGTA Function App - Docker Deployment Guide

## 🚀 Quick Deployment

### Prerequisites
- Docker installed
- Docker Compose installed
- Port 8000 available

### Deploy with Docker Compose (Recommended)

```bash
# 1. Clone/navigate to project directory
cd c:\PIDS\SGTA\apps\func-python

# 2. Start the service
docker-compose up -d

# 3. Test the deployment
python test_docker.py

# 4. Access the API
# - API: http://localhost:8000
# - Docs: http://localhost:8000/docs
```

### Manual Docker Deployment

```bash
# 1. Build the image
docker build -t sgta-function-app:latest .

# 2. Run with persistent cache
docker run -d \
  --name sgta-api \
  -p 8000:8000 \
  -v ./cache:/app/cache \
  sgta-function-app:latest

# 3. Check logs
docker logs sgta-api
```

## 📊 Service Features

### Endpoints Available:
- `POST /asignar` - Assignment optimization
- `POST /similarity` - SBERT similarity scoring  
- `POST /topics/add` - Bulk add topics to FAISS
- `POST /topics/search` - Fast topic similarity search
- `GET /topics/stats` - FAISS index statistics
- `POST /topics/rebuild` - Optimize FAISS index

### Performance:
- **FAISS Search**: < 50ms for 5,000 topics
- **Memory Usage**: ~500MB (including SBERT model)
- **Startup Time**: ~30 seconds (model loading)
- **Cache Persistence**: FAISS embeddings saved to disk

## 🔧 Configuration

### Environment Variables:
```bash
PYTHONPATH=/app          # Python path
PORT=8000               # API port
PYTHONUNBUFFERED=1      # Logging
```

### Volume Mounts:
```bash
./cache:/app/cache      # Persist FAISS embeddings
```

## 🧪 Testing

### Quick Diagnostics:
```bash
# Run full diagnostics
python docker_diagnose.py

# Quick health check
curl http://localhost:8000/topics/stats
```

### Run deployment tests:
```bash
# Test local deployment
python test_docker.py

# Test remote deployment
python test_docker.py http://your-server:8000
```

### Load sample data:
```bash
# Add sample topics via API
python test_faiss.py
```

## 📝 Logs & Monitoring

```bash
# View container logs
docker logs sgta-api

# Monitor container resource usage
docker stats sgta-api

# Check container health
docker inspect sgta-api
```

## 🔄 Updates & Maintenance

### Update the service:
```bash
# 1. Rebuild image
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# 2. Verify deployment
python test_docker.py
```

### Backup FAISS cache:
```bash
# Cache is automatically persisted in ./cache/
tar -czf faiss-backup.tar.gz cache/
```

## 🚨 Troubleshooting

### Connection Issues:

1. **"Cannot connect" errors:**
   ```bash
   # Check container status
   docker-compose ps
   
   # Check if port is bound
   netstat -an | findstr :8000
   
   # Restart container
   docker-compose restart
   
   # Run diagnostics
   python docker_diagnose.py
   ```

2. **"Connection aborted" errors:**
   ```bash
   # Usually indicates timeout or memory issues
   # Check container resource usage
   docker stats sgta-api
   
   # Increase timeout in requests or restart
   docker-compose restart
   ```

### Common Issues:

1. **Port 8000 in use:**
   ```bash
   # Change port in docker-compose.yml
   ports:
     - "8001:8000"  # Use port 8001 instead
   ```

2. **FAISS cache issues:**
   ```bash
   # Clear cache and restart
   rm -rf cache/*
   docker-compose restart
   ```

3. **Memory issues:**
   ```bash
   # Monitor memory usage
   docker stats sgta-api
   
   # Increase Docker memory limit if needed
   ```

4. **Model download fails:**
   ```bash
   # Check internet connectivity
   # Models are downloaded on first use
   docker logs sgta-api
   ```

## 📞 Support

- Check logs: `docker logs sgta-api`
- Test endpoints: `python test_docker.py`
- Verify cache: `ls -la cache/`
