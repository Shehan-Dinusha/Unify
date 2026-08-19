import "dotenv/config";
import { createServer } from "http";
import app from "./app.js";
import logger from "./utils/logger.js";
import { sequelize } from "./modules/index.js"; // Registers all models + associations
import { startOtpCleanupJob } from "./jobs/otpCleanup.job.js";
import { startConversationCleanupJob } from "./jobs/conversationCleanup.job.js";
import { initializeSocket } from "./socket/index.js";

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const startServer = async () => {
  try {
    // 1. Verify DB connectivity
    await sequelize.authenticate();
    logger.info("✅ Database connection established successfully.");

    // 2. Start background jobs
    startOtpCleanupJob();
    startConversationCleanupJob();

    // 3. Create HTTP server and attach Socket.IO
    const httpServer = createServer(app);
    httpServer.timeout = 300000; // 5 minutes for large file uploads
    initializeSocket(httpServer);

    // 4. Start HTTP + WebSocket server
    httpServer.listen(PORT, () => {
      logger.info(`🚀 Server running in [${NODE_ENV}] mode on port ${PORT}`);
      logger.info(`🔌 Socket.IO listening on ws://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Unable to start server:", error);
    process.exit(1);
  }
};

startServer();
