// 🔹 Format numbers (K, M, B)
function formatNumber(num) {
  num = parseInt(num);

  if (isNaN(num)) return num;

  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";

  return num;
}

// 🔹 Search videos from backend
function skeletonHTML() {
  return `
    <div class="skeleton-grid">
        ${Array(6)
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

async function searchVideos() {
  const query = document.getElementById("search").value;
  const container = document.getElementById("videos");

  container.innerHTML = skeletonHTML();

  try {
    const res = await fetch(`https://youtube-recommneder.onrender.com/`);
    const data = await res.json();

    displayVideos(data.items);
  } catch (err) {
    container.innerHTML = "<p>Error loading data</p>";
  }
}

// 🔹 Display video cards
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

// 🔹 Get recommendations from ML backend
async function getRecommendations(channel) {
  const container = document.getElementById("recommendations");

  container.innerHTML = `
        <div class="skeleton-grid">
            ${Array(3)
              .fill(
                `
                <div class="skeleton-card">
                    <div class="skeleton-text"></div>
                </div>
            `,
              )
              .join("")}
        </div>
    `;

  const res = await fetch(`http://127.0.0.1:5000/recommend/${channel}`);
  const data = await res.json();

  displayRecommendations(data);
}

// 🔹 Show recommendations
function displayRecommendations(recs) {
  const container = document.getElementById("recommendations");
  container.innerHTML = "<h3>Recommended Channels</h3>";

  recs.forEach((channel) => {
    container.innerHTML += `
        <div class="card small">
            <p>${channel}</p>
        </div>`;
  });
}
