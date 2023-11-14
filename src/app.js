import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
    origin: "*"
}));

app.use('/api', authRoutes);

export default app;