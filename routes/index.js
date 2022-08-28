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

router.post('/addpage', async function (req, res) {
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



  // await new Promise(resolve => setTimeout(resolve, 5000));
  data.forEach(data => {


    let string1 = `router.get('/${data.name}', function (req, res) {
      res.render('pages/${data.name}');
    });\n \n`
    let filename1 = `myapp/routes/index.js`

    fs.appendFile(filename1, string1, function (err) {
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



router.post('/addcrud', async function (req, res) {
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
    router.get("/delete/:id", ${data.name}sController.delete${data.capname});

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
        let data = await db.get().collection('${data.name}s').find().toArray()
        res.render('pages/all${data.name}s',{data});
        }

        const get${data.capname}Addform = async function (req, res) {
        res.render('forms/add${data.name}');
        }

        const add${data.capname} = async function (req, res) {
        let data = req.body
        await db.get().collection('${data.name}s').insertOne(data)
        res.render('pages/${data.name}', { data })
        }

        const get${data.capname}Editform = async function (req, res) {
        let id = req.params.id
        let data = await db.get().collection('${data.name}s').findOne({ _id: ObjectId(id) })
        res.render('forms/edit${data.name}', { data });
        }

        const edit${data.capname} = async function (req, res) {
        let newdata = req.body
        let query = { _id: ObjectId(req.body.id) }
        var newvalues = { $set: { name: newdata.name,} };
        await db.get().collection('${data.name}s').updateOne(query, newvalues)
        res.redirect(\`/${data.name}s/\${req.body.id}\`)
        }

        const delete${data.capname} = async function (req, res) {
        let id = req.params.id
        await db.get().collection('${data.name}s').deleteOne({ _id: ObjectId(id) })
        res.redirect('back')
        }

        const get${data.capname}ById = async function (req, res) {
        let id = req.params.id
        let data = await db.get().collection('${data.name}s').findOne({ _id: ObjectId(id) })
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

    let filename = `myapp/controllers/${data.name}s-controller.js`

    fs.writeFile(filename, string, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });

  });


  data.forEach(data => {
    let string1 =
      `
<form class="flex flex-col max-w-md shadow-lg bg-grey-300 p-5 rounded-xl" action="/${data.name}s/add" method="post">
<center class="m-5 font-bold text-lg"> Forms </center>
    <div class="flex flex-col ">
        <input class="p-2 my-1 border" type="text" name="name" value="" placeholder="Route name...">
    </div>
    <div><button class="my-2 p-2 font-bold text-md border bg-green text-green-600 " type="submit">Submit</button></div>

</form>
    `
    let string2 =
      `

      <form class="flex flex-col max-w-md shadow-lg bg-grey-300 p-5 rounded-xl" action="/users/edit" method="post">
      <center class="m-5 font-bold text-lg"> Forms </center>
          <div class="flex flex-col ">
              <input class="p-2 my-1 border" type="text" name="name" value="{{data.name}}" placeholder="Route name...">
              <input class="p-2 my-1 border" type="text" name="id" hidden value="{{data._id}}" placeholder="Route name...">
          </div>
          <div><button class="my-2 p-2 font-bold text-md border bg-green text-green-600 " type="submit">Submit</button></div>
      
      </form>
          
    `
    let string3 =
      `
      {{#each data}}
          <div class="m-3 p-3 shadow-md w-96 rounded-md bg-grey-500 text-black flex items-center">
                {{this.name}}
                <div class="flex w-full justify-end">
                      <a href="/${data.name}s/{{this._id}}" class="m-2 flex flex-col text-blue-500">Open</a>
                      <a href="/${data.name}s/edit/{{this._id}}" class="m-2 flex flex-col text-blue-500">Edit</a>
                      <a href="/${data.name}s/delete/{{this._id}}" class="m-2 flex flex-col text-blue-500">Delete</a>
                </div>
          </div>
      {{/each}}
    `
    let string4 =
      `
    <div class="flex flex-col ">
       {{data.name}}
    </div>

    `

    let filename1 = `myapp/views/forms/add${data.name}.hbs`
    let filename2 = `myapp/views/forms/edit${data.name}.hbs`
    let filename3 = `myapp/views/pages/all${data.name}s.hbs`
    let filename4 = `myapp/views/pages/${data.name}.hbs`

    fs.writeFile(filename1, string1, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });

    fs.writeFile(filename2, string2, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });

    fs.writeFile(filename3, string3, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });

    fs.writeFile(filename4, string4, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });

  });

  let string1 = `
  var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
res.render('index', { title: 'Express' });
});
\n\n
module.exports = router;

  \n \n`

  let filename1 = `myapp/routes/index.js`

  fs.appendFile(filename1, string1, function (err) {
    if (err) throw err;
    console.log('Saved! gg');
  });
  let appname = `myapp/app.js`

  let app1 = `
  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  var createError = require('http-errors');
  var express = require('express');
  var path = require('path');
  var cookieParser = require('cookie-parser');
  var logger = require('morgan');
  const sessions = require('express-session');
  var db = require('./connection');
  const hbs = require('express-handlebars');
  var app = express();
  
  db.connect((err) => {
    if (err) console.log("Connection Error" + err);
    else console.log("Database connected to port")
  })


  var indexRouter = require('./routes/index');

  `
  let app2 = `
  

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/', partialsDir: __dirname + '/views/partials/' }))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}));

app.use('/', indexRouter);

  `
  let app3 = `
  
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

  `

  fs.writeFile(appname, app1, function (err) {
    if (err) throw err;
    console.log('Saved! gg');
  });
  await new Promise(resolve => setTimeout(resolve, 3000));
  data.forEach(data => {

    let string = ` var ${data.name}Router = require('./routes/${data.name}-routes');`

    fs.appendFile(appname, string, function (err) {
      if (err) throw err;
      console.log('Saved! gg');
    });

  });
  await new Promise(resolve => setTimeout(resolve, 3000));
  fs.appendFile(appname, app2, function (err) {
    if (err) throw err;
    console.log('Saved! gg');
  });
  await new Promise(resolve => setTimeout(resolve, 3000));

  data.forEach(data => {

    let string = `app.use('/${data.name}s', ${data.name}Router);`

    fs.appendFile(appname, string, function (err) {
      if (err) throw err;
      console.log('Saved! gg');
    });

  });
  await new Promise(resolve => setTimeout(resolve, 3000));

  fs.appendFile(appname, app3, function (err) {
    if (err) throw err;
    console.log('Saved! gg');
  });

  res.render('crudgen', { data, app });
}),

  router.get('/generate', async function (req, res) {
    var zipper = require('zip-local');
    zipper.sync.zip("./myapp").save("public/myapp.zip");
    res.redirect("/crudgen");
  });

router.get('/cleandir', (req, res) => {
  const fsExtra = require('fs-extra');
  fsExtra.emptyDirSync("./myapp/controllers/");
  fsExtra.emptyDirSync("./myapp/routes/");
  fsExtra.emptyDirSync("./myapp/views/forms/");
  fsExtra.emptyDirSync("./myapp/views/pages/");
  console.log('done');
  res.redirect("/crudgen");
});

module.exports = router;


