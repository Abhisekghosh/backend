var http = require("http");
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
const cors = require('cors')
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'mpbn',
  database : 'node_db'
});
con.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
})

var server = app.listen(3000, "127.0.0.1", function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});

var createTable = "CREATE TABLE IF NOT EXISTS user(id int(11) NOT NULL AUTO_INCREMENT,"+
    "username varchar(20) DEFAULT NULL,"+
    "salary float(11) DEFAULT NULL,"+
    "PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=latin1";

con.query(createTable,  function(err){
    if(err) throw err;
    else {
        console.log('Table created!');
    }
     });
     var values = [
         ['demian', 12000],
         ['john',3000],
         ['mark',5000],
         ['pete', 44000]
     ];
con.query('select * from user',function (error, result, fields)  {
  if(result.length==0) {
    con.query('INSERT INTO user(username,salary) VALUES ?',[values], function(err,res){
             if(err) throw err;
             else {
                 console.log('A new employee has been added.');
             }
           });
  }
  else {
    console.log('Data already inserted.');
  }

          });
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
// home page
app.get('/', function (req, res) {
   res.send('HTTP GET,POST,UPDATE and DELETE operations');

 });

 //get list of elements
app.get('/user', function (req, res) {
   console.log(req);
   con.query('select * from user', function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));
 });
 });

// Get User by ID
app.get('/user/:id', function (req, res) {
   var id= req.params.id;
   console.log(req);
   con.query('select * from user where id=?',[id], function (error, results, fields) {
   if (error) throw error;
   //res.send('GET request for id='+id);
   res.end(JSON.stringify(results));

 });
  });
// Adding new user
app.post('/user', function(req, res) {
console.log(req);
var username=req.body.username;
var salary=req.body.salary;
console.log(req.body.username);
console.log(req.body.salary);
console.log(req.body);

con.query('INSERT INTO user(username,salary) values(?,?)',[username,salary], function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));

});
});
//update Users by ID
app.put('/user', function (req, res) {
   con.query('UPDATE user SET username=?,salary=? where id=?', [req.body.username,req.body.salary,req.body.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});
app.put('/user/:id', function (req, res) {
  var id= req.params.id;
   con.query('UPDATE user SET username=?,salary=? where id=?', [req.body.username,req.body.salary,id], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

//Delete from body
app.delete('/user', function (req, res) {
   console.log(req.body);
   con.query('DELETE FROM user WHERE id=?', [req.body.id], function (error, results, fields) {
	  if (error) throw error;
    	  res.end(JSON.stringify(results));
	});
});
//delete from params
app.delete('/user/:id', function (req, res) {
   var id=req.params.id;
   con.query('DELETE FROM user WHERE id=?', [id], function (error, results, fields) {
	  if (error) throw error;
	   res.end(JSON.stringify(results));
	});
});
