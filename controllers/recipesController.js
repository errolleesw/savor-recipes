// controllers/recipesController.js
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { marked } from "marked"; // Import the marked library

import links from "../data/links.js";
import upload from "../middleware/upload.js";

import {
  getAllRecipes,
  getRecipeById,
  insertRecipe,
  updateRecipe,
  deleteRecipe,
} from "../db/queries.js";

const validateRecipe = [
  // body("name").isAlpha().withMessage("Recipe name must only contain letters."),
];

export const recipesListGet = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).send("User not authenticated");
  }
  const recipes = await getAllRecipes(req.user.id);
  res.render("recipes", {
    title: "Recipes List",
    links: links,
    recipes: recipes,
  });
});

export const recipesCreateGet = asyncHandler(async (req, res) => {
  res.render("recipeCreate", {
    title: "Create a recipe",
    links: links,
    errors: [],
  });
});

export const recipesCreatePost = [
  upload.single("image"),
  validateRecipe,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("recipeCreate", {
        title: "Create a recipe",
        about: "Recipe Errors",
        links: links,
        errors: errors.array(),
      });
    }
    const {
      name,
      servings,
      preptime,
      cooktime,
      ingredients,
      method,
      notes,
      description,
      category,
      tag,
      source,
    } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    await insertRecipe({
      name,
      servings: servings === "" ? null : parseInt(servings, 10),
      prep_time: preptime === "" ? null : parseInt(preptime, 10),
      cook_time: cooktime === "" ? null : parseInt(cooktime, 10),
      ingredients,
      method,
      notes,
      description,
      category,
      tag,
      source,
      imageUrl,
      created_by: req.user.id,
    });
    res.redirect("/recipes");
  }),
];

export const recipeDetailGet = asyncHandler(async (req, res) => {
  const recipeId = parseInt(req.params.recipeId, 10);
  const recipe = await getRecipeById(recipeId, req.user.id);
  if (!recipe) {
    res.status(404).send("Recipe not found");
    return;
  }
  // Convert markdown to HTML
  const ingredientsHtml = marked(recipe.ingredients);
  const methodHtml = marked(recipe.method);
  res.render("recipeDetail", {
    title: `Recipe: ${recipe.name}`,
    links: links,
    recipe: recipe,
    ingredientsHtml: ingredientsHtml,
    methodHtml: methodHtml,
  });
});

export const recipeEditGet = asyncHandler(async (req, res) => {
  const recipeId = parseInt(req.params.recipeId, 10);
  const recipe = await getRecipeById(recipeId, req.user.id);
  if (!recipe) {
    res.status(404).send("Recipe not found");
    return;
  }
  res.render("recipeEdit", {
    title: `Edit Recipe: ${recipe.name}`,
    links: links,
    recipe: recipe,
    errors: [], // Pass an empty errors array
  });
});

export const recipeEditPost = [
  upload.single("image"),
  validateRecipe,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const recipeId = parseInt(req.params.recipeId, 10);
      const recipe = await getRecipeById(recipeId, req.user.id);
      return res.status(400).render("recipeEdit", {
        title: `Edit Recipe: ${recipe.name}`,
        links: links,
        errors: errors.array(),
        recipe: recipe,
      });
    }
    const recipeId = parseInt(req.params.recipeId, 10);
    const {
      name,
      servings,
      preptime,
      cooktime,
      ingredients,
      method,
      notes,
      description,
      category,
      tag,
      source,
    } = req.body;

    // Prepare data for update
    const updateData = {
      name,
      servings: servings === "" ? null : parseInt(servings, 10),
      prep_time: preptime === "" ? null : parseInt(preptime, 10),
      cook_time: cooktime === "" ? null : parseInt(cooktime, 10),
      ingredients,
      method,
      notes,
      description,
      category,
      tag,
      source,
      updated_by: req.user.id,
    };

    // If an image is uploaded, add the image URL to the update data
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    // Perform the update
    await updateRecipe(recipeId, updateData, req.user.id);
    res.redirect(`/recipes/${recipeId}`);
  }),
];

export const recipeDeletePost = asyncHandler(async (req, res) => {
  const recipeId = parseInt(req.params.recipeId, 10);
  await deleteRecipe(recipeId, req.user.id);
  res.redirect("/recipes");
});
