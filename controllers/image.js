import Clarifai from "clarifai";

const app = new Clarifai.App({
  apiKey: "f460d892804d402faca1e6798679e4f1",
});

export const handleFaceDetect = async (req, res) => {
  try {
    const response = await app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      req.body.input
    );
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json("Error detecting face.");
  }
};

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
