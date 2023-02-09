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
  let response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Generate thoughtful gift recommendations for ${recipientRelationShip} on ${ocassion}. Their preferences, hobbies and interests are - ${preferences}. The budget is under ${budget} INR. Consider all this and show a variety of recommendations whether materialistic (e.g. a handbag) or an experience (e.g. a spa session from UC) from platforms that are easily available in India. Be as detailed about the suggestions and platforms as you can with links where necessary and limit them to 5 most accurate ones. Don't mention price explicitly in responses.`,
    max_tokens: 290,
    temperature: 0.7,
  });
  if (response.status === 503) {
    response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Generate thoughtful gift recommendations for ${recipientRelationShip} on ${ocassion}. Their preferences, hobbies and interests are - ${preferences}. The budget is under ${budget} INR. Consider all this and show a variety of recommendations whether materialistic (e.g. a handbag) or an experience (e.g. a spa session from UC) from platforms that are easily available in India. Be as detailed about the suggestions and platforms as you can with links where necessary and limit them to 5 most accurate ones. Don't mention price explicitly in responses.`,
      max_tokens: 290,
      temperature: 0.7,
    });
  }
  if (response.status !== 200) {
    res.status(500).json({ error: "Openai Server Error" });
  }
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
