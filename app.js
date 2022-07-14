import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./src/router/index.js";
import errorMiddleware from "./src/middlewares/error-middleware.js";
import bodyParser from "body-parser";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json({limit: '150mb', extended: true}))
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));
app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
  try {
    app.listen(PORT, async () => {
      console.log(`Server started on PORT = ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
