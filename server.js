import "dotenv/config";
import express from "express";
import morgan from "morgan";
import authorRouter from "./routes/author.route.js";
import quotesRouter from "./routes/quote.route.js";
import authRouter from "./routes/auth.route.js";

const app = express();

const PORT = process.env.PORT || 3000;
app.use(morgan("dev"));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRouter);
app.use("/api/authors", authorRouter);
app.use("/api/quotes", quotesRouter);

// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

export default app;
