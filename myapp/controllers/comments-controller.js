 
    const { ObjectId } = require('mongodb');
        const db = require('../connection');

        const getAllComments = async function (req, res) {
        let data = await db.get().collection('comments').find().toArray()
        res.render('pages/allcomments',{data});
        }

        const getCommentAddform = async function (req, res) {
        res.render('forms/addcomment');
        }

        const addComment = async function (req, res) {
        let data = req.body
        await db.get().collection('comments').insertOne(data)
        res.render('pages/comment', { data })
        }

        const getCommentEditform = async function (req, res) {
        let id = req.params.id
        let data = await db.get().collection('comments').findOne({ _id: ObjectId(id) })
        res.render('forms/editcomment', { data });
        }

        const editComment = async function (req, res) {
        let newdata = req.body
        let query = { _id: ObjectId(req.body.id) }
        var newvalues = { $set: { name: newdata.name,} };
        await db.get().collection('comments').updateOne(query, newvalues)
        res.redirect(`/comments/${req.body.id}`)
        }

        const deleteComment = async function (req, res) {
        let id = req.params.id
        await db.get().collection('comments').deleteOne({ _id: ObjectId(id) })
        res.redirect('back')
        }

        const getCommentById = async function (req, res) {
        let id = req.params.id
        let data = await db.get().collection('comments').findOne({ _id: ObjectId(id) })
        res.render('pages/comment', { data });
        }

        exports.getAllComments = getAllComments;
        exports.getCommentAddform = getCommentAddform;
        exports.addComment = addComment;
        exports.getCommentEditform = getCommentEditform;
        exports.editComment = editComment;
        exports.deleteComment = deleteComment;
        exports.getCommentById = getCommentById;
    