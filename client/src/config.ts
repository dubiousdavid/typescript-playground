const DEFAULT_API_PORT = 8000;
const apiPort = process.env.REACT_APP_API_PORT || DEFAULT_API_PORT;
const apiOrigin = `http://localhost:${apiPort}`;
const config = { apiOrigin };

export default config;
