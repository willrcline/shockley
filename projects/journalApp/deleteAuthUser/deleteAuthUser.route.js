const express = require("express");
const router = express.Router();
const { deleteAuthUser } = require("./deleteAuthUser.controller");

router.delete("/", async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res
      .status(400)
      .send({ error: "Email query parameter is required." });
  }

  try {
    const responseObj = await deleteAuthUser(email);
    if (responseObj) {
      res.status(200).send({ message: "User deleted successfully." });
    } else {
      res.status(404).send({ error: "User not found or deletion failed." });
    }
  } catch (error) {
    console.error("deleteAuthUser.route error___", error);
    res.status(500).send({ error: "Unexpected error processing request." });
  }
});

module.exports = router;
