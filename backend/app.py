from flask import Flask, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from model import ChannelRecommender

# ==============================
# 🔹 Load Environment Variables
# ==============================
load_dotenv()
API_KEY = os.getenv("YOUTUBE_API_KEY")

# ==============================
# 🔹 Initialize Flask App
# ==============================
app = Flask(__name__)
CORS(app)

# ==============================
# 🔹 Load ML Model
# ==============================
model = ChannelRecommender()
model.load_model()

# ==============================
# 🔹 Search Videos + Stats
# ==============================
@app.route("/search/<query>")
def search(query):
    try:
        search_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q={query}&maxResults=6&type=video&key={API_KEY}"
        search_res = requests.get(search_url).json()

        results = []

        for item in search_res.get('items', []):
            video_id = item['id']['videoId']
            channel_id = item['snippet']['channelId']

            # 🔹 Get Video Views
            video_url = f"https://www.googleapis.com/youtube/v3/videos?part=statistics&id={video_id}&key={API_KEY}"
            video_data = requests.get(video_url).json()

            views = "N/A"
            if video_data.get('items'):
                views = video_data['items'][0]['statistics'].get('viewCount', 'N/A')

            # 🔹 Get Channel Subscribers
            channel_url = f"https://www.googleapis.com/youtube/v3/channels?part=statistics&id={channel_id}&key={API_KEY}"
            channel_data = requests.get(channel_url).json()

            subscribers = "N/A"
            if channel_data.get('items'):
                subscribers = channel_data['items'][0]['statistics'].get('subscriberCount', 'N/A')

            results.append({
                "title": item['snippet']['title'],
                "channel": item['snippet']['channelTitle'],
                "thumbnail": item['snippet']['thumbnails']['medium']['url'],
                "views": views,
                "subscribers": subscribers
            })

        return jsonify({"items": results})

    except Exception as e:
        return jsonify({"error": str(e)})


# ==============================
# 🔹 ML Recommendation Route
# ==============================
@app.route("/recommend/<channel>")
def recommend(channel):
    try:
        recs = model.recommend(channel)
        return jsonify(recs)
    except Exception as e:
        return jsonify({"error": str(e)})


# ==============================
# 🔹 Root Route (Test)
# ==============================
@app.route("/")
def home():
    return "🚀 AI YouTube Recommender Backend Running"


# ==============================
# 🔹 Run App
# ==============================
if __name__ == "__main__":
    app.run(debug=True)

if __name__ == "__main__":
    app.run()