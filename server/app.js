import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//   })
// );

app.use(cors());

// app.all("/*", function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
//   res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
//   return next();
// });

// inbuilt middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";
import boardRouter from "./routes/board.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);

app.use("/", boardRouter);

export default app;
