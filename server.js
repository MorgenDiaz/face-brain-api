import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt-nodejs";
import knex from "knex";
import { handleRegister } from "./controllers/register.js";
import { handleSignin } from "./controllers/signin.js";
import { handleProfile } from "./controllers/profile.js";
import { handleImage, handleFaceDetect } from "./controllers/image.js";

const database = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "",
    password: "",
    database: "face-brain",
  },
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

database.select("*").from("users");

app.get("/", (req, res) => {
  res.send("this is working.");
});

app.post("/signin", (req, res) => {
  handleSignin(req, res, database, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  handleProfile(req, res, database);
});

app.post("/register", (req, res) => {
  handleRegister(req, res, database, bcrypt);
});

app.post("/imagefacedetect", (req, res) => {
  handleFaceDetect(req, res);
});

app.put("/image", (req, res) => {
  handleImage(req, res, database);
});

app.listen(3030, () => {
  console.log(`app is running on port 3030`);
});
