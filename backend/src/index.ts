import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import adminRoutes from "./routes/admin.route";
import userRoutes from "./routes/user.route";
import teamRoutes from "./routes/team.route";
import noticeRoutes from "./routes/notice.route";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import type { CorsOptions } from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

const whitelist = [
  "http://localhost:3000",
  "https://teabag.co.in",
  "https://www.teabag.co.in",
];

const corsOptions: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/notices", noticeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
