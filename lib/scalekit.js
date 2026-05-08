import { ScalekitClient } from '@scalekit-sdk/node';

// Singleton ScalekitClient instance
let scalekitInstance = null;

export function getScalekitClient() {
  if (!scalekitInstance) {
    const envUrl = process.env.SCALEKIT_ENVIRONMENT_URL;
    const clientId = process.env.SCALEKIT_CLIENT_ID;
    const clientSecret = process.env.SCALEKIT_CLIENT_SECRET;

    if (!envUrl || !clientId || !clientSecret) {
      throw new Error('Missing Scalekit environment variables');
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