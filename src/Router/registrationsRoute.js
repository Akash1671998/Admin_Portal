const express = require("express");
const UserData = require("../Model/Model");
const registrationsRoute = express.Router();

// Define the route to create a new player
registrationsRoute.post("/api/User/Register", async (req, res) => {
  try {

    const existingUser = await UserData.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).send({
        status: "Error",
        message: "User already exists with the provided email",
      });
    }
    const Newuserdata = new UserData(req.body);
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    const token = await Newuserdata.generateAuthToken();
    console.log("token generatedddddddddddddd",token)
    if (password === confirmpassword) {
      const result = await Newuserdata.save();
      res.status(200).send({
        status: "ok",
        message: "200 Ok",
        messageDetails: "User Created Successfully",
        data: result,
      });
    } else {
      res.status(500).send({
        status: "Error",
        message:
          "Confirm password is not Same as Password Please Currect The ConfirmPassword",
      });
    }
  } catch (error) {
    res.status(400).send({
      message: "Error Registrations Data",
      error: error.message,
    });
  }
});
// Define the route to Get all  player Data
registrationsRoute.get("/api/User/List", async (req, res) => {
  try {
    const AllPlayerData = UserData.find().sort({ age: 1 }).select("-__v");
    const Data = await AllPlayerData;
    res.status(200).send({
      status: "ok",
      message: "200 Ok",
      messageDetails: "Record getting Successfully",
      data: Data,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
// // Define the route to Get specific player Data
registrationsRoute.get("/api/User/List/:id", async (req, res) => {
  try {
    const Id = req.params.id;
    const AllPlayerData = await UserData.findById(Id);
    if (!AllPlayerData) {
      throw new Error("ID not found");
    }

    if (!AllPlayerData) {
      return res.status(404).send({
        status: "Error",
        message: "Record Not Found ",
      });
    }

    res.status(200).send({
      status: "Ok",
      message: "200 Ok",
      messageDetails: "Record getting Successfully",
      data: AllPlayerData,
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
    });
  }
});
module.exports = registrationsRoute;
