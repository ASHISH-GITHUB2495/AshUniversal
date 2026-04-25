import React, { useState } from 'react';
import '../styles/APICard.css';

function APICard({ api }) {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [queryParams, setQueryParams] = useState('');

  const handleCall = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      let url = api.endpoint;

      // Add query parameters if provided
      if (queryParams && api.method === 'GET') {
        const params = queryParams.split('&').filter(p => p.trim());
        if (params.length > 0) {
          url += '?' + params.join('&');
        }
      }

      const options = {
        method: api.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Add body for POST requests
      if (api.method === 'POST' && requestBody) {
        try {
          options.body = JSON.stringify(JSON.parse(requestBody));
        } catch (e) {
          setError('❌ Invalid JSON in request body. Make sure your JSON is properly formatted.');
          setLoading(false);
          return;
        }
      }

      let response;
      try {
        response = await fetch(url, options);
      } catch (fetchErr) {
        if (fetchErr.message.includes('Failed to fetch')) {
          setError(
            `❌ CORS Error or Network Issue\n\n` +
            `Why: The API server blocked the request from your browser.\n\n` +
            `What: This usually happens because:\n` +
            `• The API doesn't allow cross-origin requests\n` +
            `• Your internet connection is down\n` +
            `• The API server is offline\n\n` +
            `Try: Test the API directly at: ${url}`
          );
        } else {
          setError(`❌ Network Error: ${fetchErr.message}`);
        }
        setLoading(false);
        return;
      }

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonErr) {
          setError(`❌ Invalid JSON Response\n\nThe server returned invalid JSON: ${jsonErr.message}`);
          setLoading(false);
          return;
        }
      } else {
        const text = await response.text();
        data = { 'Raw Response': text };
      }

      if (!response.ok) {
        let errorMsg = `❌ Server Error: ${response.status} ${response.statusText}\n\n`;
        
        if (response.status === 404) {
          errorMsg += `Why: The API endpoint was not found.\n\n`;
          errorMsg += `What: Check if the endpoint URL is correct: ${url}\n\n`;
          errorMsg += `Try: Verify the API documentation or endpoint path.`;
        } else if (response.status === 429) {
          errorMsg += `Why: Too many requests to this API.\n\n`;
          errorMsg += `What: The API has rate limiting enabled.\n\n`;
          errorMsg += `Try: Wait a few minutes before trying again.`;
        } else if (response.status === 500) {
          errorMsg += `Why: The API server encountered an error.\n\n`;
          errorMsg += `What: This is a server-side issue, not your request.\n\n`;
          errorMsg += `Try: Wait a moment and try again.`;
        } else {
          errorMsg += `Why: The server rejected your request.\n\n`;
          errorMsg += `What: ${JSON.stringify(data, null, 2).substring(0, 200)}`;
        }
        
        setError(errorMsg);
      } else {
        setResponse(JSON.stringify(data, null, 2));
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
        <p><strong>Endpoint:</strong> <code>{api.endpoint}</code></p>
        {api.exampleUrl && <p><strong>Example:</strong> <code>{api.exampleUrl}</code></p>}
      </div>

      <div className="api-form">
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
        
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {response && (
          <div className="response-container">
            <pre className="response-text">{response}</pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(response);
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