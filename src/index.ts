import dotenv from "dotenv";
dotenv.config();
import { Configuration, OpenAIApi } from "openai";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";

const handler = async (req: Request, res: Response, next: NextFunction) => {
  const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const { prompt } = req.query;
  const response = await openai.createCompletion({
    model: "text-curie-001",
    prompt: `Help in special gift recommendation. Ask questions about the occasion then the receiver's hobbies, interests, likes and dislikes and then the location that they are in one by one and then give specific ideas and suggestions and ask them to choose an option. Once they do then give more ideas and suggestions related to that selected option. If they belong to India then recommend these sites for personalised gifts - OyeHappy, Archies India.\n${prompt}`,
    max_tokens: 200,
    temperature: 0.7,
  });
  res.send(response.data);
};

const app: Express = express();
const router = express.Router();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use("/search", router.get("/", handler));

app.listen(port, () => {
  console.info(`⚡️[server]: Server is running at ${port}`);
});
