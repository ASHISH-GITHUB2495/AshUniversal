/**
 * Smart response renderer that detects content type and returns appropriate JSX
 * Handles images, audio, HTML, text, JSON, and mixed content
 */

export const renderResponse = (data) => {
  // Handle direct image URL (string)
  if (typeof data === 'string') {
    if (isImageUrl(data)) {
      return {
        type: 'image',
        content: <img src={data} alt="API Response" className="response-image" />
      };
    }
    if (isVideoUrl(data)) {
      return {
        type: 'video',
        content: <VideoRenderer videoUrl={data} />
      };
    }
    if (isAudioUrl(data)) {
      return {
        type: 'audio',
        content: <audio controls className="response-audio"><source src={data} /></audio>
      };
    }
    if (isHtmlContent(data)) {
      return {
        type: 'html',
        content: <HtmlRenderer htmlContent={data} />
      };
    }
    // Plain text response
    return {
      type: 'text',
      content: <div className="response-text">{data}</div>
    };
  }

  // Handle arrays
  if (Array.isArray(data)) {
    // Array of strings that are image URLs
    if (data.length > 0 && typeof data[0] === 'string' && isImageUrl(data[0])) {
      return {
        type: 'image-gallery',
        content: (
          <div className="response-image-gallery">
            {data.map((url, idx) => (
              <img key={idx} src={url} alt={`Gallery ${idx + 1}`} className="gallery-image" />
            ))}
          </div>
        )
      };
    }
    // Array of objects
    return {
      type: 'json',
      content: <JsonRenderer data={data} />
    };
  }

  // Handle objects
  if (typeof data === 'object' && data !== null) {
    // Check for specific API response structures
    
    // Random Dog API: { url, fileSizeBytes } - can be image or video
    if (data.url) {
      if (isVideoUrl(data.url)) {
        return {
          type: 'video',
          content: <VideoRenderer videoUrl={data.url} fileName={data.url.split('/').pop()} fileSize={data.fileSizeBytes} />
        };
      }
      if (isImageUrl(data.url)) {
        return {
          type: 'image',
          content: <img src={data.url} alt="API Response" className="response-image" />
        };
      }
    }

    // Random Fox API: { image, link }
    if (data.image && isImageUrl(data.image)) {
      return {
        type: 'image-with-link',
        content: (
          <div className="response-image-container">
            <img src={data.image} alt="Fox" className="response-image" />
            {data.link && <p><a href={data.link} target="_blank" rel="noopener noreferrer">View Source</a></p>}
          </div>
        )
      };
    }

    // NekosBest: { results: [...] }
    if (data.results && Array.isArray(data.results)) {
      const imageUrls = data.results
        .map(item => item.url)
        .filter(url => isImageUrl(url));
      
      if (imageUrls.length > 0) {
        return {
          type: 'image-gallery',
          content: (
            <div className="response-image-gallery">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="neko-item">
                  <img src={url} alt={`Neko ${idx + 1}`} className="gallery-image" />
                </div>
              ))}
            </div>
          )
        };
      }
    }

    // Jikan Anime: { data: { images, url, synopsis, ... } }
    if (data.data) {
      const animeData = data.data;
      if (animeData.images) {
        return {
          type: 'anime-card',
          content: <AnimeRenderer animeData={animeData} />
        };
      }
    }

    // Free Dictionary: { phonetics, meanings, ... }
    if (data.phonetics && data.meanings) {
      return {
        type: 'dictionary',
        content: <DictionaryRenderer dictData={data} />
      };
    }

    // Chuck Norris Jokes: { value, icon_url, ... }
    if (data.value && data.icon_url) {
      return {
        type: 'joke',
        content: (
          <div className="response-joke">
            <img src={data.icon_url} alt="Chuck Norris" className="joke-icon" />
            <p className="joke-text">{data.value}</p>
          </div>
        )
      };
    }

    // Open-Meteo Weather API: { current, latitude, longitude, timezone, ... }
    if (data.current && (data.latitude !== undefined && data.longitude !== undefined)) {
      return {
        type: 'weather',
        content: <WeatherRenderer weatherData={data} />
      };
    }

    // REST Countries API: Array of countries with { name, flags, capital, ... }
    if (Array.isArray(data) && data.length > 0 && data[0].name && data[0].flags) {
      return {
        type: 'countries',
        content: <CountriesRenderer countries={data} />
      };
    }

    // REST Countries API: Single country response
    if (data.name && data.flags && (data.capital || data.region)) {
      return {
        type: 'country',
        content: <CountryRenderer country={data} />
      };
    }

    // Generic JSON object
    return {
      type: 'json',
      content: <JsonRenderer data={data} />
    };
  }

  // Fallback
  return {
    type: 'text',
    content: <div className="response-text">{JSON.stringify(data, null, 2)}</div>
  };
};

