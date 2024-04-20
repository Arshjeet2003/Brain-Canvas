// import and config .env as early as possible
import dotenv from "dotenv";
const port = process.env.PORT || 8000;

import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({ path: "./.env" });

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
});

const jsonFile = [
  {
    _id: "6614f933522edea1ff1fa7db",
    index: 0,
    guid: "1d0815fb-f517-4c43-8f79-18cabdcbf455",
    isActive: true,
  },
  {
    _id: "6614f93335564b3361a993ef",
    index: 1,
    guid: "7e1fa61d-f4ea-44d6-b5b2-2fb099b55522",
    isActive: true,
  },

  {
    _id: "6614f933de8d7565b911be06",
    index: 2,
    guid: "a8fb7685-44d1-4646-be98-f5e89c51e597",
    isActive: true,
  },
  {
    _id: "6614f933ca0335350ad1573e",
    index: 3,
    guid: "2f254cae-cbb2-4b88-aee7-4d44b53df010",
    isActive: true,
  },
  {
    _id: "6614f933b807b86639f89bbe",
    index: 4,
    guid: "9eaf557b-07e3-40b0-b2bf-349d10571e1b",
    isActive: false,
  },
  {
    _id: "6614f93326df4b13c5401d7b",
    index: 5,
    guid: "d54dcc42-7be9-4064-b86c-696316c46060",
    isActive: false,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>HELO<h1>");
});

app.get("/api/login", (req, res) => {
  res.send(jsonFile);
});
