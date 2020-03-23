'use strict';
const express = require('express');
const employeeRoutes = require('./routes/employee');
const exphbs = require('express-handlebars');
const path = require('path');
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = parseInt(process.env.PORT || '3000');

const db_name = path.join(__dirname, '/data/', 'employeedb.db');

const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to 'employeedb.db' database ");
});

const sql_create_emp = `CREATE TABLE IF NOT EXISTS Employee (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    hireDate TEXT NOT NULL,
    role VARCHAR(10) NOT NULL,
    favJoke TEXT,
    favQuote TEXT
  );`;
  
  db.run(sql_create_emp, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("'Employee' table created!");
  });

  const sql_insert_emp = `INSERT INTO Employee (firstName, lastName, hireDate,role,favJoke,favQuote) VALUES
  ('Foo', 'Bar', '2000-01-01','CEO','I am not lazy.I am on Energy saving mode.','Raleigh is Best Place to live.')`;
  db.run(sql_insert_emp, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("One Employee created successfully.");
  });


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs',exphbs({extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('view engine', 'hbs');

app.set('db', db);

app.use('/api/employees', employeeRoutes);
// Fail over route
app.use(function(req, res) {
    res.status(404).send('Not found');
});
// listen for requests
app.listen(port, function() {
    console.log(`Server is listening on port ${port}`);
});

module.exports = app;
