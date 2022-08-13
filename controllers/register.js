export const handleRegister = async (req, res, database, bcrypt) => {
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
};