// Helper components
const JsonRenderer = ({ data }) => (
  <pre className="response-json">
    <code>{JSON.stringify(data, null, 2)}</code>
  </pre>
);

const AnimeRenderer = ({ animeData }) => {
  const posterUrl = animeData.images?.jpg?.large_image_url || 
                    animeData.images?.webp?.large_image_url;
  
  return (
    <div className="response-anime-card">
      {posterUrl && <img src={posterUrl} alt={animeData.title} className="anime-poster" />}
      <div className="anime-details">
        <h3>{animeData.title}</h3>
        {animeData.score && <p><strong>Score:</strong> {animeData.score}/10</p>}
        {animeData.episodes && <p><strong>Episodes:</strong> {animeData.episodes}</p>}
        {animeData.synopsis && <p className="synopsis">{animeData.synopsis}</p>}
        {animeData.url && (
          <a href={animeData.url} target="_blank" rel="noopener noreferrer" className="view-link">
            View on MyAnimeList
          </a>
        )}
      </div>
    </div>
  );
};

const VideoRenderer = ({ videoUrl, fileName, fileSize }) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  return (
    <div className="response-video-container">
      <video controls className="response-video">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-info">
        {fileName && <p className="video-name"><strong>File:</strong> {fileName}</p>}
        {fileSize && <p className="video-size"><strong>Size:</strong> {formatFileSize(fileSize)}</p>}
      </div>
    </div>
  );
};

