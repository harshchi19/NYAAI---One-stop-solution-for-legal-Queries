import React, { useState, useEffect } from "react";
import "./LegalNews.css"; // Updated CSS
import Navbar from '../../components/Navbar';

const API_KEY = "a1d53af1dcffad08ec1da64af8ffadce";
const BASE_URL = "https://gnews.io/api/v4/search";
const DEFAULT_IMAGE = "https://unsplash.com/photos/woman-holding-sword-statue-during-daytime-DZpc4UY8ZtY"; 

const categories = [
  { label: "Criminal", value: "criminal" },
  { label: "Alimony", value: "alimony" },
  { label: "Divorce", value: "divorce" },
  { label: "Rape", value: "rape" },
  { label: "Murder", value: "murder" },
  { label: "Litigation", value: "litigation" },
  { label: "Law", value: "law" },
  { label: "Justice", value: "justice" },
  { label: "Court", value: "court" },
  { label: "Attorney", value: "attorney" }
];

const LegalNews = () => {
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("criminal");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}?q=${selectedCategory}&lang=en&country=in&max=10&sortby=relevance&apikey=${API_KEY}`);
        const data = await response.json();
        setNews(data.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
      setLoading(false);
    };

    fetchNews();
  }, [selectedCategory]);

  return (
    <main className="legal-main">
      <Navbar />
      <div className="legal-container">
        <h1 className="legal-heading">Legal News - {selectedCategory.toUpperCase()}</h1>

        {/* Modern Dropdown Selection */}
        <div className="legal-category-select">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)} 
            className="legal-dropdown"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="legal-loading-text">Loading news...</p>
        ) : (
          <div className="legal-news-grid">
            {news.length > 0 ? (
              news.map((article, index) => (
                <div key={index} className="legal-news-card">
                  <img
                    src={article.image || DEFAULT_IMAGE}
                    alt={article.title}
                    className="legal-news-image"
                  />
                  <h2 className="legal-news-title">{article.title}</h2>
                  <p className="legal-news-source">{article.source.name}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="legal-read-more">
                    Read more
                  </a>
                </div>
              ))
            ) : (
              <p className="legal-no-articles">No articles found for {selectedCategory}.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default LegalNews;
