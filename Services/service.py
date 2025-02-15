import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.proxies import WebshareProxyConfig
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient, models
from uuid import uuid4
import numpy as np

load_dotenv()

app = Flask(__name__)

QDRANT_URL = os.environ.get("QDRANT_URL")
QDRANT_API_KEY = os.environ.get("QDRANT_API_KEY")

if not QDRANT_URL or not QDRANT_API_KEY:
    raise RuntimeError(
        "QDRANT_URL and QDRANT_API_KEY must be set. "
        "Copy .env.example to .env in this folder and fill them in."
    )

# YouTube blocks most datacentre IPs, so production runs transcript fetches
# through a residential proxy. Without one this still works locally, you just
# hit rate limits sooner.
PROXY_USERNAME = os.environ.get("WEBSHARE_PROXY_USERNAME")
PROXY_PASSWORD = os.environ.get("WEBSHARE_PROXY_PASSWORD")

if PROXY_USERNAME and PROXY_PASSWORD:
    ytt_api = YouTubeTranscriptApi(
        proxy_config=WebshareProxyConfig(
            proxy_username=PROXY_USERNAME,
            proxy_password=PROXY_PASSWORD,
        )
    )
else:
    ytt_api = YouTubeTranscriptApi()

qdrant = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
    timeout=30,
    https=True
)
model = SentenceTransformer('all-MiniLM-L6-v2')
COLLECTION_NAME = 'video_transcripts'

def ensure_collection():
    collections = qdrant.get_collections().collections
    if not any(c.name == COLLECTION_NAME for c in collections):
        qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config={
                "size": 384,
                "distance": "Cosine"
            }
        )
        print(f"Created collection: {COLLECTION_NAME} with dimension 384")
    else:
        collection_info = qdrant.get_collection(COLLECTION_NAME)
        if collection_info.config.params.vectors.size != 384:
            qdrant.delete_collection(COLLECTION_NAME)
            qdrant.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config={
                    "size": 384,
                    "distance": "Cosine"
                }
            )
            print(f"Recreated collection: {COLLECTION_NAME} with correct dimension 384")


