import express from "express";
import path from "path";
import rfs from "rotating-file-stream";
import morgan from "morgan";
import errorHandler from "./middleware/error.js";
import logger from "./middleware/logger.js";
import fileUpload from "express-fileupload";
import categoriesRoutes from "./routes/categories.js";
import booksRoutes from "./routes/books.js";
import usersRoutes from "./routes/users.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import ordersRoutes from "./routes/orders.js";
import wishlistRoutes from "./routes/wishlist.js";
import reviewRoutes from "./routes/reviews.js";
import { fileURLToPath } from "url";

// __dirname tohiruulga ESM-d
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);
app.use(logger);

if (process.env.NODE_ENV !== "test") {
  const accessLogStream = rfs.createStream("access.log", {
    interval: "1d", // udur tutam rotate hiih
    path: path.join(__dirname, "log"),
  });
  app.use(morgan("combined", { stream: accessLogStream }));
}

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
  }),
);

app.get("/", (req, res) => {
  res.send("API is running... ");
});

app.use("/uploads", express.static(path.join(__dirname, "public/upload")));

app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/orders", ordersRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.use(errorHandler);

export default app;
