export const handleProfile = async (req, res, database) => {
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
};