@app.route("/api/videos/<video_id>/process", methods=['POST'])
def process_video(video_id):
    try:
        # Check if transcript already exists
        existing = qdrant.scroll(
            collection_name=COLLECTION_NAME,
            scroll_filter={
                "must": [
                    {"key": "videoId", "match": {"value": video_id}}
                ]
            },
            limit=1
        )
        
        if existing[0]:
            return jsonify({
                "status": "exists", 
                "message": "Transcript already processed"
            })

        ensure_collection()
        
        # Get transcript with fallback mechanism
        transcript = None
        used_language = "en"  # Default language
        
        try:
            # First try to get English transcript
            fetched = ytt_api.fetch(video_id, languages=['en'])
            transcript = fetched.to_raw_data()
        except Exception as e:
            # If English transcript not available, try to get any available transcript
            print(f"English transcript not available: {str(e)}")
            
            try:
                # Get available transcript languages
                transcript_list = ytt_api.list(video_id)
                
                # Get the first available transcript
                if transcript_list:
                    first_transcript = next(iter(transcript_list))
                    fetched = first_transcript.fetch()
                    transcript = fetched.to_raw_data()
                    used_language = first_transcript.language_code
                    print(f"Using {used_language} transcript instead")
                else:
                    raise Exception("No transcripts available for this video")
            except Exception as fallback_error:
                raise Exception(f"Failed to get any transcript: {str(fallback_error)}")
        
        if not transcript:
            raise Exception("No transcript could be retrieved")
        
        # Group by 2-minute chunks (120 seconds)
        CHUNK_DURATION = 120.0
        chunks = []
        
        # Sort transcript by start time to ensure proper ordering
        transcript.sort(key=lambda x: x['start'])
        
        # Get total duration
        if transcript:
            total_duration = transcript[-1]['start'] + transcript[-1]['duration']
            
            # Create chunks based on time ranges
            for chunk_start in np.arange(0, total_duration, CHUNK_DURATION):
                chunk_end = chunk_start + CHUNK_DURATION
                
                # Get segments that fall within this time range
                chunk_segments = [
                    seg for seg in transcript 
                    if seg['start'] >= chunk_start and seg['start'] < chunk_end
                ]
                
                if chunk_segments:
                    # Combine text from all segments in this chunk
                    chunk_text = ' '.join([seg['text'] for seg in chunk_segments])
                    
                    # Create chunk with only necessary information
                    chunk = {
                        'text': chunk_text,
                        'start': chunk_start,
                        'duration': CHUNK_DURATION,
                        'timestamp': format_timestamp(chunk_start),
                        'word_count': len(chunk_text.split()),
                        'language': used_language  # Store the language used
                    }
                    
                    chunks.append(chunk)
        
        print(f"Created {len(chunks)} time-based chunks from {len(transcript)} segments in {used_language}")

        # Process chunks in batches
        BATCH_SIZE = 10  # Number of chunks to process at once
        for i in range(0, len(chunks), BATCH_SIZE):
            batch = chunks[i:i + BATCH_SIZE]
            
            # Create embeddings for the batch
            texts = [chunk['text'] for chunk in batch]
            embeddings = model.encode(texts)
            
            # Prepare points for Qdrant
            points = []
            for j, (chunk, embedding) in enumerate(zip(batch, embeddings)):
                points.append({
                    "id": str(uuid4()),
                    "vector": embedding.tolist(),
                    "payload": {
                        "text": chunk['text'],
                        "start": chunk['start'],
                        "duration": chunk['duration'],
                        "videoId": video_id,
                        "timestamp": chunk['timestamp'],
                        "word_count": chunk['word_count'],
                        "chunk_index": i + j,  # Global index
                        "language": used_language  # Store language info
                    }
                })
            
            # Store in Qdrant
            qdrant.upsert(
                collection_name=COLLECTION_NAME,
                points=points,
                wait=True
            )
            
            print(f"Processed batch {i//BATCH_SIZE + 1}/{(len(chunks) + BATCH_SIZE - 1)//BATCH_SIZE}")

        return jsonify({
            "status": "success",
            "chunks": len(chunks),
            "original_segments": len(transcript),
            "videoId": video_id,
            "language": used_language
        })
        
    except Exception as e:
        print(f"Error processing video: {str(e)}")
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500

