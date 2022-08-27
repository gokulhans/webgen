var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();

var fs = require('fs');


// POST REQUESTS


router.get('/dev', function (req, res) {
  res.send('wELCOME cOWBOYS');
});
router.get('/', function (req, res) {
  let data = 'test'
  res.render('index', { router });
});
router.get('/pagegen', function (req, res) {
  let data = 'test'
  res.render('pagegen', { data });
});
router.get('/staticgen', function (req, res) {
  let data = 'test'
  res.render('staticgen', { data });
});
router.get('/formgen', function (req, res) {
  let data = 'test'
  res.render('formgen', { data });
});
router.get('/crudgen', function (req, res) {
  let data = 'test'
  res.render('crudgen', { data });
});


router.post('/addform', function (req, res) {
  console.log(req.body.name);
  let route = req.body.name
  route = route.split(" ");
  let data = [];
  route.forEach(name => {
    data.push({ name: name })
  });


  data.forEach(data => {
    let string =
      `
<form class="flex flex-col max-w-md shadow-lg bg-grey-300 p-5 rounded-xl" action="/${data.name}" method="post">
<center class="m-5 font-bold text-lg"> Forms </center>
    <div class="flex flex-col ">
        <input class="p-2 my-1 border" type="text" name="name" value="" placeholder="Route name...">
    </div>
    <div><button class="my-2 p-2 font-bold text-md border bg-green text-green-600 " type="submit">Submit</button></div>

</form>
    `

    let filename = `myapp/views/forms/${data.name}.hbs`

    fs.writeFile(filename, string, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });

  });

  res.render('formgen', { data });
});


router.post('/addpage', function (req, res) {
  console.log(req.body.name);
  let route = req.body.name
  route = route.split(" ");
  let data = [];
  route.forEach(name => {
    data.push({ name: name })
  });
  console.log(data);


  data.forEach(data => {
    let string = `<h1> ${data.name}</h1>`
    let filename = `myapp/views/pages/${data.name}.hbs`

    fs.writeFile(filename, string, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });

  });

  res.render('pagegen', { data });
});

router.post('/addstaticgen', function (req, res) {
  console.log(req.body.name);
  let route = req.body.name
  route = route.split(" ");
  let data = [];
  route.forEach(name => {
    data.push({ name: name })
  });
  console.log(data);


  data.forEach(data => {
    let string = `router.get('/${data.name}', function (req, res) {
      res.render('${data.name}');
    });`
    let filename = `myapp/views/pages/${data.name}.hbs`

    fs.writeFile(filename, string, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });

  });

  res.render('staticgen', { data });
});

router.post('/addcrud', function (req, res) {
  console.log(req.body.name);
  let app = req.body.app
  let route = req.body.name
  route = route.split(" ");
  let data = [];
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  route.forEach(name => {
    data.push({ name: name, capname: capitalizeFirstLetter(name) })
  });
  console.log(data);


  data.forEach(data => {
    let string = `    
    const express = require("express");
    const router = express.Router();
    const ${data.name}sController = require("../controllers/${data.name}s-controller");

    router.get("/", ${data.name}sController.getAll${data.capname}s);
    router.get('/add', ${data.name}sController.get${data.capname}Addform);
    router.post("/add", ${data.name}sController.add${data.capname});
    router.get('/edit/:id',${data.name}sController.get${data.capname}Editform);
    router.post("/edit", ${data.name}sController.edit${data.capname});
    router.get('/:id', ${data.name}sController.get${data.capname}ById);
    router.delete("/:id", ${data.name}sController.delete${data.capname});

    module.exports = router;`;

    let filename = `myapp/routes/${data.name}-routes.js`

    fs.writeFile(filename, string, function (err) {
      if (err) throw err;
      console.log('Saved!');

    });

  });


  data.forEach(data => {
    let string = ` 
    const { ObjectId } = require('mongodb');
        const db = require('../connection');

        const getAll${data.capname}s = async function (req, res) {
        let data = await db.get().collection('data').find().toArray()
        res.render('all${data.name}s',{data});
        }

        const get${data.capname}Addform = async function (req, res) {
        res.render('forms/add${data.name}');
        }

        const add${data.capname} = async function (req, res) {
        let data = req.body
        await db.get().collection('data').insertOne(data)
        res.render('pages/${data.name}', { data })
        }

        const get${data.capname}Editform = async function (req, res) {
        let id = req.params.id
        let data = await db.get().collection('data').findOne({ _id: ObjectId(id) })
        res.render('forms/edit${data.name}', { data });
        }

        const edit${data.capname} = async function (req, res) {
        let newdata = req.body
        let query = { _id: ObjectId(req.body.id) }
        var newvalues = { $set: { name: newdata.name, desc: newdata.desc} };
        await db.get().collection('data').updateOne(query, newvalues)
        res.redirect(\`/${data.name}/\${req.body.id}\`)
        }

        const delete${data.capname} = async function (req, res) {
        let id = req.params.id
        await db.get().collection('data').deleteOne({ _id: ObjectId(id) })
        res.redirect('back')
        }

        const get${data.capname}ById = async function (req, res) {
        let id = req.params.id
        let data = await db.get().collection('data').findOne({ _id: ObjectId(id) })
        res.render('pages/${data.name}', { data });
        }

        exports.getAll${data.capname}s = getAll${data.capname}s;
        exports.get${data.capname}Addform = get${data.capname}Addform;
        exports.add${data.capname} = add${data.capname};
        exports.get${data.capname}Editform = get${data.capname}Editform;
        exports.edit${data.capname} = edit${data.capname};
        exports.delete${data.capname} = delete${data.capname};
        exports.get${data.capname}ById = get${data.capname}ById;
    `;

    let filename = `myapp/controllers/${data.name}-controller.js`

    fs.writeFile(filename, string, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });

  });

  res.render('crudgen', { data, app });
}),

  router.get('/generate', async function (req, res) {
    var zipper = require('zip-local');
    zipper.sync.zip("./myapp").save("public/myapp.zip");
    res.redirect("/");
  });

module.exports = router;


router.get('/cleandir', (req, res) => {
  const fsExtra = require('fs-extra');
  fsExtra.emptyDirSync("./myapp/controllers/");
  fsExtra.emptyDirSync("./myapp/routes/");
  fsExtra.emptyDirSync("./myapp/views/forms/");
  fsExtra.emptyDirSync("./myapp/views/pages/");
  console.log('done');
  res.redirect("back");
});
