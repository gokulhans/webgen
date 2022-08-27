var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId
var fs = require('fs')
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
router.get('/crudgen', function (req, res) {
  let data = 'test'
  res.render('crudgen', { data });
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
  res.render('pagegen', { data});
});

router.post('/addcrud', function (req, res) {
  console.log(req.body.name);
  let app = req.body.app
  let route = req.body.name
  route = route.split(" ");
  let data = [];
  route.forEach(name => {
    data.push({ name: name, capname: capitalizeFirstLetter(name) })
  });
  console.log(data);
  res.render('crudgen', { data,app });
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// router.post('/addpage', function (req, res) {
//   console.log(req.body);
//   let routes = req.body.posts
//   routes = routes.split(" ");
//   let posts = [];
//   routes.forEach(element => {
//     posts.push({ data: '/' + element, method: 'post', response: 'render' })
//   });
//   let putss = req.body.puts
//   putss = putss.split(" ");
//   let puts = [];
//   routes.forEach(element => {
//     puts.push({ data: '/' + element, method: 'puts', response: 'redirect' })
//   });
//   res.render('pagegen', { posts, puts });
// });


module.exports = router;


