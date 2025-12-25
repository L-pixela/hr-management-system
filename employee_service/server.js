import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDB } from "./src/configs/db.config.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Employee Service running on port ${PORT}`);
});
