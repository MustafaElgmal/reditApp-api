import { tagCreate } from "./../types";
import { Router } from "express";
import { Tag } from "../entities/tag";
import { vaildateTag } from "../utils/vaildation";
import { auth } from "../middlewares/auth";
const router = Router();

router.post("/", async (req, res) => {
  const error = await vaildateTag(req.body);
  if (error.error !== "") {
    return res.status(400).json(error);
  }
  try {
    const { title }: tagCreate = req.body;
    const tag = Tag.create({
      title,
    });
    await tag.save();
    res.json({ message: "Tag created!" });
  } catch (e) {
    res.status(500).json({ error: "Server is down!" });
  }
});

router.get("/",auth,async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json({ tags });
  } catch (e) {
    res.status(500).json({ error: "Server is down!" });
  }
});

router.get("/:id",auth, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Tag id is required as paramters!" });
  }
  try {
    const tag = await Tag.findOneBy({ id: +id });
    if (!tag) {
      return res.status(404).json({ error: "Tag not found!" });
    }
    res.json({ tag });
  } catch (e) {
    res.status(500).json({ error: "Server is down!" });
  }
});

router.delete("/:id",auth, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Tag id is required as paramters!" });
  }
  try {
    const tag = await Tag.findOneBy({ id: +id });
    if (!tag) {
      return res.status(404).json({ error: "Tag not found!" });
    }

    await Tag.delete(parseInt(id));
    res.json({ message: "Tag deleted!" });
  } catch (e) {
    res.status(500).json({ error: "Server is down!" });
  }
});

export default router;
