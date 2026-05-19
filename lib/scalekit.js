import { ScalekitClient } from '@scalekit-sdk/node';

// Singleton ScalekitClient instance
let scalekitInstance = null;

export function getScalekitClient() {
  if (!scalekitInstance) {
    const isProd = process.env.NODE_ENV === 'production';
    const envUrl = isProd 
      ? (process.env.SCALEKIT_ENVIRONMENT_URL_PROD || process.env.SCALEKIT_ENVIRONMENT_URL) 
      : process.env.SCALEKIT_ENVIRONMENT_URL;
    const clientId = isProd 
      ? (process.env.SCALEKIT_CLIENT_ID_PROD || process.env.SCALEKIT_CLIENT_ID) 
      : process.env.SCALEKIT_CLIENT_ID;
    const clientSecret = isProd 
      ? (process.env.SCALEKIT_CLIENT_SECRET_PROD || process.env.SCALEKIT_CLIENT_SECRET) 
      : process.env.SCALEKIT_CLIENT_SECRET;

    if (!envUrl || !clientId || !clientSecret) {
      throw new Error(`Missing Scalekit environment variables for ${isProd ? 'production' : 'development'}`);
    }

    scalekitInstance = new ScalekitClient(envUrl, clientId, clientSecret);
  }

  return scalekitInstance;
}


// Default scopes for OAuth
export function getDefaultScopes() {
  const scopes = process.env.SCALEKIT_SCOPES || 'openid profile email offline_access';
  return scopes.split(' ');
}