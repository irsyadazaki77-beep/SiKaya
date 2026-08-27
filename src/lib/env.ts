/**
 * Environment configuration and startup validation module.
 */

export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  GEMINI_API_KEY?: string;
  FIREBASE_PROJECT_ID?: string;
  APP_URL?: string;
}

export function validateEnvironment(): EnvConfig {
  const isProduction = process.env.NODE_ENV === 'production';
  const nodeEnv = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';
  const port = parseInt(process.env.PORT || '3000', 10);

  if (isNaN(port) || port <= 0 || port > 65535) {
    throw new Error(`[Env Config Error] PORT must be a valid port number, received: "${process.env.PORT}"`);
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Check Gemini API Key
  const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
  if (!geminiApiKey) {
    if (isProduction) {
      errors.push("GEMINI_API_KEY is required in production for AI Advisor features.");
    } else {
      warnings.push("GEMINI_API_KEY is not set. /api/chat calls will fail until configured.");
    }
  }

  // Check Firebase configuration
  let firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
  try {
    // Check if firebase-applet-config exists
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require('../../firebase-applet-config.json');
    if (config?.projectId) {
      firebaseProjectId = config.projectId;
    }
  } catch {
    // Config file might not be present or required in some environments
  }

  if (!firebaseProjectId && isProduction) {
    errors.push("Firebase configuration is missing projectId. Ensure firebase-applet-config.json or FIREBASE_PROJECT_ID is provided.");
  }

  // Output startup diagnostics
  console.log("==========================================");
  console.log(`🚀 SiKaya Backend Initializing`);
  console.log(`   - Environment: ${nodeEnv}`);
  console.log(`   - Port: ${port}`);
  console.log(`   - Gemini API Key: ${geminiApiKey ? "Configured (Protected)" : "Missing"}`);
  console.log(`   - Firebase Project: ${firebaseProjectId || "Unspecified"}`);
  console.log("==========================================");

  if (warnings.length > 0) {
    warnings.forEach(w => console.warn(`⚠️ [Env Warning] ${w}`));
  }

  if (errors.length > 0) {
    console.error("❌ CRITICAL: Server startup failed due to missing required environment configuration:");
    errors.forEach(e => console.error(`   • ${e}`));
    if (isProduction) {
      throw new Error(`Startup failed: ${errors.join('; ')}`);
    }
  }

  return {
    NODE_ENV: nodeEnv,
    PORT: port,
    GEMINI_API_KEY: geminiApiKey,
    FIREBASE_PROJECT_ID: firebaseProjectId,
    APP_URL: process.env.APP_URL,
  };
}
