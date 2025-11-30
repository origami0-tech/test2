
// Service to handle TikTok API interactions
// Documentation Reference: https://developers.tiktok.com/doc/

const TIKTOK_API_BASE = 'https://open.tiktokapis.com/v2';

interface TikTokUserResponse {
  data: {
    user: {
      display_name: string;
      avatar_url: string;
      username?: string;
    }
  },
  error: {
    code: string;
    message: string;
    log_id: string;
  }
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  open_id: string;
  refresh_token: string;
  refresh_expires_in: number;
  scope: string;
  token_type: string;
  error?: string;
  error_description?: string;
}

/**
 * Exchanges an Authorization Code for an Access Token
 */
export const exchangeTikTokCode = async (
  clientKey: string,
  clientSecret: string,
  code: string,
  redirectUri: string
): Promise<string | null> => {
  try {
    const params = new URLSearchParams();
    params.append('client_key', clientKey);
    params.append('client_secret', clientSecret);
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', redirectUri);

    const response = await fetch(`${TIKTOK_API_BASE}/oauth/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      },
      body: params
    });

    const json: TokenResponse = await response.json();

    if (json.error || !json.access_token) {
      console.error("Token Exchange Error:", json.error_description || json.error);
      return null;
    }

    return json.access_token;
  } catch (error) {
    console.error("Failed to exchange token:", error);
    return null;
  }
};

/**
 * Validates an access token and retrieves user info
 */
export const validateTikTokToken = async (accessToken: string): Promise<{ username: string, avatarUrl: string } | null> => {
  try {
    const response = await fetch(`${TIKTOK_API_BASE}/user/info/?fields=display_name,avatar_url`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
        console.error("TikTok API Error:", response.statusText);
        return null;
    }

    const json: TikTokUserResponse = await response.json();
    
    if (json.error && json.error.code !== "ok") {
        console.error("TikTok API Error Body:", json.error);
        return null;
    }

    const user = json.data.user;
    return {
      username: user.display_name,
      avatarUrl: user.avatar_url
    };
  } catch (error) {
    console.error("Failed to connect to TikTok API:", error);
    return null;
  }
};

/**
 * Uploads a video to TikTok using the Direct Post API
 * This requires the 'video.publish' scope.
 */
export const uploadVideoToTikTok = async (
  accessToken: string, 
  file: File, 
  caption: string,
  onProgress: (progress: number) => void
): Promise<boolean> => {
  try {
    // 1. Initialize Upload
    onProgress(10);
    const initResponse = await fetch(`${TIKTOK_API_BASE}/post/publish/video/init/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({
        post_info: {
          title: caption,
          privacy_level: 'SELF_ONLY', // Default to private for safety
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 1000
        },
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: file.size,
          chunk_size: file.size,
          total_chunk_count: 1
        }
      })
    });

    if (!initResponse.ok) throw new Error('Failed to initialize upload');
    const initJson = await initResponse.json();
    const uploadUrl = initJson.data?.upload_url;

    if (!uploadUrl) throw new Error('No upload URL returned from TikTok');

    // 2. Upload Video Binary
    onProgress(30);
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': file.size.toString()
      },
      body: file
    });

    if (!uploadResponse.ok) throw new Error('Failed to upload video binary');
    onProgress(100);
    
    return true;

  } catch (error) {
    console.error("TikTok Upload Error:", error);
    throw error;
  }
};
