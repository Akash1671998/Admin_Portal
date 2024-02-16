const express = require("express");
const UserData = require("../Model/Model");
const loginRoute = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

loginRoute.post("/api/User/Login", async (req, res) => {
  try {
    const isEmail = req.body.email;
    const isPassword = req.body.password;
    const RemoveField =
      "-__v -age -gender -phonenumber -lastname -firstname -confirmpassword";
    const user = await UserData.findOne({ email: isEmail }).select(RemoveField);
    const storedPassword = user.password;

    if (!user) {
      return res.status(401).send({
        status: "Error",
        message: "Authentication failed",
        messageDetail: "User not found",
      });
    }

    // password is compare  by hash ( requestBody Password == DataBaseStore Password )
    const match = bcrypt.compare(isPassword, storedPassword);

    // Create Token after User Login
    const token = await user.generateAuthToken();
    if (match) {
      return res.status(200).send({
        status: "OK",
        message: "Authenticated",
        messageDetail: "User has been successfully authenticated",
        data: user,
      });
    } else {
      return res.status(401).send({
        status: "Error",
        message: "Authentication failed",
        messageDetail: "Incorrect password",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: "Error", message: "Internal Server Error" });
  }
});

// let SecretKey = "Development@123"
// const CreateToken = async()=>{
//   const tokenResult = await jwt.sign({_id:"65c9bdb6c8fe9e1de6e56a41"},SecretKey)
//   console.log("Token Generated Successfully ",tokenResult)

//   const TokenVerify = await jwt.verify(tokenResult ,SecretKey)
//   console.log("Token Verify Success ",TokenVerify)
// }
// CreateToken();

module.exports = loginRoute;
