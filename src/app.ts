import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { checkDbConnection } from "./config/database.js";
import { createShortUrlHandler, redirectHandler } from "./module/url/url.controller.js";
import { dot } from "node:test/reporters";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.post("/api/v1/urls", createShortUrlHandler);
app.get("/:shortKey", redirectHandler);

// Start Server
app.listen(PORT, async () => {
    console.log(`=================================`);                         
    console.log(`🚀 Server running on port ${PORT}`);                         
    console.log(`=================================`);                         
    await checkDbConnection(); 
});