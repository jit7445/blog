
 // Import necessary modules and models
const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const router = Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads`));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage });

// Route to render all blog posts of a specific user
router.get('/', async (req, res) => {
    try {
        // Find all blog posts created by the authenticated user
        const blog = await Blog.findById(req.params.id).populate("createdBy");
        const userBlogs = await Blog.find({ }).populate("createdBy");
      //all bloges
      const blogs=await Blog.find({})
        // Render the page with the user's blog posts
        return res.render("blog", {
          user:req.user,
            blogs:userBlogs
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});
router.get('/newblog',(req,res)=>{
    return res.render("newblog")
 })
 router.get("/:id", async (req, res) => {
  //find user by blog id and all comment of blog
  
    const blog= await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate(
      "createdBy"
    );
    return res.render("view", {
        user: req.user,
        blog,
        comments,
      });
 })
// Other routes remain unchanged...
router.post("/comment/:blogId", async (req, res) => {
  const { content } = req.body;
  const blogId = req.params.blogId;

  if (content !== '') {
    await Comment.create({
      content: content,
      blogId: blogId,
      createdBy: req.user._id,
    });

    console.log("Comment:", content);
    console.log("CreatedBy:", req.user._id);
    console.log("Current:", req.body);

    return res.redirect(`/blog/${blogId}`);
  } else {
    return res.redirect(`/blog/${blogId}`);
  }
});


 router.post("/post", upload.single("coverImage"), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
      body,
      title,
      createdBy: req.user._id,
      coverImageURL: `/uploads/${req.file.filename}`,
    });
    console.log("blog:",blog)
    return res.redirect('blog');
  });
  router.post("/delete/", async (req, res) => {
    try {
      console.log("current user:", req.user._id);
  
      const comments = await Comment.find({}).populate("createdBy");
  
      // Assuming your array of comments is named 'comments'
      const commentToDelete = comments.find(
        (comment) => comment.createdBy._id.toString() === req.user._id.toString()
      );
  console.log("comment id:",commentToDelete)
      if (commentToDelete) {
        // Delete the comment found
        await Comment.deleteOne({
          _id: commentToDelete._id,
          createdBy: req.user._id,
        });
        console.log("blog id:", `/blog/${commentToDelete.blogId.toString()}`);
  
return res.redirect(`/blog/${commentToDelete.blogId.toString()}`);

      } else {
        return res
          .status(404)
          .json({ status: "Comment not found or unauthorized to delete" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: "Internal Server Error" });
    }
  });
  

 module.exports = router;