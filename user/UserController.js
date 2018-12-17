var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");

var VerifyToken = require(__root + "auth/VerifyToken");

router.use(bodyParser.urlencoded({ extended: true }));
var User = require("./User");

// CREATES A NEW ALIEN
router.post("/", function(req, res) {
  User.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      age: req.body.age,
      famille: req.body.famille,
      race: req.body.race,
      nourriture: req.body.nourriture
    },
    function(err, user) {
      if (err)
        return res
          .status(500)
          .send("There was a problem adding the information to the database.");
      res.status(200).send(user);
    }
  );
});

// RETURNS ALL THE ALIENS IN THE DATABASE
router.get("/", function(req, res) {
  User.find({}, function(err, users) {
    if (err)
      return res.status(500).send("There was a problem finding the users.");
    res.status(200).send(users);
  });
});

// GETS A SINGLE ALIEN FROM THE DATABASE
router.get("/:id", function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err)
      return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    res.status(200).send(user);
  });
});

// DELETES AN ALIEN FROM THE DATABASE
router.delete("/:id", function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if (err)
      return res.status(500).send("There was a problem deleting the user.");
    res.status(200).send("User: " + user.name + " was deleted.");
  });
});

// UPDATES A SINGLE ALIEN IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
router.put("/:id", VerifyToken, function(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(
    err,
    user
  ) {
    if (err)
      return res.status(500).send("There was a problem updating the user.");
    res.status(200).send(user);
  });
});

// UPDATES Freinds List ADD
// Added VerifyToken middleware to make sure only an authenticated user can put to this route

router.put("/:id/addfreind", VerifyToken, function(req, res) {
  var friend = { name: req.body.name };
  User.findOne({ name: req.body.name }, function(err, user) {
    if (err) return res.status(500).send("Error on the server.");
    if (!user) return res.status(404).send("No user found.");
    User.findByIdAndUpdate(
      req.params.id,
      { $push: { freinds: friend } },
      { safe: true, upsert: true },
      function(err, user) {
        if (err) {
          console.log(err);
          return res.status(500).send("There was a problem updating the user.");
        }
        res.status(200).send(user);
      }
    );
  });
});

// UPDATES Freinds List DELETE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route

router.put("/:id/deletefreind", VerifyToken, function(req, res) {
  var friend = { name: req.body.name };
  User.findOne({ name: req.body.name }, function(err, user) {
    if (err) return res.status(500).send("Error on the server.");
    if (!user) return res.status(404).send("No user found.");
    User.findByIdAndUpdate(
      req.params.id,
      { $pull: { freinds: friend } },
      { safe: true, upsert: true },
      function(err, user) {
        if (err) {
          console.log(err);
          return res.status(500).send("There was a problem updating the user.");
        }
        res.status(200).send(user);
      }
    );
  });
});

module.exports = router;
