import { Router } from "express";
import { getBoardById, createGroup } from "../controllers/board.controller.js";
import { getChartById, createChart } from "../controllers/chart.controller.js";
import {
  getIdeaById,
  createIdea,
  updateIdea,
} from "../controllers/idea.controller.js";
import { getLinkById, createLink } from "../controllers/link.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { refreshAccessToken } from "../controllers/user.controller.js";

const router = Router();

// ***************************** Link Routes *****************************
router.route("/createlink").post(verifyJWT, createLink);
// get link if you have _id
router.route("/:_id").get(verifyJWT, getLinkById);

// ***************************** Board Routes *****************************
// add board
router.route("/:linkId/createboard").post(
  verifyJWT,
  upload.fields([
    {
      name: "title",
    },
  ]),
  createGroup
);
// get board (all charts)
router.route("/:linkId/board/:_id").get(verifyJWT, getBoardById);

// ***************************** Chart Routes *****************************
// add chart
router.route("/:linkId/board/:boardId/createchart").post(
  verifyJWT,
  upload.fields([
    {
      name: "title",
    },
    {
      name: "description",
    },
  ]),
  createChart
);

// fetch chart (all ideas)
router
  .route("/:linkId/board/:boardId/charts/:_id")
  .get(verifyJWT, getChartById);

// ***************************** Idea Routes *****************************
// add idea
router.route("/:linkId/board/:boardId/charts/:chartId/createidea").post(
  verifyJWT,
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
  ]),
  createIdea
);

// fetch idea
router
  .route("/:linkId/board/:boardId/charts/:chartId/idea/:_id")
  .get(verifyJWT, getIdeaById);

// update idea
router
  .route("/:linkId/board/:boardId/charts/:chartId/idea/:ideaId/updateidea")
  .put(verifyJWT, updateIdea);


  
export default router;
