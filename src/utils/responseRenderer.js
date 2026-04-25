/**
 * Smart response renderer that detects content type and returns appropriate JSX
 * Handles images, audio, text, JSON, and mixed content
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
    if (isAudioUrl(data)) {
      return {
        type: 'audio',
        content: <audio controls className="response-audio"><source src={data} /></audio>
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
    
    // Random Dog API: { url, fileSizeBytes }
    if (data.url && isImageUrl(data.url)) {
      return {
        type: 'image',
        content: <img src={data.url} alt="API Response" className="response-image" />
      };
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

// Helper functions
const isImageUrl = (str) => {
  if (typeof str !== 'string') return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const imageMimes = ['image/'];
  
  const lowerStr = str.toLowerCase();
  return imageExtensions.some(ext => lowerStr.includes(ext)) ||
         imageMimes.some(mime => lowerStr.includes(mime));
};

const isAudioUrl = (str) => {
  if (typeof str !== 'string') return false;
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
  const audioMimes = ['audio/'];
  
  const lowerStr = str.toLowerCase();
  return audioExtensions.some(ext => lowerStr.includes(ext)) ||
         audioMimes.some(mime => lowerStr.includes(mime));
};
