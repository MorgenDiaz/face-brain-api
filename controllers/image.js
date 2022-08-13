export const handleImage = async (req, res, database) => {
  const { id } = req.body;

  const entries = await database("users")
    .returning("entries")
    .where({ id })
    .increment("entries", 1);

  try {
    if (entries[0].entries) {
      res.json(entries[0].entries);
    } else {
      res.status(404).json("User not found.");
    }
  } catch (error) {
    res.status(404).json("Error updating entries.");
  }
};
