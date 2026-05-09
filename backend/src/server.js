import "dotenv/config";
import { createServer } from "http";
import app from "./app.js";
import logger from "./utils/logger.js";
import { sequelize } from "./modules/index.js"; // Registers all models + associations
import { startOtpCleanupJob } from "./jobs/otpCleanup.job.js";
import { initializeSocket } from "./socket/index.js";

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const startServer = async () => {
  try {
    // 1. Verify DB connectivity
    await sequelize.authenticate();
    logger.info("✅ Database connection established successfully.");

    // 2. Sync schema
    //    - Development / Docker:  alter:true  → adds new columns / tables without dropping data
    //    - Production:            use migrations instead (never auto-sync in prod)
    if (NODE_ENV !== "production") {
      await sequelize.sync({ alter: true });
      logger.info("✅ Database schema synced (alter: true).");
    } else {
      // In production, tables must already exist via proper migrations.
      // Uncomment the line below only if you intentionally want a one-time sync in prod:
      // await sequelize.sync();
      logger.info(
        "ℹ️  Production mode — skipping auto-sync. Run migrations manually.",
      );
    }

    // 3. Start background jobs
    startOtpCleanupJob();

    // 4. Create HTTP server and attach Socket.IO
    const httpServer = createServer(app);
    initializeSocket(httpServer);

    // 5. Start HTTP + WebSocket server
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
