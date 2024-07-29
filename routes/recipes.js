// routes/recipes.js

import { Router } from "express";
import {
  recipesListGet,
  recipesCreateGet,
  recipesCreatePost,
  recipeDetailGet,
  recipeEditGet,
  recipeEditPost,
  recipeDeletePost,
} from "../controllers/recipesController.js";

const recipesRouter = Router();

recipesRouter.get("/", recipesListGet);

recipesRouter.get("/create", recipesCreateGet);
recipesRouter.post("/create", recipesCreatePost);

recipesRouter.get("/:recipeId", recipeDetailGet);

recipesRouter.get("/:recipeId/edit", recipeEditGet);
recipesRouter.post("/:recipeId/edit", recipeEditPost);

recipesRouter.post("/:recipeId/delete", recipeDeletePost);

export default recipesRouter;
