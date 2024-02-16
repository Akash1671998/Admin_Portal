const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
 let SecretKey = process.env.SECRET_KEY
 let tokenTime= process.env.TOKENEXPIRE_TIME

const UserDataStructure = new mongoose.Schema({
  firstname: {
    type: String,
    trim: true,
  },
  lastname: {
    type: String,
    trim: true,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: { 
    type: String,
  },
  gender: {
    type: String,
  },
  phonenumber: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
});

// // Create JSON Web Token 
// UserDataStructure.methods.generateAuthToken = async function () {
//   try {
//     const userid = this._id;
//     console.log("?????????????????",userid)
//     const tokenResult = await jwt.sign({ id: userid }, SecretKey,);
//     this.token = tokenResult; 
//     await this.save(); 
//     return tokenResult;
//   } catch (error) {
//     console.log("error generating token", error);
//     throw error; 
//   }
// };

UserDataStructure.methods.generateAuthToken = async function () {
  try {
    const userid = this._id;
    console.log("???????????????????",userid)
    if (!userid) {
      throw new Error("User ID not found.");
    }
    console.log("User ID:", userid);
    const tokenResult = await jwt.sign({ _id: userid },SecretKey,{ expiresIn: tokenTime });
    this.token = tokenResult; 
    await this.save(); 
    return tokenResult;
  } catch (error) {
    console.log("Error generating token:", error);
    throw error; 
  }
};


// Encrypt Password By Hash 
const expirePasswordRound = 12;
UserDataStructure.pre("save", async function (next) {
  try {
    const concatenatedPassword = this.password + this.confirmpassword;
      const hashedPassword = await bcrypt.hash(
        concatenatedPassword,
        expirePasswordRound
      );
    this.password = hashedPassword;
    this.confirmpassword = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});
const Registrations = new mongoose.model("registrations", UserDataStructure);
module.exports = Registrations;
