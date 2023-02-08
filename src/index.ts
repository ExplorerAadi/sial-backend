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
  const { ocassion, preferences, recipientRelationShip, budget } = req.query;
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Help in special gift recommendation for ${ocassion} for ${recipientRelationShip}. Their preferences include ${preferences}. The budget is ${budget} INR. Recommend India specific options and platforms to get them along with some products or services from those platforms. Overall be as detailed and specific about the suggestions as you can and limit them to 5 most accurate ones.`,
    max_tokens: 290,
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
