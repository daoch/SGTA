#!/usr/bin/env python3
"""
Docker diagnostics script for SGTA Function App
Quick health check and container status verification
"""

import requests
import subprocess
import json
import sys
import time

def run_docker_command(cmd):
    """Run a docker command and return the result"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout.strip(), result.stderr.strip(), result.returncode
    except Exception as e:
        return "", str(e), 1

def check_docker_status():
    """Check Docker container status"""
    print("🐳 Docker Container Diagnostics")
    print("="*50)
    
    # Check if container is running
    print("1. Container Status:")
    stdout, stderr, code = run_docker_command("docker-compose ps --format json")
    
    if code == 0 and stdout:
        try:
            containers = [json.loads(line) for line in stdout.split('\n') if line.strip()]
            for container in containers:
                name = container.get('Name', 'Unknown')
                status = container.get('State', 'Unknown')
                health = container.get('Health', 'N/A')
                ports = container.get('Publishers', [])
                
                print(f"   📦 Container: {name}")
                print(f"   📊 Status: {status}")
                print(f"   🏥 Health: {health}")
                print(f"   🌐 Ports: {ports}")
                
                if status.lower() != 'running':
                    print("   ⚠️  Container is not running!")
                    return False
        except json.JSONDecodeError:
            print("   ❌ Failed to parse container status")
            return False
    else:
        print(f"   ❌ Failed to get container status: {stderr}")
        return False
    
    return True

def check_port_connectivity():
    """Check if port 8000 is accessible"""
    print("\n2. Port Connectivity:")
    
    # Check if something is listening on port 8000
    stdout, stderr, code = run_docker_command("netstat -an | findstr :8000")
    
    if "LISTENING" in stdout:
        print("   ✅ Port 8000 is open and listening")
        return True
    else:
        print("   ❌ Port 8000 is not accessible")
        print("   💡 Try: docker-compose restart")
        return False

def check_api_health():
    """Quick API health check"""
    print("\n3. API Health Check:")
    
    try:
        response = requests.get("http://localhost:8000/topics/stats", timeout=5)
        if response.status_code == 200:
            stats = response.json()
            print("   ✅ API is responding correctly")
            print(f"   📊 FAISS topics: {stats.get('total_topics', 0)}")
            print(f"   🧠 Embedding dimension: {stats.get('embedding_dimension', 'N/A')}")
            return True
        else:
            print(f"   ❌ API returned status code: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Cannot connect to API")
        return False
    except Exception as e:
        print(f"   ❌ API check failed: {str(e)}")
        return False

def show_container_logs():
    """Show recent container logs"""
    print("\n4. Recent Container Logs:")
    stdout, stderr, code = run_docker_command("docker-compose logs --tail=10 sgta-api")
    
    if code == 0:
        print("   📋 Last 10 log entries:")
        for line in stdout.split('\n')[-10:]:
            if line.strip():
                print(f"      {line}")
    else:
        print(f"   ❌ Failed to get logs: {stderr}")

def main():
    """Run all diagnostic checks"""
    
    all_good = True
    
    # Run checks
    checks = [
        ("Docker Status", check_docker_status),
        ("Port Connectivity", check_port_connectivity), 
        ("API Health", check_api_health)
    ]
    
    for check_name, check_func in checks:
        try:
            if not check_func():
                all_good = False
        except Exception as e:
            print(f"   ❌ {check_name} failed: {str(e)}")
            all_good = False
    
    # Always show logs for debugging
    show_container_logs()
    
    # Summary
    print("\n" + "="*50)
    if all_good:
        print("🎯 All checks passed! Container is healthy.")
        print("🌐 API should be available at: http://localhost:8000/docs")
    else:
        print("❌ Some issues detected. Recommended actions:")
        print("   1. Restart container: docker-compose restart")
        print("   2. Rebuild if needed: docker-compose up -d --build")
        print("   3. Check logs: docker-compose logs sgta-api")
    
    return all_good

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
