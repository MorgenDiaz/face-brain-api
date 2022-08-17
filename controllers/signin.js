export const handleSignin = async (req, res, database, bcrypt) => {
  let { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json("invalid login");
    return;
  }

  try {
    const credentials = await database
      .select("email", "hash")
      .from("login")
      .where({ email });

    const passwordsMatch = bcrypt.compareSync(password, credentials[0].hash);

    if (passwordsMatch) {
      const users = await database.select("*").from("users").where({ email });
      res.json(users[0]);
    } else {
      res.status(400).json("invalid login");
    }
  } catch (error) {
    res.status(400).json("invalid login");
  }
};
