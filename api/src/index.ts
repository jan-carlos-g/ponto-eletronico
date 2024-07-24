import "reflect-metadata";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import routes from "./routes/index";
import "./utils/conteiner";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

routes(app);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
