const express = require("express");
const bodyParser = require("body-parser");
const { response } = require("express");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");

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

database.select("*").from("users");

app.get("/", (req, res) => {
  res.send("this is working.");
});

app.post("/signin", async (req, res) => {
  let { email, password } = req.body;

  try {
    const credentials = await database
      .select("email", "hash")
      .from("login")
      .where({ email });

    console.log(credentials[0]);
    const passwordsMatch = bcrypt.compareSync(password, credentials[0].hash);
    console.log(passwordsMatch);
    if (passwordsMatch) {
      const users = await database.select("*").from("users").where({ email });
      res.json([users[0]]);
    } else {
      res.status(400).json("invalid login");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json("invalid login");
  }
});

app.get("/profile/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const users = await database.select("*").from("users").where({ id });
    if (users.length) {
      res.json(users[0]);
    } else {
      res.status(400).json("User not found for id.");
    }
  } catch (error) {
    res.status(404).json("Error getting user.");
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);

  database.transaction(async (trx) => {
    try {
      const loginEmail = await trx
        .insert({ hash: hash, email: email.toLowerCase() })
        .into("login")
        .returning("email");

      const user = await trx("users").returning("*").insert({
        email: loginEmail[0].email,
        name: name.toLowerCase(),
        joined: new Date(),
      });

      await trx.commit();
      res.json(user[0]);
    } catch (error) {
      trx.rollback();
      res.status(400).json(`Unable to register.`);
    }
  });
});

app.put("/image", async (req, res) => {
  const { id } = req.body;

  const entries = await database("users").where({ id }).increment("entries", 1);

  try {
    if (entries) {
      res.json("success");
    } else {
      res.status(404).json("User not found.");
    }
  } catch (error) {
    res.status(404).json("Error updating entries.");
  }
});

app.listen(3030, () => {
  console.log(`app is running on port 3030`);
});
