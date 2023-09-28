import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const apiKey = 'Your-API-Key'; // Replace with your NewsAPI API key
const articlesPerPage = 9; // Number of articles to display per page

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [uniqueSources, setUniqueSources] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`
        );
        setArticles(response.data.articles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const filteredUniqueSources = articles.reduce((acc, article) => {
      if (!acc.includes(article.source.name)) {
        acc.push(article.source.name);
      }
      return acc;
    }, []);
    setUniqueSources(filteredUniqueSources);
  }, [articles]);

  useEffect(() => {
    const filteredArticles = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedSources.length === 0 ||
          selectedSources.includes(article.source.name.toLowerCase()))
    );

    const loadedArticles = filteredArticles.length;
    setTotalPages(Math.ceil(loadedArticles / articlesPerPage));
  }, [articles, selectedSources, searchQuery]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleSourceChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedSources([...selectedSources, value]);
    } else {
      setSelectedSources(selectedSources.filter((source) => source !== value));
    }
    setCurrentPage(1);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const displayedArticles = articles
  .filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedSources.length === 0 ||
        selectedSources.includes(article.source.name.toLowerCase()))
  )
  .slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage);

  return (
    <div className="container dark-mode">
      <header className="text-center mt-5 mb-4 text-light">
        <h1 className="display-4">Latest News</h1>
        <input
          type="text"
          placeholder="Search for articles"
          value={searchQuery}
          onChange={handleSearch}
          className="form-control"
        />
        <div className="dropdown mt-3">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            onClick={toggleDropdown}
          >
            Select Sources
          </button>
          <div
            className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {uniqueSources.map((source, index) => (
              <div key={index} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={source.toLowerCase()}
                  id={source}
                  checked={selectedSources.includes(source.toLowerCase())}
                  onChange={handleSourceChange}
                />
                <label className="form-check-label" htmlFor={source}>
                  {source}
                </label>
              </div>
            ))}
          </div>
        </div>
      </header>
      {!loading ? (
        <div>
          <div className="row">
            {displayedArticles.map((article, index) => (
              <div key={index} className="col-md-4">
                <div className="card mb-4 dark-mode-card">
                  <img
                    src={article.urlToImage}
                    className="card-img-top"
                    alt={article.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-light">{article.title}</h5>
                    <p className="card-text text-light">{article.description}</p>
                    <p className="card-source text-light">
                      <strong>Source:</strong> {article.source.name}
                    </p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <button
              className="btn btn-secondary mr-2"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-light">
              {`Page ${currentPage} of ${totalPages}`}
            </span>
            <button
              className="btn btn-secondary ml-2"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-light">Loading...</div>
      )}
    </div>
  );
}

export default App;
