declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DB_URL: string;
      GUILD_ID: string;
      DISCORD_TOKEN: string;
      JWT_SECRET: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
