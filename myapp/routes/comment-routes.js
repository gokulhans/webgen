    
    const express = require("express");
    const router = express.Router();
    const commentsController = require("../controllers/comments-controller");

    router.get("/", commentsController.getAllComments);
    router.get('/add', commentsController.getCommentAddform);
    router.post("/add", commentsController.addComment);
    router.get('/edit/:id',commentsController.getCommentEditform);
    router.post("/edit", commentsController.editComment);
    router.get('/:id', commentsController.getCommentById);
    router.get("/delete/:id", commentsController.deleteComment);

    module.exports = router;