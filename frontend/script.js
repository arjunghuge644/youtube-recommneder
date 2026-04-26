// 🔥 Your Render backend URL
const BASE_URL = "https://youtube-recommneder.onrender.com";

// 🔹 Format numbers (K, M, B)
function formatNumber(num) {
  num = parseInt(num);
  if (isNaN(num)) return num;

  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";

  return num;
}

// 🔹 Skeleton Loader
function skeletonHTML(count = 6) {
  return `
    <div class="skeleton-grid">
        ${Array(count)
          .fill(
            `
            <div class="skeleton-card">
                <div class="skeleton-thumb"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text small"></div>
            </div>
          `,
          )
          .join("")}
    </div>`;
}

// 🔹 Search Videos
async function searchVideos() {
  const query = document.getElementById("search").value.trim();
  const container = document.getElementById("videos");

  if (!query) {
    alert("Enter search term");
    return;
  }

  container.innerHTML = skeletonHTML();

  try {
    const res = await fetch(`${BASE_URL}/search/${query}`);
    const data = await res.json();

    if (!data.items) {
      container.innerHTML = "<p>No results found</p>";
      return;
    }

    displayVideos(data.items);
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>❌ Error loading data</p>";
  }
}

// 🔹 Display Videos
function displayVideos(videos) {
  const container = document.getElementById("videos");
  container.innerHTML = "";

  videos.forEach((video) => {
    container.innerHTML += `
      <div class="card" onclick="getRecommendations('${video.channel}')">
          <img src="${video.thumbnail}">
          <h3>${video.title}</h3>
          <p>${video.channel}</p>
          <p>👁️ ${formatNumber(video.views)} views</p>
          <p>👥 ${formatNumber(video.subscribers)} subscribers</p>
      </div>`;
  });
}

// 🔹 Get Recommendations
async function getRecommendations(channel) {
  const container = document.getElementById("recommendations");

  container.innerHTML = skeletonHTML(3);

  try {
    const res = await fetch(`${BASE_URL}/recommend/${channel}`);
    const data = await res.json();

    displayRecommendations(data);
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>❌ Error loading recommendations</p>";
  }
}

// 🔹 Display Recommendations
function displayRecommendations(recs) {
  const container = document.getElementById("recommendations");

  if (!recs || recs.length === 0) {
    container.innerHTML = "<p>No recommendations found</p>";
    return;
  }

  container.innerHTML = "<h3>Recommended Channels</h3>";

  recs.forEach((channel) => {
    container.innerHTML += `
      <div class="card small">
          <p>${channel}</p>
      </div>`;
  });
}
