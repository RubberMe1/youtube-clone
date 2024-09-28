const API_KEY = 'AIzaSyCD1DO1jU93z9t50RVEzDozGD1l0djstus'; // Replace with your API key
const videoGrid = document.querySelector(".video-grid");
const categoryFilter = document.querySelector(".category-filter");
const sortOptions = document.querySelector(".sort-options");
const homeButton = document.getElementById("home-button");
const trendingButton = document.getElementById("trending-button");
const subscriptionsButton = document.getElementById("subscriptions-button");
const libraryButton = document.getElementById("library-button");

// Fetch video categories
async function fetchCategories() {
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US&key=${API_KEY}`
    );
    const data = await response.json();
    populateCategoryFilter(data.items);
}

// Populate the category filter dropdown
function populateCategoryFilter(categories) {
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.snippet.title;
        categoryFilter.appendChild(option);
    });
}

// Fetch trending videos on page load
async function fetchTrendingVideos() {
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=10&regionCode=US&key=${API_KEY}`
    );
    const data = await response.json();
    displayVideos(data.items);
}

// Fetch videos based on search query, category, and sort option
async function fetchVideos(query) {
    const categoryId = categoryFilter.value;
    const orderBy = sortOptions.value === "date" ? "date" : "viewCount";

    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${query}&videoCategoryId=${categoryId}&order=${orderBy}&key=${API_KEY}`
    );
    const data = await response.json();
    displayVideos(data.items);
}

// Display videos in the grid
function displayVideos(videos) {
    videoGrid.innerHTML = ""; // Clear previous results

    videos.forEach(video => {
        const videoCard = document.createElement("div");
        videoCard.classList.add("video-card");
        videoCard.innerHTML = `
            <img src="${video.snippet.thumbnails.default.url}" alt="Video Thumbnail">
            <h3>${video.snippet.title}</h3>
            <p>${video.snippet.channelTitle}</p>
            <p>Published on ${new Date(video.snippet.publishedAt).toLocaleDateString()}</p>
            <button class="details-button" data-video-id="${video.id.videoId || video.id}">Details</button>
        `;
        videoGrid.appendChild(videoCard);
    });

    // Add event listeners for detail buttons
    const detailButtons = document.querySelectorAll('.details-button');
    detailButtons.forEach(button => {
        button.addEventListener('click', () => {
            const videoId = button.getAttribute('data-video-id');
            showVideoDetail(videoId);
        });
    });
}

// Add event listeners for search, category filter, sort options, and navigation buttons
document.querySelector(".search-button").addEventListener("click", () => {
    const searchQuery = document.querySelector(".search-bar").value;
    fetchVideos(searchQuery);
});

categoryFilter.addEventListener("change", () => {
    const searchQuery = document.querySelector(".search-bar").value;
    fetchVideos(searchQuery);
});

sortOptions.addEventListener("change", () => {
    const searchQuery = document.querySelector(".search-bar").value;
    fetchVideos(searchQuery);
});

// Event listener for Home button
homeButton.addEventListener("click", () => {
    document.querySelector(".search-bar").value = "";
    categoryFilter.selectedIndex = 0; // Reset to "All Categories"
    sortOptions.selectedIndex = 0; // Reset to sort by upload date
    fetchTrendingVideos();
});

// Event listener for Trending button
trendingButton.addEventListener("click", () => {
    document.querySelector(".search-bar").value = "";
    categoryFilter.selectedIndex = 0; // Reset to "All Categories"
    sortOptions.selectedIndex = 0; // Reset to sort by upload date
    fetchTrendingVideos();
});

// Event listener for Subscriptions button
subscriptionsButton.addEventListener("click", () => {
    alert("Subscriptions feature is not implemented yet.");
});

// Event listener for Library button
libraryButton.addEventListener("click", () => {
    alert("Library feature is not implemented yet.");
});

// Function to show video details
function showVideoDetail(videoId) {
    window.location.href = `video-detail.html?videoId=${videoId}`;
}

// Initialize categories and trending videos on page load
fetchCategories();
fetchTrendingVideos();
