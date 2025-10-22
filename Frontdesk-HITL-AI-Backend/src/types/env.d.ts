declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    MONGO_URI: string;
    LIVEKIT_API_KEY: string;
    LIVEKIT_API_SECRET: string;
    LIVEKIT_URL: string;
    HELP_REQUEST_TIMEOUT_MINUTES?: string;
  }
}
