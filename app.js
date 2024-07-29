// app.js

// import from external modules
import createError from "http-errors";
import express, { json, urlencoded } from "express";
import session from "express-session";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { static as serveStatic } from "express"; // renamed static to serveStatic to avoid conflict

// import from internal modules
import passport from "./config/passport.js";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import recipesRouter from "./routes/recipes.js";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// view engine setup
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

// user authentication set up
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// set currentUser to be stored as a local variable so it can be access throughout the entire app with the locals object.
// with this, we now have access to the "currentUser" variable in all of our views.
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(logger("dev"));
// Middleware to parse JSON bodies
app.use(express.json());
app.use(json());
app.use(urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies (e.g., from form submissions)
app.use(cookieParser());
app.use(serveStatic(join(__dirname, "public"))); // Set static file directory.

// ROUTES
app.use("/", indexRouter);
app.use("/", usersRouter);
app.use("/recipes", recipesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
