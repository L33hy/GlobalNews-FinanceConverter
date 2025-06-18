// --- IMPORTANT ---
// For production, use environment variables.
const NEWS_API_KEY = "aacd34df791587245ed2a2fbf7eb0f3b";

// --- DOM Elements ---
const newsGrid = document.getElementById("news-grid");
const newsSearch = document.getElementById("news-search");
const newsCategory = document.getElementById("news-category");
const newsGridLoader = document.getElementById("news-grid-loader");

/**
 * Fetches news from the GNews API.
 * @param {string} category - The category to fetch (for top headlines).
 * @param {string} query - A search query string (for all news).
 */
async function fetchNews(category = "business", query = "") {
  newsGrid.innerHTML = "";
  newsGridLoader.style.display = "block";

  let url;
  const commonParams = `lang=en&country=us&apikey=${NEWS_API_KEY}`; // Common parameters for GNews

  if (query) {
    // If a search query is provided, use the 'search' endpoint for GNews
    url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&${commonParams}`;
  } else {
    // If no search query, use the 'top-headlines' endpoint with category for GNews
    url = `https://gnews.io/api/v4/top-headlines?category=${category}&${commonParams}`;
  }

  // console.log("Fetching URL:", url); // Useful for debugging the constructed URL

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // GNews API returns specific error messages in JSON, try to parse them
      const errorData = await response.json();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorData.errors ? errorData.errors.join(", ") : response.statusText}`);
    }
    const data = await response.json();
    displayNews(data.articles);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to fetch news:", error);
    newsGrid.innerHTML = `<p>Failed to load news. Please try again later. Error: ${error.message}</p>`;
  } finally {
    newsGridLoader.style.display = "none";
  }
}

/**
 * Renders news articles in the grid.
 * @param {Array} articles - An array of article objects.
 */
function displayNews(articles) {
  if (!articles || articles.length === 0) {
    newsGrid.innerHTML = "<p>No news articles found.</p>";
    return;
  }

  newsGrid.innerHTML = ""; // Clear previous results
  articles.slice(0, 14).forEach((article) => {
    // GNews API generally doesn't use "[Removed]" for titles, but good to keep a check
    if (!article.title) return;

    const card = document.createElement("article");
    card.className = "news-card fade-in";

    // GNews API uses 'image' property for the image URL, not 'urlToImage'
    const imageUrl =
      article.image ||
      "https://placehold.co/600x400/007bff/white?text=News";

    card.innerHTML = `
            <img src="${imageUrl}" alt="${article.title}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found';">
            <div class="news-card-content">
                <h3>${article.title}</h3>
                <p>${article.description || "No description available."}</p>
                <a href="${article.url}" target="_blank" rel="noopener noreferrer">Read More</a>
            </div>
        `;
    newsGrid.appendChild(card);
  });
}

/**
 * Sets up event listeners for the news controls (search and category).
 */
export function handleNewsControls() {
  let debounceTimeout;
  newsSearch.addEventListener("input", (e) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      fetchNews(newsCategory.value, e.target.value);
    }, 500); // Debounce for 500ms
  });

  newsCategory.addEventListener("change", (e) => {
    fetchNews(e.target.value, newsSearch.value);
  });
}

/**
 * Initializes the news module by fetching default news.
 */
export function initNews() {
  fetchNews();
}