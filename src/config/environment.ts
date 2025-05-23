const environments = {
  development: {
    apiBaseUrl: 'http://localhost:4000/api',
    imageBaseUrl: 'http://localhost:4000/storage/',
    debug: true
  },
  staging: {
    apiBaseUrl: 'https://stage-api.constru.com/api',
    imageBaseUrl: 'https://stage-api.constru.com/storage/',
    debug: true
  },
  production: {
    apiBaseUrl: 'https://api.constru.com/api',
    imageBaseUrl: 'https://api.constru.com/storage/',
    debug: false
  }
};

// Get current environment from build process or default to development
const currentEnv = import.meta.env.REACT_APP_ENV || 'development';

// Export the environment configuration
export const environment = environments[currentEnv as keyof typeof environments];

export default environment;