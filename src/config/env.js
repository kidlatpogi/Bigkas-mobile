// Environment configuration
// Update these values based on your environment

const ENV = {
  development: {
    API_BASE_URL: 'http://localhost:8000/api',
    SUPABASE_URL: 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: 'your-supabase-anon-key',
    // For physical device testing, use your machine's IP address:
    // API_BASE_URL: 'http://192.168.x.x:8000/api',
  },
  staging: {
    API_BASE_URL: 'https://staging-api.bigkas.com/api',
    SUPABASE_URL: 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: 'your-supabase-anon-key',
  },
  production: {
    API_BASE_URL: 'https://api.bigkas.com/api',
    SUPABASE_URL: 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: 'your-supabase-anon-key',
  },
};

const getEnvVars = (env = 'development') => {
  return ENV[env] || ENV.development;
};

export const { API_BASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY } = getEnvVars('development');

export default {
  API_BASE_URL,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
};
