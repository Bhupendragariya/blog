const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog.js");
const Comment = require("../models/comment.js");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const uploads = multer({ storage });

router.get("/add-new", (req, res) => {
  res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");

    const comments = await Comment.find({ blogId: req.params.id }).populate(
      "createdBy"
    );

    return res.render("blog", {
      user: req.user,
      blog,
      comments,
    });
  } catch (error) {
    console.error("Error fetching blog or comments:", error);
    res.status(500).send("Error loading blog and comments.");
  }
});

router.post("/delete/:id", async (req, res) => {
  try {
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).send("Blog not found.");
    }


    if (blog.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).send("Unauthorized.");
    }

    await Blog.findByIdAndDelete(blogId);
    await Comment.deleteMany({ blogId }); 

    res.redirect("/");
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).send("Failed to delete blog.");
  }
});



router.get('/edit/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send('Blog not found');

    
    if (blog.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).send('Unauthorized');
    }

    res.render('edit', { blog, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading edit form');
  }
});


router.post('/edit/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send('Blog not found');

    if (blog.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).send('Unauthorized');
    }

    blog.title = req.body.title;
    blog.body = req.body.content;
    await blog.save();

    res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating blog');
  }
});





router.post("/comment/:blogId", async (req, res) => {
  try {
    const rawBlogId = req.params.blogId;
    const blogId = rawBlogId.trim();

    await Comment.create({
      content: req.body.content,
      blogId: blogId,
      createdBy: req.user._id,
    });

    return res.redirect(`/blog/${blogId}`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error posting comment.");
  }
});

router.post("/", uploads.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;

  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });

  //   return res.redirect(`/blog/${blog._id}`);

  return res.redirect("/");
});

module.exports = router;
