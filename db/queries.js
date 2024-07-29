// db/queries.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // e.g., postgres://username:password@hostname:port/database
    },
  },
});

export async function getAllRecipes(userId) {
  return await prisma.recipe.findMany({
    where: {
      created_by: userId,
    },
    orderBy: [
      {
        updated_at: {
          // This will ensure that non-null `updated_at` values come first
          sort: "desc",
          nulls: "last",
        },
      },
      {
        created_at: "desc",
      },
    ],
  });
}

export async function getRecipeById(recipeId, userId) {
  return await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      created_by: userId,
    },
  });
}

export async function insertRecipe(recipe) {
  const {
    name,
    servings,
    prep_time,
    cook_time,
    ingredients,
    method,
    notes,
    description,
    category,
    tag,
    source,
    imageUrl,
    created_by,
  } = recipe;
  return await prisma.recipe.create({
    data: {
      name,
      servings,
      prep_time,
      cook_time,
      ingredients,
      method,
      notes,
      description,
      category,
      tag,
      source,
      imageUrl,
      created_by,
    },
  });
}

export async function updateRecipe(recipeId, recipe, userId) {
  const {
    name,
    servings,
    prep_time,
    cook_time,
    ingredients,
    method,
    notes,
    description,
    category,
    tag,
    source,
    imageUrl,
  } = recipe;
  return await prisma.recipe.update({
    where: {
      id: recipeId,
      created_by: userId,
    },
    data: {
      name,
      servings,
      prep_time,
      cook_time,
      ingredients,
      method,
      notes,
      description,
      category,
      tag,
      source,
      imageUrl,
      updated_at: new Date(),
      updated_by: userId,
    },
  });
}

export async function deleteRecipe(recipeId, userId) {
  return await prisma.recipe.deleteMany({
    where: {
      id: recipeId,
      created_by: userId,
    },
  });
}
