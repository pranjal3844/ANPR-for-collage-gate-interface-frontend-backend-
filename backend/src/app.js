import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
// app.get("/api/v1/health", (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "BTP Backend is running",
//     });
// });
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes


app.use("/api/v1/auth", authRoutes);

app.use(errorMiddleware);

export { app }