// Environment configuration
// Update these values based on your environment

const ENV = {
  development: {
    API_BASE_URL: 'http://localhost:8000/api',
    // For physical device testing, use your machine's IP address:
    // API_BASE_URL: 'http://192.168.x.x:8000/api',
  },
  staging: {
    API_BASE_URL: 'https://staging-api.bigkas.com/api',
  },
  production: {
    API_BASE_URL: 'https://api.bigkas.com/api',
  },
};

const getEnvVars = (env = 'development') => {
  return ENV[env] || ENV.development;
};

export const { API_BASE_URL } = getEnvVars('development');

export default {
  API_BASE_URL,
};
