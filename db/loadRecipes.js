// loadRecipes.js

import fs from "fs";
import csvParser from "csv-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function loadRecipes() {
  const recipes = [];

  // Read and parse the CSV file
  fs.createReadStream("./data/recipes.csv")
    .pipe(csvParser())
    .on("data", (row) => {
      recipes.push({
        name: row.name,
        description: row.description,
        servings: row.servings ? parseInt(row.servings, 10) : null,
        prep_time: row.prep_time ? parseInt(row.prep_time, 10) : null,
        cook_time: row.cook_time ? parseInt(row.cook_time, 10) : null,
        ingredients: row.ingredients.replace(/\\n/g, "\n"), // used to replace literal \n strings with actual newline characters
        method: row.method.replace(/\\n/g, "\n"),
        notes: row.notes,
        created_by: parseInt(row.created_by, 10),
        updated_at: row.updated_at ? new Date(row.updated_at) : null,
        updated_by: row.updated_by ? parseInt(row.updated_by, 10) : null,
        category: row.category || null,
        tag: row.tag || null,
        source: row.source || null,
      });
    })
    .on("end", async () => {
      console.log("CSV file successfully processed");

      // Delete all existing rows in the recipes table
      await prisma.recipe.deleteMany({});
      console.log("Existing recipes deleted");

      // Insert the data into the recipes table
      for (const recipe of recipes) {
        await prisma.recipe.create({
          data: {
            name: recipe.name,
            description: recipe.description,
            servings: recipe.servings,
            prep_time: recipe.prep_time,
            cook_time: recipe.cook_time,
            ingredients: recipe.ingredients,
            method: recipe.method,
            notes: recipe.notes,
            createdBy: {
              connect: { id: recipe.created_by },
            },
            updated_at: recipe.updated_at,
            updatedBy: recipe.updated_by
              ? { connect: { id: recipe.updated_by } }
              : undefined,
            category: recipe.category,
            tag: recipe.tag,
            source: recipe.source,
          },
        });
      }

      console.log("Data successfully loaded into the recipes table");
      await prisma.$disconnect();
    });
}

loadRecipes().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
