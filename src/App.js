import React, { useState } from 'react';
import './App.css';
import APICard from './components/APICard';
import { freeApis } from './data/apis';

function App() {
  const [selectedApi, setSelectedApi] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(freeApis.map(api => api.category))];
  
  const filteredApis = freeApis.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         api.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || api.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="App">
      <header className="header">
        <h1>🌐 Free API Explorer</h1>
        <p>Discover and test free APIs without authentication</p>
      </header>

      <div className="controls">
        <input
          type="text"
          placeholder="Search APIs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="api-list">
          <h2>Available APIs ({filteredApis.length})</h2>
          <div className="api-grid">
            {filteredApis.map((api) => (
              <div
                key={api.id}
                className={`api-item ${selectedApi?.id === api.id ? 'selected' : ''}`}
                onClick={() => setSelectedApi(api)}
              >
                <h3>{api.name}</h3>
                <p>{api.description.substring(0, 80)}...</p>
                <span className="category-badge">{api.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="api-tester">
          {selectedApi ? (
            <APICard api={selectedApi} />
          ) : (
            <div className="empty-state">
              <h2>👈 Select an API to test</h2>
              <p>Choose an API from the list to see details and test it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
