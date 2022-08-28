 
    const { ObjectId } = require('mongodb');
        const db = require('../connection');

        const getAllUsers = async function (req, res) {
        let data = await db.get().collection('users').find().toArray()
        res.render('pages/allusers',{data});
        }

        const getUserAddform = async function (req, res) {
        res.render('forms/adduser');
        }

        const addUser = async function (req, res) {
        let data = req.body
        await db.get().collection('users').insertOne(data)
        res.render('pages/user', { data })
        }

        const getUserEditform = async function (req, res) {
        let id = req.params.id
        let data = await db.get().collection('users').findOne({ _id: ObjectId(id) })
        res.render('forms/edituser', { data });
        }

        const editUser = async function (req, res) {
        let newdata = req.body
        let query = { _id: ObjectId(req.body.id) }
        var newvalues = { $set: { name: newdata.name,} };
        await db.get().collection('users').updateOne(query, newvalues)
        res.redirect(`/users/${req.body.id}`)
        }

        const deleteUser = async function (req, res) {
        let id = req.params.id
        await db.get().collection('users').deleteOne({ _id: ObjectId(id) })
        res.redirect('back')
        }

        const getUserById = async function (req, res) {
        let id = req.params.id
        let data = await db.get().collection('users').findOne({ _id: ObjectId(id) })
        res.render('pages/user', { data });
        }

        exports.getAllUsers = getAllUsers;
        exports.getUserAddform = getUserAddform;
        exports.addUser = addUser;
        exports.getUserEditform = getUserEditform;
        exports.editUser = editUser;
        exports.deleteUser = deleteUser;
        exports.getUserById = getUserById;
    