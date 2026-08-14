import express from "express";
import dotenv from "dotenv";
import path from "path";
import rfs from "rotating-file-stream";
import morgan from "morgan";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/error.js";
import logger from "./middleware/logger.js";
import fileUpload from "express-fileupload";
import categoriesRoutes from "./routes/categories.js";
import booksRoutes from "./routes/books.js";
import usersRoutes from "./routes/users.js";

// __dirname tohiruulga ESM-d
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import cors from "cors";
// App-iin tohirgoog process.env ruu achaallah
dotenv.config({ path: path.join(__dirname, ".env") });

import cookieParser from "cookie-parser";
import ordersRoutes from "./routes/orders.js";
import wishlistRoutes from "./routes/wishlist.js";
import reviewRoutes from "./routes/reviews.js";

const app = express();

connectDB();
//body dahi ugugdliig json bolgon
app.use(express.json());
//cookie bval req.cookie ruu oruulj ugnu
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
    credentials: true, //busad cookie-r irj bga medeellig huleej avah
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);
app.use(logger);

// create a write stream (in append mode)
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // udur tutam rotate hiih
  path: path.join(__dirname, "log"),
});

// Body parser
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true, //havtas bhgui bl automataar uusne
  }),
);

app.use(morgan("combined", { stream: accessLogStream }));

// server.js dr routes-s umnu nemeh
app.use((req, res, next) => {
  next();
});

app.get("/", (req, res) => {
  res.send("API is running... ");
});
//zurag
app.use("/uploads", express.static(path.join(__dirname, "public/upload")));

// Routes, categories,books,users gd rhlrh l ym bol hoino bga fn ni hariutsna
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/orders", ordersRoutes);
// app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/reviews", reviewRoutes);
// Error handler
app.use(errorHandler);

const server = app.listen(process.env.PORT, () =>
  console.log(`Express сэрвэр ${process.env.PORT} порт дээр аслаа... `),
);

// Unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа : ${err.message}`);
  server.close(() => process.exit(1));
});
