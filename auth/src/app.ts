import express from "express";
import authRouter from "./routes/auth.routes";
import { errorHandler } from "./common/middlewares/errorHandler";
import { NotFoundError } from "./common/errors/notFoundError";

import cookieSession from "cookie-session";

const app = express();
// this makes express that it's behind a proxy (ingress-nginx)
// and it should trust traffic as being secure
app.set("trust-proxy", true);

// Parse JSON bodies
app.use(express.json({ limit: "10kb" }));
// Parse URL-encoded bodies
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

// api routes
app.use("/api/users", authRouter);

// this watch for request kind of method and route
app.all("*", () => {
  throw new NotFoundError();
});

// error handler
app.use(errorHandler);

export { app };
