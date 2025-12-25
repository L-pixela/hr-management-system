require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Auth service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
})();
