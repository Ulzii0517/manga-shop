import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import app from "./app.js";
import { fileURLToPath } from "url";

// __dirname tohiruulga ESM-d
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App-iin tohirgoog process.env ruu achaallah
dotenv.config({ path: path.join(__dirname, ".env") });

connectDB();

const server = app.listen(process.env.PORT, () =>
  console.log(`Express сэрвэр ${process.env.PORT} порт дээр аслаа... `),
);

// Unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа : ${err.message}`);
  server.close(() => process.exit(1));
});
