const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");
const Favourites = require("../models/favourite");
const user = require("../models/user");
const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter
  .route("/")
  .get(authenticate.verifyUser, (req, res, next) => {
    Favourites.find({ user: req.user._id })
      .populate("user")
      .populate("dishes")
      .then((favourite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favourite);
      });
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Favourites.find({})
      .populate("user")
      .populate("dishes")
      .then((favourites) => {
        var favourite_user;
        if (favourites)
          favourite_user = favourites.filter(
            (fav) => fav.user._id.toString() === req.user._id.toString()
          )[0];

        if (!favourite_user)
          favourite_user = new Favourites({ user: req.user._id });
        console.log("yes exists", favourite_user);
        console.log(req.body);
        for (let one of req.body) {
          console.log(one);
          favourite_user.dishes.push(one._id);
        }

        favourite_user
          .save()
          .then(
            (favourite) => {
              Favourites.findById(favourite._id)
                .populate("user")
                .populate("dishes")
                .then((fav) => {
                  res.statusCode = 201;
                  res.setHeader("Content-Type", "application/json");
                  res.json(fav);
                });
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Favourites.remove({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

favouriteRouter
  .route("/:dishId")
  .get(authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({ user: req.user._id })
      .then(
        (favourites) => {
          if (!favourites) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({ exists: false, favourites: favourites });
          } else {
            if (favourites.dishes.indexOf(req.params.dishId < 0)) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({ exists: false, favourites: favourites });
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({ exists: true, favourites: favourites });
            }
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Favourites.find({})
      .populate("user")
      .populate("dishes")
      .then((favourites) => {
        var favourite_user;
        if (favourites)
          favourite_user = favourites.filter(
            (fav) => fav.user._id.toString() === req.user._id.toString()
          )[0];

        if (!favourite_user)
          favourite_user = new Favourites({ user: req.user._id });
        console.log("yes exists", favourite_user);

        favourite_user.dishes.push(req.params.dishId);

        favourite_user
          .save()
          .then(
            (favourite) => {
              Favourites.findById(favourite._id)
                .populate("user")
                .populate("dishes")
                .then((fav) => {
                  res.statusCode = 201;
                  res.setHeader("Content-Type", "application/json");
                  res.json(fav);
                });
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({ user: req.user._id })
      .then((favourites) => {
        if (!favourites.dishes.includes(req.params.dishId)) {
          var err = new Error("No such dish exits");
          err.status = 404;
          return next(err);
        } else {
          favourites.dishes = favourites.dishes.filter(
            (fav) => fav._id.toString() !== req.params.dishId
          );
          favourites.save().then((result) => {
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.json(result);
          });
        }
        console.log(favourites);
      })
      .catch((err) => next(err));
  });
module.exports = favouriteRouter;