# Helper function to format timestamps
def format_timestamp(seconds):
    minutes = int(seconds // 60)
    remaining_seconds = int(seconds % 60)
    return f"{minutes}:{remaining_seconds:02d}"


@app.route("/api/videos/<video_id>/status", methods=['GET'])
def get_video_status(video_id):
    try:
        # Check if transcript already exists
        existing = qdrant.scroll(
            collection_name=COLLECTION_NAME,
            scroll_filter={
                "must": [
                    {"key": "videoId", "match": {"value": video_id}}
                ]
            },
            limit=1
        )
        if existing[0]:
            return jsonify({
                "status": "exists", 
                "message": "Transcript already processed"
            })
        else:
            return jsonify({
                "status": "not_processed", 
                "message": "Transcript not processed yet"
            })
    except Exception as e:
        print(f"Error getting video status: {str(e)}")
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500
    

# New endpoint to get video summary
@app.route("/api/videos/<video_id>/summary", methods=['GET'])
def get_video_summary(video_id):
    try:
        # Try to find the stored summary
        summary = qdrant.scroll(
            collection_name=COLLECTION_NAME,
            scroll_filter={
                "must": [
                    {"key": "videoId", "match": {"value": video_id}},
                    {"key": "is_summary", "match": {"value": True}}
                ]
            },
            limit=1
        )
        print(summary)
        if summary[0]:
            return jsonify({
                "summary": summary[0][0].payload["text"],
                "duration": summary[0][0].payload["duration"],
                "videoId": video_id
            })
        
        # If no stored summary, generate one from chunks
        chunks = qdrant.scroll(
            collection_name=COLLECTION_NAME,
            scroll_filter={
                "must": [
                    {"key": "videoId", "match": {"value": video_id}}
                ]
            },
            limit=100,
            with_payload=True
        )
        
        if not chunks[0]:
            return jsonify({
                "status": "error",
                "message": "No transcript found for this video"
            }), 404
        
        # Combine chunks and generate summary
        chunks_sorted = sorted(chunks[0], key=lambda x: x.payload.get("start", 0))
        combined_text = " ".join([chunk.payload.get("text", "") for chunk in chunks_sorted])
        print(combined_text)
        summary = generate_abstractive_summary(combined_text)
        
        return jsonify({
            "summary": summary,
            "videoId": video_id,
            "generated": True
        })
        
    except Exception as e:
        print(f"Error getting summary: {str(e)}")
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500

@app.route("/api/videos/<video_id>/search", methods=['POST'])
def search_transcript(video_id):
    try:
        data = request.json
        query = data.get('query')
        limit = data.get('limit', 5)
        
        if not query:
            return jsonify({"error": "Query is required"}), 400
        # Create embedding for the query
        query_embedding = model.encode(query)

        # Use proper models.Filter as shown in documentation
        search_results = qdrant.query_points(
            collection_name=COLLECTION_NAME,
            query=query_embedding.tolist(),
            query_filter=models.Filter(
                must=[
                    models.FieldCondition(
                        key="videoId", 
                        match=models.MatchValue(value=video_id)
                    )
                ]
            ),
            limit=limit,
            score_threshold=0.3
        )
        
        # Format results
        results = []
        for result in search_results.points:  # Note: access points attribute
            result_data = {
                "text": result.payload.get("text", ""),
                "timestamp": result.payload.get("timestamp", "0:00"),
                "start": result.payload.get("start", 0),
                "duration": result.payload.get("duration", 0),
                "score": result.score,
                "word_count": result.payload.get("word_count", 0),
                "chunk_index": result.payload.get("chunk_index", 0)
            }
            
            # Only include fields that exist
            payload = {}
            for key, value in result.payload.items():
                payload[key] = value
                
            result_data["payload"] = payload
            results.append(result_data)

        # Add metadata to response
        return jsonify({
            "results": results,
            "total": len(results),
            "query": query,
            "videoId": video_id,
            "status": "success",
            "metadata": {
                "model": "all-MiniLM-L6-v2",
                "dimension": 384,
                "score_threshold": 0.3
            }
        })

    except Exception as e:
        print(f"Error performing semantic search: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500
    

@app.route("/health", methods=['GET'])
def health_check():
    try:
        qdrant.get_collections()
        return jsonify({"status": "healthy"})
    except Exception as e:
        return jsonify({
            "status": "unhealthy", 
            "error": str(e)
        })

@app.route("/api/videos/<video_id>/transcript-chunks", methods=['GET'])
def get_transcript_chunks(video_id):
    try:
        # Get the transcript chunks from Qdrant
        chunks = qdrant.scroll(
            collection_name=COLLECTION_NAME,
            scroll_filter={
                "must": [
                    {"key": "videoId", "match": {"value": video_id}}
                ]
            },
            limit=100,  # Get up to 100 chunks (adjust if needed)
            with_payload=True
        )
        
        if not chunks[0]:
            return jsonify({
                "status": "error",
                "message": "No transcript found for this video"
            }), 404
        
        # Format chunks for easier processing in JavaScript
        formatted_chunks = []
        for chunk in chunks[0]:
            formatted_chunks.append({
                "text": chunk.payload.get("text", ""),
                "start": chunk.payload.get("start", 0),
                "duration": chunk.payload.get("duration", 0),
                "timestamp": chunk.payload.get("timestamp", "0:00"),
                "word_count": chunk.payload.get("word_count", 0),
                "chunk_index": chunk.payload.get("chunk_index", 0)
            })
        
        return jsonify({
            "videoId": video_id,
            "chunks": formatted_chunks,
            "count": len(formatted_chunks)
        })
        
    except Exception as e:
        print(f"Error getting transcript chunks: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5001)