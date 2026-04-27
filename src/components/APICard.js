import React, { useState } from 'react';
import '../styles/APICard.css';
import { renderResponse } from '../utils/responseRenderer';

// Helper function to extract base URL (protocol + domain)
const getBaseUrl = (endpoint) => {
  try {
    const url = new URL(endpoint);
    return `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`;
  } catch (e) {
    return endpoint;
  }
};

// Helper function to extract path and query from endpoint
const getPathAndQuery = (endpoint) => {
  try {
    const url = new URL(endpoint);
    return url.pathname + url.search;
  } catch (e) {
    return '';
  }
};

function APICard({ api }) {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [queryParams, setQueryParams] = useState('');
  const [usedProxy, setUsedProxy] = useState(false);
  const [editedPath, setEditedPath] = useState('');

  const handleCall = async () => {
    setLoading(true);
    setError('');
    setResponse('');
    setUsedProxy(false);

    try {
      const baseUrl = getBaseUrl(api.endpoint);
      const defaultPath = getPathAndQuery(api.endpoint);
      const finalPath = editedPath || defaultPath;
      let url = baseUrl + finalPath;

      // Add query parameters if provided
      if (queryParams && api.method === 'GET') {
        const params = queryParams.split('&').filter(p => p.trim());
        if (params.length > 0) {
          url += '?' + params.join('&');
        }
      }

      let requestBodyParsed = null;
      if (api.method === 'POST' && requestBody) {
        try {
          requestBodyParsed = JSON.stringify(JSON.parse(requestBody));
        } catch (e) {
          setError('❌ Invalid JSON in request body. Make sure your JSON is properly formatted.');
          setLoading(false);
          return;
        }
      }

      // Use Netlify function as proxy for all requests
      const proxyUrl = '/.netlify/functions/proxy';
      
      const proxyRequest = {
        url: url,
        method: api.method,
        body: requestBodyParsed,
      };

      try {
        setUsedProxy(true);
        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(proxyRequest),
        });

        const responseData = await response.json();

        if (!response.ok) {
          let errorMsg = `❌ Server Error: ${responseData.status} ${responseData.statusText}\n\n`;
          
          if (responseData.status === 404) {
            errorMsg += `Why: The API endpoint was not found.\n\n`;
            errorMsg += `What: Check if the endpoint URL is correct: ${url}\n\n`;
            errorMsg += `Try: Verify the API documentation or endpoint path.`;
          } else if (responseData.status === 429) {
            errorMsg += `Why: Too many requests to this API.\n\n`;
            errorMsg += `What: The API has rate limiting enabled.\n\n`;
            errorMsg += `Try: Wait a few minutes before trying again.`;
          } else if (responseData.status === 500) {
            errorMsg += `Why: The API server encountered an error.\n\n`;
            errorMsg += `What: This is a server-side issue, not your request.\n\n`;
            errorMsg += `Try: Wait a moment and try again.`;
          } else {
            errorMsg += `Why: The server rejected your request.\n\n`;
            errorMsg += `What: ${JSON.stringify(responseData.data, null, 2).substring(0, 200)}`;
          }
          
          setError(errorMsg);
        } else {
          setResponse(responseData.data);
        }
      } catch (err) {
        setError(
          `❌ Proxy Error\n\n` +
          `Why: Something went wrong while processing your request through our server.\n\n` +
          `Error Details: ${err.message}\n\n` +
          `Try: Check the endpoint URL and try again.`
        );
      }
    } catch (err) {
      setError(
        `❌ Unexpected Error\n\n` +
        `Why: Something went wrong while processing your request.\n\n` +
        `Error Details: ${err.message}\n\n` +
        `Try: Check the endpoint URL and try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="api-card">
      <div className="api-header">
        <h2>{api.name}</h2>
        <span className={`method-badge ${api.method}`}>{api.method}</span>
      </div>

      <div className="api-description">
        <p><strong>Description:</strong> {api.description}</p>
        <div className="endpoint-display">
          <p><strong>Base URL:</strong> <code className="base-url">{getBaseUrl(api.endpoint)}</code></p>
          <p><strong>Default Path:</strong> <code className="default-path">{getPathAndQuery(api.endpoint)}</code></p>
        </div>
        {api.exampleUrl && <p><strong>Example:</strong> <code>{api.exampleUrl}</code></p>}
      </div>

      <div className="api-form">
        <div className="form-group">
          <label>🔧 Edit Path / Query (optional)</label>
          <input
            type="text"
            value={editedPath}
            onChange={(e) => setEditedPath(e.target.value)}
            placeholder={getPathAndQuery(api.endpoint)}
            className="form-input path-input"
          />
          <small>Leave empty to use default path. Example: /v1/data?search=test</small>
          {editedPath && (
            <p className="path-preview"><strong>Using:</strong> <code>{getBaseUrl(api.endpoint)}{editedPath}</code></p>
          )}
        </div>
        {api.method === 'GET' && (
          <div className="form-group">
            <label>Query Parameters (optional)</label>
            <input
              type="text"
              value={queryParams}
              onChange={(e) => setQueryParams(e.target.value)}
              placeholder="e.g., search=bitcoin&limit=5"
              className="form-input"
            />
            <small>Format: key1=value1&key2=value2</small>
          </div>
        )}

        {api.method === 'POST' && (
          <div className="form-group">
            <label>Request Body (JSON)</label>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder={`{\n  "key": "value"\n}`}
              className="form-textarea"
              rows="6"
            />
          </div>
        )}

        <button
          onClick={handleCall}
          disabled={loading}
          className="call-btn"
        >
          {loading ? '⏳ Calling...' : '🚀 Hit API'}
        </button>
      </div>

      <div className="api-response">
        <h3>Response:</h3>
        
        {usedProxy && (
          <div className="proxy-notice">
            ✅ Note: Request was proxied through CORS handler (original API doesn't allow direct browser requests)
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {response && (
          <div className="response-container">
            {renderResponse(response).content}
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(response, null, 2));
                alert('Response copied to clipboard!');
              }}
              className="copy-btn"
            >
              📋 Copy Response
            </button>
          </div>
        )}

        {!response && !error && !loading && (
          <p className="placeholder">Click "Hit API" to see the response here</p>
        )}
      </div>
    </div>
  );
}

export default APICard;