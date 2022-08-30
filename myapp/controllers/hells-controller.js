 
    const { ObjectId } = require('mongodb');
        const db = require('../connection');

        const getAllHells = async function (req, res) {
        let data = await db.get().collection('hells').find().toArray()
        res.render('pages/allhells',{data});
        }

        const getHellAddform = async function (req, res) {
        res.render('forms/addhell');
        }

        const addHell = async function (req, res) {
        let data = req.body
        await db.get().collection('hells').insertOne(data)
        res.render('pages/hell', { data })
        }

        const getHellEditform = async function (req, res) {
        let id = req.params.id
        let data = await db.get().collection('hells').findOne({ _id: ObjectId(id) })
        res.render('forms/edithell', { data });
        }

        const editHell = async function (req, res) {
        let newdata = req.body
        let query = { _id: ObjectId(req.body.id) }
        var newvalues = { $set: { name: newdata.name,} };
        await db.get().collection('hells').updateOne(query, newvalues)
        res.redirect(`/hells/${req.body.id}`)
        }

        const deleteHell = async function (req, res) {
        let id = req.params.id
        await db.get().collection('hells').deleteOne({ _id: ObjectId(id) })
        res.redirect('back')
        }

        const getHellById = async function (req, res) {
        let id = req.params.id
        let data = await db.get().collection('hells').findOne({ _id: ObjectId(id) })
        res.render('pages/hell', { data });
        }

        exports.getAllHells = getAllHells;
        exports.getHellAddform = getHellAddform;
        exports.addHell = addHell;
        exports.getHellEditform = getHellEditform;
        exports.editHell = editHell;
        exports.deleteHell = deleteHell;
        exports.getHellById = getHellById;
    