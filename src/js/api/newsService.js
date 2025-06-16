// --- IMPORTANT ---
// Replace with your own free API key from https://newsapi.org/
// For production, use environment variables.
const NEWS_API_KEY = "ff8897e717b34db1ab4af39a06dbfdd9";

// --- DOM Elements ---
const newsGrid = document.getElementById("news-grid");
const newsSearch = document.getElementById("news-search");
const newsCategory = document.getElementById("news-category");
const newsGridLoader = document.getElementById("news-grid-loader");

/**
 * Fetches news from the NewsAPI.
 * @param {string} category - The category to fetch.
 * @param {string} query - A search query string.
 */
async function fetchNews(category = "business", query = "") {
  newsGrid.innerHTML = "";
  newsGridLoader.style.display = "block";

  const queryParam = query
    ? `q=${encodeURIComponent(query)}&`
    : `category=${category}&country=us&`;
  const url = `https://newsapi.org/v2/${query ? "everything" : "top-headlines"}?${queryParam}apiKey=${NEWS_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayNews(data.articles);
  } catch (error) {
    // console.error("Failed to fetch news:", error);
    newsGrid.innerHTML = "<p>Failed to load news. Please try again later.</p>";
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
  articles.slice(0, 12).forEach((article) => {
    if (!article.title || article.title === "[Removed]") return;

    const card = document.createElement("article");
    card.className = "news-card fade-in";

    const imageUrl =
      article.urlToImage ||
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
