'use strict';
const helper = require("./helper.js")
const express = require('express');
const path = require('path');
const router = express.Router();

//Create Employee - Get Endpoint for UI
router.get('/create', (req, res) => {
  console.dir(`Called GET /create`);
  res.render("employee/add", {
    viewTitle: "Add New Employee",
    employee: {
      firstName: "",
      lastName: "",
      hireDate: "",
      role: "",
      favJoke: "",
      favQuote: "",
    },
    errors: [],
  });
});

//Create Employee - Post EndPoint
router.post('/create', (req, res) => {
  console.dir(`Called POST /create`);
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let hireDate = req.body.hireDate;
  let role = req.body.role;
  let favJoke = req.body.favJoke;
  let favQuote = req.body.favQuote;

  //Call function to validate Input Request Params
  const errors = validateRequestParams(firstName, lastName, hireDate, role);
  
  if (Array.isArray(errors) && errors.length != 0) {
    return res.render("employee/add", {
      viewTitle: "Add New Employee",
      employee: {
        firstName: firstName,
        lastName: lastName,
        hireDate: hireDate,
        role: role,
        favJoke: favJoke,
        favQuote: favQuote,
      },
      errors: errors,
    });
  }

  let db = req.app.get('db');
  const sql = `INSERT INTO Employee (firstName, lastName, hireDate, role, favJoke, favQuote) VALUES ` +
    `("${firstName}", "${lastName}", "${hireDate}", "${role}", "${favJoke}", "${favQuote}")`;

  db.run(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return console.error(err.message);
    }
  });

  res.redirect("/api/employees");
});

//Edit Employee - Get Endpoint for UI
router.get('/edit/:id', (req, res) => {
  console.dir(`Called GET /edit/:id with id = ${req.params.id}`);
  let id = req.params.id;

  let db = req.app.get('db');
  const sql = `SELECT * FROM Employee WHERE id="${id}"`;
  db.get(sql, (err, row) => {
    if (err) {
      console.log(err);
      return console.error(err.message);
    }
    console.dir(row);
    res.render("employee/edit", {
      viewTitle: "Update Existing Employee",
      employee: row,
      errors: []
    });
  });
});

//Edit Employee - Put EndPoint
router.put('/edit/:id', (req, res) => {
  console.dir(`Called PUT /edit/:id with id = ${req.params.id}`);
  let id = req.params.id;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let hireDate = req.body.hireDate;
  let role = req.body.role;
  let favJoke = req.body.favJoke;
  let favQuote = req.body.favQuote;

  //Call function to validate Input Request Params
  const errors = validateRequestParams(firstName, lastName, hireDate, role);
  if (Array.isArray(errors) && errors.length != 0) {
    return res.status(400).json({ errors: errors });
 }

  let db = req.app.get('db');
  const sql = `UPDATE Employee SET ` +
    `firstName = "${firstName}", ` +
    `lastName = "${lastName}", ` +
    `hireDate = "${hireDate}", ` +
    `role = "${role}", ` +
    `favJoke = "${favJoke}", ` +
    `favQuote = "${favQuote}"` +
    `WHERE id="${id}"`;

  db.run(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return console.error(err.message);
    }

    return res.status(200).json({ errors: [] });

  });
});

//List all the Employees - GET EndPoint
router.get('/', (req, res) => {
  let db = req.app.get('db');
  console.dir(`Called / to Get Employees`);
  const sql = "SELECT * FROM Employee"
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("employee/list", { list: rows });
  });
});

//List record for a specific Employee - GET EndPoint with id parameter
router.get('/:id', (req, res) => {
  let db = req.app.get('db');
  console.dir(`Called /:id to get specific Employee`);
  let id = req.params.id;
  const sql = `SELECT * FROM Employee where id = ${id}`;
  db.get(sql, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.send(row);
  });
});

//Delete record for a specific Employee - DELETE Endpoint with id parameter 
router.delete('/:id', (req, res) => {
  let db = req.app.get('db');
  console.dir(`Called /:id to delete specific Employee`);
  let id = req.params.id;
  const sql = `DELETE FROM Employee where id = ${id}`;
  db.run(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return console.error(err.message);
    }
  });
});

//Method to validate Input parameters
function validateRequestParams(firstName, lastName, hireDate, role) {
  let errors = [];
  let firstNameError = helper.validateName(firstName.trim());
  if (firstNameError != "") {
    errors.push(`First Name ${firstNameError}`);
  }

  let lastNameError = helper.validateName(lastName.trim());
  if (lastNameError != "") {
    errors.push(`Last Name ${lastNameError}`);
  }

  let hireDateError = helper.validateHireDate(hireDate).trim();
  if (hireDateError != "") {
    errors.push(`Hire Date ${hireDateError}`);
  }

  let roleError = helper.validateRole(role).trim();
  if (roleError != "") {
    errors.push(`Role ${roleError}`);
  }

  return errors;
}

module.exports = router;
