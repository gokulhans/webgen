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


  //index.hbs file generation 
  data.forEach(data => {
    let string = `
  <a class="btn btn-primary text-white " href="/${data.name}s/"><strong>${data.name}s</strong></a>
  <br>
  `
    let filename = `myapp/views/index.hbs`

    fs.appendFile(filename, string, function (err) {
      if (err) throw err;
      console.log('Saved! index');
    });

  });
// 


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
<a href="/${data.name}s/" class="btn btn-primary m-3 text-white"><strong>Users Home</strong></a>
 
<div class="center">
    <div class="center-div">
        <form class="width container mt-3" action="/${data.name}s/add" method="post">
            <h3 class="mb-3">Add</h3>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Name</label>
                <input type="text" class="form-control" id="exampleInputEmail1" name="name" aria-describedby="emailHelp"
                    placeholder="Name..">
            </div>
            {{!-- <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Email address</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1">Check me out</label>
            </div> --}}
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</div>
    `
    let string2 =
      `

      <a href="/${data.name}s/" class="btn btn-primary m-3 text-white"><strong>Users Home</strong></a>

<div class="center">
    <div class="center-div">
        <form class="width container mt-3" action="/${data.name}s/edit" method="post">
        <center><h3 class="mb-3">Edit</h3></center>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Name</label>
                <input type="text" class="form-control" id="exampleInputEmail1" name="name" value="{{data.name}}" aria-describedby="emailHelp"placeholder="Name..">
                <input type="text" class="form-control" id="exampleInputEmail1" name="id" value="{{data._id}}" hidden aria-describedby="emailHelp"placeholder="Name..">
            </div>
            {{!-- <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Email address</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1">Check me out</label>
            </div> --}}
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</div>
    `
    let string3 =
      `
<a href="/${data.name}s/add" class="btn btn-primary m-3 text-white"><strong>Add</strong></a>

<div class="py-3">
      <div class="container">
            <div class="row hidden-md-up">
                  {{#each data}}
                  <div class="col-md-6 col-lg-4">
                        <div class="p-3 mt-2 mb-2">

                              <img class="card-img-top rounded-top" height="200px" style="object-fit: cover;"
                                    src="https://source.unsplash.com/random/" alt="Card image cap">
                              <div class="rounded shadow-lg p-3 bg-white rounded">
                                    <div class="card-body mt-2">
                                          <a href="/${data.name}s/{{this._id}}">
                                                <h5 class="card-title">{{this.name}}</h5>
                                          </a>

                                          <p class="card-text mt-2">Some quick example text to build on the card title
                                                and
                                                make up the bulk of the card's content.</p>
                                    </div>
                                    <div class="mt-3">
                                          <a href="/${data.name}s/{{this._id}}" class="btn btn-success text-white "> <b>Open</b></a>
                                          <a href="/${data.name}s/edit/{{this._id}}" class="btn btn-primary text-white ml-2"> <b>Edit</b></a>
                                          <a href="/${data.name}s/delete/{{this._id}}" class="btn btn-danger text-white ml-2"><b>Delete</b></a>
                                    </div>
                              </div>
                        </div>

                  </div>
                  {{/each}}
            </div>
      </div>
</div>
    `
    let string4 =
      `
      <a href="/${data.name}s/" class="btn btn-primary m-3 text-white"><strong>Users Home</strong></a>


      <div class="container mt-5 mb-5">
     <div class="row d-flex justify-content-center">
         <div class="col-md-10">
             <div class="center-div">
                 <div class="row">
                     <div class="col-md-6">
                         <div class="images p-3">
                             <div class="text-center p-4"> <img id="main-image" src="https://i.imgur.com/Dhebu4F.jpg" width="250" /> </div>
                             <div class="thumbnail text-center"> <img onclick="change_image(this)" src="https://i.imgur.com/Rx7uKd0.jpg" width="70"> <img onclick="change_image(this)" src="https://i.imgur.com/Dhebu4F.jpg" width="70"> </div>
                         </div>
                     </div>
                     <div class="col-md-6">
                         <div class="product p-4">
                             <div class="d-flex justify-content-between align-items-center">
                                 <div class="d-flex align-items-center"> <i class="fa fa-long-arrow-left"></i> <span class="ml-1">Back</span> </div> <i class="fa fa-shopping-cart text-muted"></i>
                             </div>
                             <div class="mt-4 mb-3"> <span class="text-uppercase text-muted brand">Orianz</span>
                                 <h5 class="text-uppercase">{{data.name}}</h5>
                                 <div class="price d-flex flex-row align-items-center"> <span class="act-price">$20</span>
                                     <div class="ml-2"> <small class="dis-price">$59</small> <span>40% OFF</span> </div>
                                 </div>
                             </div>
                             <p class="about">Shop from a wide range of t-shirt from orianz. Pefect for your everyday use, you could pair it with a stylish pair of jeans or trousers complete the look.</p>
                             <div class="sizes mt-5">
                                 <h6 class="text-uppercase">Size</h6> <label class="radio"> <input type="radio" name="size" value="S" checked> <span>S</span> </label> <label class="radio"> <input type="radio" name="size" value="M"> <span>M</span> </label> <label class="radio"> <input type="radio" name="size" value="L"> <span>L</span> </label> <label class="radio"> <input type="radio" name="size" value="XL"> <span>XL</span> </label> <label class="radio"> <input type="radio" name="size" value="XXL"> <span>XXL</span> </label>
                             </div>
                             <div class="cart mt-4 align-items-center"> <button class="btn btn-danger text-uppercase mr-2 px-4">Add to cart</button> <i class="fa fa-heart text-muted"></i> <i class="fa fa-share-alt text-muted"></i> </div>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
     </div>
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
res.render('index', {data});
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
  cleandirectory();
  res.redirect("/crudgen");
});

module.exports = router;


const cleandirectory = () => {
  const fsExtra = require('fs-extra');
  fsExtra.emptyDirSync("./myapp/controllers/");
  fsExtra.emptyDirSync("./myapp/routes/");
  fsExtra.emptyDirSync("./myapp/views/forms/");
  fsExtra.emptyDirSync("./myapp/views/pages/");
  console.log('done');
}