 
    const { ObjectId } = require('mongodb');
        const db = require('../connection');

        const getAllBlogs = async function (req, res) {
        let data = await db.get().collection('blogs').find().toArray()
        res.render('pages/allblogs',{data});
        }

        const getBlogAddform = async function (req, res) {
        res.render('forms/addblog');
        }

        const addBlog = async function (req, res) {
        let data = req.body
        await db.get().collection('blogs').insertOne(data)
        res.render('pages/blog', { data })
        }

        const getBlogEditform = async function (req, res) {
        let id = req.params.id
        let data = await db.get().collection('blogs').findOne({ _id: ObjectId(id) })
        res.render('forms/editblog', { data });
        }

        const editBlog = async function (req, res) {
        let newdata = req.body
        let query = { _id: ObjectId(req.body.id) }
        var newvalues = { $set: { name: newdata.name,} };
        await db.get().collection('blogs').updateOne(query, newvalues)
        res.redirect(`/blogs/${req.body.id}`)
        }

        const deleteBlog = async function (req, res) {
        let id = req.params.id
        await db.get().collection('blogs').deleteOne({ _id: ObjectId(id) })
        res.redirect('back')
        }

        const getBlogById = async function (req, res) {
        let id = req.params.id
        let data = await db.get().collection('blogs').findOne({ _id: ObjectId(id) })
        res.render('pages/blog', { data });
        }

        exports.getAllBlogs = getAllBlogs;
        exports.getBlogAddform = getBlogAddform;
        exports.addBlog = addBlog;
        exports.getBlogEditform = getBlogEditform;
        exports.editBlog = editBlog;
        exports.deleteBlog = deleteBlog;
        exports.getBlogById = getBlogById;
    