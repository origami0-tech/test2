
export enum ContentStep {
  IDEATION = 'IDEATION',
  SCRIPTING = 'SCRIPTING',
  METADATA = 'METADATA',
  THUMBNAIL = 'THUMBNAIL',
  UPLOAD = 'UPLOAD'
}

export interface VideoIdea {
  id: string;
  hook: string;
  angle: string;
}

export interface TikTokAccount {
  id: string;
  username: string;
  avatarColor: string; // Hex code for avatar background
  accessToken?: string; // Optional: Real API Access Token
}

export interface GeneratedContent {
  ideas: VideoIdea[];
  selectedIdea: VideoIdea | null;
  script: string;
  caption: string;
  hashtags: string[];
  thumbnailUrl: string | null;
  targetAccountId?: string;
  scheduledTime?: string | null;
}

export interface ScheduledPost {
  id: string;
  accountId: string;
  accountUsername: string;
  accountAvatar: string;
  caption: string;
  thumbnailUrl: string | null;
  scheduledTime: string;
  status: 'SCHEDULED' | 'PUBLISHED';
}

export interface GeminiError {
  message: string;
}
