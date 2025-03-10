import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import articleRoutes from "./routes/articleRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productSalesRoutes from "./routes/productSalesRoutes.js";
import productShareRoutes from "./routes/productShareRoutes.js";
import productSwapRoutes from "./routes/productSwapRoutes.js";
import profileUserRoutes from "./routes/profileUserRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();
const app = express();
const __dirname = path.resolve();

// Configure CORS with specific options
const corsOptions = {
  origin: "*", // Add your frontend URLs
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true, // Allow cookies if using sessions/credentials
  maxAge: 86400, // CORS preflight request cache time (in seconds)
};

app.use(cors(corsOptions));
app.use(express.json());

// dev
app.use("/src/uploads", express.static(path.join(__dirname, "src/uploads")));

// Routes
app.use("/api/articles", articleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/product-sales", productSalesRoutes);
app.use("/api/product-share", productShareRoutes);
app.use("/api/product-swap", productSwapRoutes);
app.use("/api/profile-user", profileUserRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tanya-ai", aiRoutes);
app.use("/api/transactions", transactionRoutes);

// Handle OPTIONS requests explicitly
app.options("*", cors(corsOptions));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
