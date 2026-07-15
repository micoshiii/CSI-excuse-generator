import express from "express";
import cors from "cors";
import "dotenv/config";
import excuseRoutes from "./routes/excuse.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", excuseRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});