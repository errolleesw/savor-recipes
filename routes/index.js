import { Router } from 'express';
import links from "../data/links.js";

const indexRouter = Router();

const about = "This is a recipe management app.";

indexRouter.get("/", (req, res) => {
  res.render("index", { title: "Savor", links: links, about: about });
});

indexRouter.get("/settings", (req, res) =>
  res.send("TBD - SETTINGS")
);

indexRouter.get("/ingredients", (req, res) =>
  res.send("TBD - ingredients database")
);

indexRouter.get("/mealplan", (req, res) =>
  res.send("TBD - meal planning features")
);

export default indexRouter;