const DictionaryRenderer = ({ dictData }) => {
  const word = Array.isArray(dictData) ? dictData[0] : dictData;
  
  return (
    <div className="response-dictionary">
      <div className="dict-word">
        <h2>{word.word}</h2>
        {word.phonetic && <p className="phonetic">/{word.phonetic}/</p>}
      </div>

      {word.phonetics && word.phonetics.length > 0 && (
        <div className="phonetics">
          {word.phonetics.map((p, idx) => (
            p.audio && (
              <div key={idx}>
                <button className="audio-button" onClick={() => new Audio(p.audio).play()}>
                  🔊 Listen
                </button>
              </div>
            )
          ))}
        </div>
      )}

      {word.meanings && (
        <div className="meanings">
          {word.meanings.map((meaning, idx) => (
            <div key={idx} className="meaning">
              <h4><em>{meaning.partOfSpeech}</em></h4>
              <h5>Definitions:</h5>
              <ul>
                {meaning.definitions.slice(0, 3).map((def, i) => (
                  <li key={i}>
                    <strong>{def.definition}</strong>
                    {def.example && <p className="example">"<em>{def.example}</em>"</p>}
                  </li>
                ))}
              </ul>
              {meaning.synonyms && meaning.synonyms.length > 0 && (
                <p className="synonyms">
                  <strong>Synonyms:</strong> {meaning.synonyms.slice(0, 5).join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Weather Renderer Component
const WeatherRenderer = ({ weatherData }) => {
  const { current, latitude, longitude, timezone } = weatherData;
  
  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: '☀️ Clear sky',
      1: '🌤️ Mainly clear',
      2: '⛅ Partly cloudy',
      3: '☁️ Overcast',
      45: '🌫️ Fog',
      48: '🌫️ Foggy',
      51: '🌧️ Light drizzle',
      53: '🌧️ Moderate drizzle',
      55: '🌧️ Dense drizzle',
      61: '🌧️ Slight rain',
      63: '🌧️ Moderate rain',
      65: '🌧️ Heavy rain',
      71: '❄️ Slight snow',
      73: '❄️ Moderate snow',
      75: '❄️ Heavy snow',
      80: '🌦️ Slight showers',
      81: '🌧️ Moderate showers',
      82: '⛈️ Violent showers',
      85: '❄️ Slight snow showers',
      86: '❄️ Heavy snow showers',
      95: '⛈️ Thunderstorm',
      96: '⛈️ Thunderstorm with hail',
      99: '⛈️ Thunderstorm with heavy hail'
    };
    return weatherCodes[code] || `Weather code: ${code}`;
  };

  return (
    <div className="response-weather">
      <div className="weather-header">
        <h2>🌍 Weather Forecast</h2>
        <p className="location">{timezone}</p>
        <p className="coordinates">📍 {latitude.toFixed(2)}°, {longitude.toFixed(2)}°</p>
      </div>

      <div className="weather-current">
        <div className="weather-main">
          <div className="weather-description">
            {getWeatherDescription(current.weather_code)}
          </div>
          <div className="temperature">
            <span className="temp-value">{Math.round(current.temperature_2m)}°</span>
            <span className="temp-unit">C</span>
          </div>
        </div>

        <div className="weather-details-grid">
          {current.relative_humidity_2m !== undefined && (
            <div className="weather-detail">
              <span className="detail-label">💧 Humidity</span>
              <span className="detail-value">{current.relative_humidity_2m}%</span>
            </div>
          )}
          
          {current.apparent_temperature !== undefined && (
            <div className="weather-detail">
              <span className="detail-label">🌡️ Feels Like</span>
              <span className="detail-value">{Math.round(current.apparent_temperature)}°C</span>
            </div>
          )}
          
          {current.wind_speed_10m !== undefined && (
            <div className="weather-detail">
              <span className="detail-label">💨 Wind Speed</span>
              <span className="detail-value">{current.wind_speed_10m} km/h</span>
            </div>
          )}
          
          {current.wind_direction_10m !== undefined && (
            <div className="weather-detail">
              <span className="detail-label">🧭 Wind Direction</span>
              <span className="detail-value">{current.wind_direction_10m}°</span>
            </div>
          )}
          
          {current.wind_gusts_10m !== undefined && (
            <div className="weather-detail">
              <span className="detail-label">💨 Wind Gusts</span>
              <span className="detail-value">{current.wind_gusts_10m} km/h</span>
            </div>
          )}
          
          {current.precipitation !== undefined && (
            <div className="weather-detail">
              <span className="detail-label">🌧️ Precipitation</span>
              <span className="detail-value">{current.precipitation} mm</span>
            </div>
          )}
          
          {current.cloud_cover !== undefined && (
            <div className="weather-detail">
              <span className="detail-label">☁️ Cloud Cover</span>
              <span className="detail-value">{current.cloud_cover}%</span>
            </div>
          )}
          
          {current.pressure_msl !== undefined && (
            <div className="weather-detail">
              <span className="detail-label">🔽 Pressure</span>
              <span className="detail-value">{current.pressure_msl} hPa</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Countries Renderer Component (for multiple countries)
const CountriesRenderer = ({ countries }) => {
  return (
    <div className="response-countries">
      <h2>🌍 Countries List</h2>
      <div className="countries-grid">
        {countries.map((country, idx) => (
          <CountryCard key={idx} country={country} />
        ))}
      </div>
    </div>
  );
};

// Country Card Component (for individual country in list)
const CountryCard = ({ country }) => {
  const flagUrl = country.flags?.png || country.flags?.svg;
  const countryName = country.name?.common || country.name;

  return (
    <div className="country-card">
      {flagUrl && (
        <div className="country-flag-container">
          <img src={flagUrl} alt={`${countryName} flag`} className="country-flag" />
        </div>
      )}
      <div className="country-info">
        <h3>{countryName}</h3>
        {country.capital && <p><strong>Capital:</strong> {Array.isArray(country.capital) ? country.capital[0] : country.capital}</p>}
        {country.region && <p><strong>Region:</strong> {country.region}</p>}
        {country.population && <p><strong>Population:</strong> {(country.population / 1000000).toFixed(1)}M</p>}
        {country.area && <p><strong>Area:</strong> {country.area.toLocaleString()} km²</p>}
      </div>
    </div>
  );
};

// Country Renderer Component (for single country)
const CountryRenderer = ({ country }) => {
  const flagUrl = country.flags?.png || country.flags?.svg;
  const countryName = country.name?.common || country.name;
  const officialName = country.name?.official;

  return (
    <div className="response-country">
      <div className="country-header">
        {flagUrl && (
          <div className="country-large-flag">
            <img src={flagUrl} alt={`${countryName} flag`} />
          </div>
        )}
        <div className="country-title">
          <h2>{countryName}</h2>
          {officialName && <p className="official-name">{officialName}</p>}
          {country.altSpellings && country.altSpellings.length > 0 && (
            <p className="alt-names">Also known as: {country.altSpellings.join(', ')}</p>
          )}
        </div>
      </div>

      <div className="country-details">
        <div className="details-section">
          <h3>🌍 Geography</h3>
          {country.region && <p><strong>Region:</strong> {country.region}</p>}
          {country.subregion && <p><strong>Subregion:</strong> {country.subregion}</p>}
          {country.area && <p><strong>Area:</strong> {country.area.toLocaleString()} km²</p>}
          {country.capital && <p><strong>Capital:</strong> {Array.isArray(country.capital) ? country.capital.join(', ') : country.capital}</p>}
        </div>

        <div className="details-section">
          <h3>👥 Demographics</h3>
          {country.population && <p><strong>Population:</strong> {(country.population).toLocaleString()}</p>}
          {country.demonym && <p><strong>Demonym:</strong> {country.demonym}</p>}
        </div>

        <div className="details-section">
          <h3>💰 Currencies</h3>
          {country.currencies && Object.entries(country.currencies).map(([code, currency]) => (
            <p key={code}><strong>{code}:</strong> {currency.name} ({currency.symbol})</p>
          ))}
        </div>

        <div className="details-section">
          <h3>🗣️ Languages</h3>
          {country.languages && Object.entries(country.languages).map(([code, lang]) => (
            <span key={code} className="language-badge">{lang}</span>
          ))}
        </div>

        {country.timezones && (
          <div className="details-section">
            <h3>⏰ Timezones</h3>
            <div className="timezones-list">
              {country.timezones.map((tz, idx) => (
                <span key={idx} className="timezone-badge">{tz}</span>
              ))}
            </div>
          </div>
        )}

        {country.borders && country.borders.length > 0 && (
          <div className="details-section">
            <h3>🗺️ Borders</h3>
            <p>{country.borders.join(', ')}</p>
          </div>
        )}

        {country.gini && (
          <div className="details-section">
            <h3>📊 Gini Coefficient</h3>
            {Object.entries(country.gini).map(([year, value]) => (
              <p key={year}><strong>{year}:</strong> {value}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
const isImageUrl = (str) => {
  if (typeof str !== 'string') return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const imageMimes = ['image/'];
  
  const lowerStr = str.toLowerCase();
  return imageExtensions.some(ext => lowerStr.includes(ext)) ||
         imageMimes.some(mime => lowerStr.includes(mime));
};

const isVideoUrl = (str) => {
  if (typeof str !== 'string') return false;
  const videoExtensions = ['.mp4', '.webm', '.avi', '.mov', '.mkv', '.m3u8', '.flv'];
  const videoMimes = ['video/'];
  
  const lowerStr = str.toLowerCase();
  return videoExtensions.some(ext => lowerStr.includes(ext)) ||
         videoMimes.some(mime => lowerStr.includes(mime));
};

const isAudioUrl = (str) => {
  if (typeof str !== 'string') return false;
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
  const audioMimes = ['audio/'];
  
  const lowerStr = str.toLowerCase();
  return audioExtensions.some(ext => lowerStr.includes(ext)) ||
         audioMimes.some(mime => lowerStr.includes(mime));
};

const isHtmlContent = (str) => {
  if (typeof str !== 'string') return false;
  // Check for common HTML tags
  const htmlTagRegex = /<\s*\/?\s*(?:html|body|div|p|span|h[1-6]|a|img|ul|ol|li|table|form|input|button|script|style|head|title|meta|link)\b/i;
  return htmlTagRegex.test(str);
};

// HTML Renderer Component
const HtmlRenderer = ({ htmlContent }) => {
  return (
    <div className="response-html-container">
      <div className="response-html-viewer">
        <iframe
          srcDoc={sanitizeHtml(htmlContent)}
          className="html-iframe"
          title="HTML Response"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
      <details className="html-source">
        <summary>📄 View HTML Source</summary>
        <pre className="response-json">
          <code>{htmlContent}</code>
        </pre>
      </details>
    </div>
  );
};

// Sanitize HTML to prevent XSS while maintaining styling
const sanitizeHtml = (html) => {
  // Wrap in basic HTML structure if not already
  if (!html.includes('<html') && !html.includes('<!DOCTYPE')) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; padding: 20px; background: #f9f9f9; }
          img { max-width: 100%; height: auto; }
          a { color: #667eea; text-decoration: none; }
          a:hover { text-decoration: underline; }
          table { border-collapse: collapse; width: 100%; margin: 15px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background: #667eea; color: white; }
          tr:nth-child(even) { background: #f5f5f5; }
          code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; }
          pre { background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; overflow-x: auto; }
          h1, h2, h3, h4, h5, h6 { margin: 15px 0 10px 0; }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;
  }
  return html;
};
