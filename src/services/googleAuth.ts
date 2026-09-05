// Google Identity Services (GSI) OAuth 2.0 Helper
const GOOGLE_CLIENT_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_CLIENT_ID) ||
  '357128961442-p7ped6vl21hd20ojno7icqgj1n09jv95.apps.googleusercontent.com';

export interface GoogleUserProfile {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: any) => void;
            error_callback?: (err: any) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
        id?: {
          initialize: (config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

/**
 * Load Google Identity Services script dynamically if not already loaded
 */
export const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }

    const existingScript = document.getElementById('google-gsi-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', (e) => reject(e));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
};

/**
 * Trigger real Google OAuth popup flow and retrieve user profile info
 */
export const promptGoogleSignIn = async (): Promise<GoogleUserProfile> => {
  await loadGoogleScript();

  return new Promise((resolve, reject) => {
    if (!window.google?.accounts?.oauth2) {
      reject(new Error('Google Identity Services SDK failed to load.'));
      return;
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'openid email profile',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            reject(new Error(tokenResponse.error_description || tokenResponse.error));
            return;
          }

          if (tokenResponse.access_token) {
            try {
              // Fetch profile information using access_token
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`,
                },
              });

              if (!res.ok) {
                throw new Error(`Failed to fetch Google profile: ${res.statusText}`);
              }

              const profile: GoogleUserProfile = await res.json();
              resolve(profile);
            } catch (fetchErr) {
              reject(fetchErr);
            }
          } else {
            reject(new Error('No access token received from Google.'));
          }
        },
        error_callback: (err: any) => {
          reject(err);
        },
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      reject(err);
    }
  });
};
