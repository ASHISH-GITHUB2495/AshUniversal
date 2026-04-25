// CORS Proxy helper - use for APIs that don't support CORS
export const CORS_PROXY = "https://api.allorigins.win/raw?url=";

export const freeApis = [
  // Animals
  {
    id: 1,
    name: "Random Dog",
    category: "Animals",
    description: "Get random pictures of dogs",
    endpoint: "https://random.dog/woof.json",
    method: "GET",
    corsProxy: true,
    exampleUrl: "https://random.dog/woof.json"
  },
  {
    id: 2,
    name: "Random Fox",
    category: "Animals",
    description: "Get random pictures of foxes",
    endpoint: "https://randomfox.ca/floof/",
    method: "GET",
    corsProxy: true,
    exampleUrl: "https://randomfox.ca/floof/"
  },
  {
    id: 3,
    name: "Cat Facts",
    category: "Animals",
    description: "Get daily cat facts",
    endpoint: "https://cat-fact.herokuapp.com/facts",
    method: "GET",
    corsProxy: true,
    exampleUrl: "https://cat-fact.herokuapp.com/facts"
  },
  {
    id: 4,
    name: "Dog Facts",
    category: "Animals",
    description: "Get random dog facts",
    endpoint: "https://dog.ceo/api/breeds/list/all",
    method: "GET",
    exampleUrl: "https://dog.ceo/api/breeds/list/all"
  },
  {
    id: 5,
    name: "RandomDuck",
    category: "Animals",
    description: "Get random pictures of ducks",
    endpoint: "https://random-d.uk/api",
    method: "GET",
    corsProxy: true,
    exampleUrl: "https://random-d.uk/api"
  },
  {
    id: 6,
    name: "Shibe Online",
    category: "Animals",
    description: "Get random pictures of Shiba Inu, cats or birds",
    endpoint: "http://shibe.online/api/shibes",
    method: "GET",
    corsProxy: true,
    exampleUrl: "http://shibe.online/api/shibes?count=1"
  },
  
  // Anime
  {
    id: 7,
    name: "Jikan Anime",
    category: "Anime",
    description: "Unofficial MyAnimeList API",
    endpoint: "https://api.jikan.moe/v4/random/anime",
    method: "GET",
    exampleUrl: "https://api.jikan.moe/v4/random/anime"
  },
  {
    id: 8,
    name: "AnimeFacts",
    category: "Anime",
    description: "Anime facts (over 100+)",
    endpoint: "https://chandan-02.github.io/anime-facts-rest-api/api/v1/facts",
    method: "GET",
    exampleUrl: "https://chandan-02.github.io/anime-facts-rest-api/api/v1/facts"
  },
  {
    id: 9,
    name: "NekosBest",
    category: "Anime",
    description: "Neko images and anime GIFs",
    endpoint: "https://api.nekos.best/v2/neko",
    method: "GET",
    exampleUrl: "https://api.nekos.best/v2/neko"
  },
  {
    id: 10,
    name: "Studio Ghibli",
    category: "Anime",
    description: "Studio Ghibli films data",
    endpoint: "https://ghibliapi.herokuapp.com/films",
    method: "GET",
    exampleUrl: "https://ghibliapi.herokuapp.com/films"
  },

  // Entertainment
  {
    id: 11,
    name: "Chuck Norris Jokes",
    category: "Entertainment",
    description: "Random Chuck Norris jokes",
    endpoint: "https://api.chucknorris.io/jokes/random",
    method: "GET",
    exampleUrl: "https://api.chucknorris.io/jokes/random"
  },
  {
    id: 12,
    name: "Yo Momma Jokes",
    category: "Entertainment",
    description: "Random Yo Momma jokes",
    endpoint: "https://yomommajokes.vercel.app/api",
    method: "GET",
    exampleUrl: "https://yomommajokes.vercel.app/api"
  },
  {
    id: 13,
    name: "Random Fun Fact",
    category: "Entertainment",
    description: "Get random fun facts",
    endpoint: "https://uselessfacts.jsph.pl/random.json?language=en",
    method: "GET",
    exampleUrl: "https://uselessfacts.jsph.pl/random.json?language=en"
  },
  
  // Development
  {
    id: 14,
    name: "Agify",
    category: "Development",
    description: "Guess age from first name",
    endpoint: "https://api.agify.io",
    method: "GET",
    exampleUrl: "https://api.agify.io?name=michael"
  },
  {
    id: 15,
    name: "Genderize",
    category: "Development",
    description: "Estimate gender from first name",
    endpoint: "https://api.genderize.io",
    method: "GET",
    exampleUrl: "https://api.genderize.io?name=john"
  },
  {
    id: 16,
    name: "Nationalize",
    category: "Development",
    description: "Estimate nationality from first name",
    endpoint: "https://api.nationalize.io",
    method: "GET",
    exampleUrl: "https://api.nationalize.io?name=michael"
  },
  {
    id: 17,
    name: "Httpbin",
    category: "Development",
    description: "HTTP testing service",
    endpoint: "https://httpbin.org/get",
    method: "GET",
    exampleUrl: "https://httpbin.org/get?test=value"
  },
  {
    id: 18,
    name: "CountAPI",
    category: "Development",
    description: "Simple counting service",
    endpoint: "https://api.countapi.xyz/get/my-site/my-counter",
    method: "GET",
    exampleUrl: "https://api.countapi.xyz/get/my-site/my-counter"
  },
  {
    id: 19,
    name: "QR Code Generator",
    category: "Development",
    description: "Generate QR codes",
    endpoint: "https://api.qrserver.com/v1/create-qr-code/",
    method: "GET",
    exampleUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Hello"
  },

  // Geocoding
  {
    id: 20,
    name: "REST Countries",
    category: "Geocoding",
    description: "Get information about countries",
    endpoint: "https://restcountries.com/v3.1/all",
    method: "GET",
    exampleUrl: "https://restcountries.com/v3.1/name/india"
  },
  {
    id: 21,
    name: "IP API",
    category: "Geocoding",
    description: "Get IP geolocation information",
    endpoint: "https://ipapi.co/json/",
    method: "GET",
    exampleUrl: "https://ipapi.co/json/"
  },
  {
    id: 22,
    name: "Open Nominatim",
    category: "Geocoding",
    description: "Worldwide forward/reverse geocoding",
    endpoint: "https://nominatim.openstreetmap.org/search?q=New+York&format=json",
    method: "GET",
    exampleUrl: "https://nominatim.openstreetmap.org/search?q=New+York&format=json"
  },

  // Books
  {
    id: 23,
    name: "Bible API",
    category: "Books",
    description: "Free Bible API with multiple languages",
    endpoint: "https://bible-api.com/John+3:16",
    method: "GET",
    exampleUrl: "https://bible-api.com/John+3:16"
  },
  {
    id: 24,
    name: "Quran API",
    category: "Books",
    description: "Quran data with translations",
    endpoint: "https://api.alquran.cloud/v1/randomayah",
    method: "GET",
    exampleUrl: "https://api.alquran.cloud/v1/randomayah"
  },
  {
    id: 25,
    name: "PoetryDB",
    category: "Books",
    description: "Large poetry collection",
    endpoint: "https://poetrydb.org/random",
    method: "GET",
    exampleUrl: "https://poetrydb.org/random"
  },

  // Dictionaries
  {
    id: 26,
    name: "Free Dictionary",
    category: "Dictionaries",
    description: "English word definitions and synonyms",
    endpoint: "https://api.dictionaryapi.dev/api/v2/entries/en/hello",
    method: "GET",
    exampleUrl: "https://api.dictionaryapi.dev/api/v2/entries/en/hello"
  },
  {
    id: 27,
    name: "Wiktionary",
    category: "Dictionaries",
    description: "Collaborative dictionary data",
    endpoint: "https://en.wiktionary.org/w/api.php?action=query&titles=hello&format=json",
    method: "GET",
    exampleUrl: "https://en.wiktionary.org/w/api.php?action=query&titles=hello&format=json"
  },

  // Sports
  {
    id: 28,
    name: "Ball Dont Lie",
    category: "Sports",
    description: "NBA statistics and data",
    endpoint: "https://www.balldontlie.io/api/v1/players",
    method: "GET",
    exampleUrl: "https://www.balldontlie.io/api/v1/players"
  },
  {
    id: 29,
    name: "Open Liga DB",
    category: "Sports",
    description: "Crowd sourced sports league results",
    endpoint: "https://www.openligadb.de/api/getmatchday/bl1/2023/34",
    method: "GET",
    exampleUrl: "https://www.openligadb.de/api/getmatchday/bl1/2023/34"
  },

  // Art & Design
  {
    id: 30,
    name: "Art Institute of Chicago",
    category: "Art & Design",
    description: "Art museum database",
    endpoint: "https://api.artic.edu/api/v1/artworks",
    method: "GET",
    exampleUrl: "https://api.artic.edu/api/v1/artworks"
  },
  {
    id: 31,
    name: "EmojiHub",
    category: "Art & Design",
    description: "Get emojis by categories",
    endpoint: "https://api.github.com/emojis",
    method: "GET",
    exampleUrl: "https://api.github.com/emojis"
  },

  // News
  {
    id: 32,
    name: "Spaceflight News",
    category: "News",
    description: "Spaceflight related news",
    endpoint: "https://api.spaceflightnewsapi.net/v4/articles",
    method: "GET",
    exampleUrl: "https://api.spaceflightnewsapi.net/v4/articles"
  },

  // Science & Math
  {
    id: 33,
    name: "Newton Math",
    category: "Science & Math",
    description: "Symbolic and arithmetic math calculator",
    endpoint: "https://newton.vercel.app/api/v2/simplify/x^2",
    method: "GET",
    exampleUrl: "https://newton.vercel.app/api/v2/simplify/x^2"
  },
  {
    id: 34,
    name: "NASA APOD",
    category: "Science & Math",
    description: "NASA Astronomy Picture of the Day",
    endpoint: "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY",
    method: "GET",
    exampleUrl: "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
  },
  {
    id: 35,
    name: "SpaceX API",
    category: "Science & Math",
    description: "SpaceX company, vehicle and launch data",
    endpoint: "https://api.spacexdata.com/v4/rockets",
    method: "GET",
    exampleUrl: "https://api.spacexdata.com/v4/rockets"
  },

  // Weather
  {
    id: 36,
    name: "Open-Meteo Weather",
    category: "Weather",
    description: "Free weather forecast API",
    endpoint: "https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.1&current=temperature_2m",
    method: "GET",
    exampleUrl: "https://api.open-meteo.com/v1/forecast?latitude=40&longitude=-74&current=temperature_2m"
  },

  // Video/Movies
  {
    id: 37,
    name: "SWAPI",
    category: "Video",
    description: "Star Wars API",
    endpoint: "https://swapi.dev/api/people/1/",
    method: "GET",
    exampleUrl: "https://swapi.dev/api/people/"
  },
  {
    id: 38,
    name: "Game of Thrones Quotes",
    category: "Video",
    description: "Game of Thrones quotes",
    endpoint: "https://gameofthronesquotes.xyz/random",
    method: "GET",
    exampleUrl: "https://gameofthronesquotes.xyz/random"
  },

  // Test Data
  {
    id: 39,
    name: "JSONPlaceholder Users",
    category: "Test Data",
    description: "Fake user data for testing",
    endpoint: "https://jsonplaceholder.typicode.com/users",
    method: "GET",
    exampleUrl: "https://jsonplaceholder.typicode.com/users"
  },
  {
    id: 40,
    name: "JSONPlaceholder Posts",
    category: "Test Data",
    description: "Fake posts for testing",
    endpoint: "https://jsonplaceholder.typicode.com/posts",
    method: "GET",
    exampleUrl: "https://jsonplaceholder.typicode.com/posts"
  },
  {
    id: 41,
    name: "RandomUser",
    category: "Test Data",
    description: "Generate random user data",
    endpoint: "https://randomuser.me/api/",
    method: "GET",
    exampleUrl: "https://randomuser.me/api/?results=5"
  },
  {
    id: 42,
    name: "FakerAPI",
    category: "Test Data",
    description: "Generate fake test data",
    endpoint: "https://fakerapi.it/api/v1/users",
    method: "GET",
    exampleUrl: "https://fakerapi.it/api/v1/users?_quantity=5"
  },

  // Personality
  {
    id: 43,
    name: "Dad Jokes",
    category: "Personality",
    description: "Large collection of dad jokes",
    endpoint: "https://icanhazdadjoke.com/",
    method: "GET",
    exampleUrl: "https://icanhazdadjoke.com/random?type=json"
  },
  {
    id: 44,
    name: "Kanye Quotes",
    category: "Personality",
    description: "Random Kanye West quotes",
    endpoint: "https://api.kanye.rest/",
    method: "GET",
    exampleUrl: "https://api.kanye.rest/"
  },

  // Gaming
  {
    id: 45,
    name: "Pokemon API",
    category: "Gaming",
    description: "Pokemon information database",
    endpoint: "https://pokeapi.co/api/v2/pokemon/1",
    method: "GET",
    exampleUrl: "https://pokeapi.co/api/v2/pokemon/pikachu"
  },
  {
    id: 46,
    name: "Chess.com",
    category: "Gaming",
    description: "Chess.com player statistics",
    endpoint: "https://api.chess.com/pub/players",
    method: "GET",
    exampleUrl: "https://api.chess.com/pub/player/magnuscarlsen"
  },
];
