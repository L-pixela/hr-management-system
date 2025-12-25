const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use("/auth", authRoutes);

app.use("/test", testRoutes);

// Health check endpoint
app.get("/health", (req, res) => res.status(200).json({ status: "ok", service: "auth-service" }));

module.exports = app;
