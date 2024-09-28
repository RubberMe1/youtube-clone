const API_KEY = 'AIzaSyCD1DO1jU93z9t50RVEzDozGD1l0djstus'; // Replace with your API key
const videoId = new URLSearchParams(window.location.search).get('videoId');
const videoContainer = document.getElementById('video-container');
const videoInfo = document.getElementById('video-info');

async function fetchVideoDetail(videoId) {
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`
    );
    const data = await response.json();
    displayVideoDetail(data.items[0]);
}

function displayVideoDetail(video) {
    const videoElement = document.createElement('iframe');
    videoElement.src = `https://www.youtube.com/embed/${video.id}`;
    videoElement.width = '560';
    videoElement.height = '315';
    videoElement.allowFullscreen = true;
    videoContainer.appendChild(videoElement);

    const title = document.createElement('h2');
    title.textContent = video.snippet.title;

    const description = document.createElement('p');
    description.textContent = video.snippet.description;

    const channelTitle = document.createElement('p');
    channelTitle.textContent = `Channel: ${video.snippet.channelTitle}`;

    const viewCount = document.createElement('p');
    viewCount.textContent = `Views: ${video.statistics.viewCount}`;

    const publishedAt = document.createElement('p');
    publishedAt.textContent = `Published on: ${new Date(video.snippet.publishedAt).toLocaleDateString()}`;

    videoInfo.append(title, description, channelTitle, viewCount, publishedAt);
}

// Fetch video details on page load
fetchVideoDetail(videoId);
