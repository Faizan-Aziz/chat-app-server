
import UserModel from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import message from "../models/message.js";



export const register = async (req, res) => {
  try {

    //step no 1 check no already exist or not 
    let { mobilenumber, password, name, profile } = req.body  // used the same keywords while destructuring and when data send from frontend to backend used the same name 

    const isExist = await UserModel.findOne({ mobilenumber });

    if (isExist) {
      return res.status(409).json({ message: "User with this MObile no Already Exist"})
    }

    //step no 2 if not then hashed the passowrd 

    const hashedpassword = await bcrypt.hash(password, 10)

    //step no 3 saved the password

    password = hashedpassword;
    const newUser = new UserModel({ mobilenumber, password, name, profile });
    await newUser.save()


    res.status(200).json({
      message: "User register succesfully",
      newUser
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" })
  }
};



const cookieOptions = {
  httpOnly: true,
  secure: false, // Set to true in production
  sameSite: 'Lax',
  maxAge: 60 * 60 * 1000 // 1 hour in milliseconds
};



export const login = async (req, res) => {
  try {

    // step no 1 check the user is already exist or not by comparing the number 

    const { mobilenumber, password } = req.body

    const user = await UserModel.findOne({ mobilenumber });

    if (!user) {
      return res.status(409).json({ message: "User doesnot Exist please register first" })
    }

    //step no 2 compare the password 

    const passwordmatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordmatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    //step no 3 now generate the web token and send it to the frotnt end

    const token = jwt.sign(

      { userID: user._id }, //payload we send to the front end on login

      process.env.JWT_SECRET,  //secret key

      { expiresIn: "1h" }   // Expiration time

    )


    //save the value in the brower  when coming on that route 
    res.cookie("token", token, cookieOptions)  //it take 3 arguments key , value , object 

    // ✅ BEST PRACTICE - Convert to plain object first
    const userObject = user.toObject(); // Convert Mongoose document to plain object
    delete userObject.password; // Now safely delete password

    return res.status(200).json({ message: "login succesfully",  user: userObject ,token })


  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server Error" })

  }
}



export const searchmember = async (req, res) => {
  try {
    let { queryParam } = req.query;
    
    // ✅ Add validation for queryParam
    if (!queryParam || queryParam.trim() === '') {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await UserModel.find({
      $and: [
        { _id: { $ne: req.user._id } },  // ✅ Correct - exclude current user
        {
          $or: [
            { name: { $regex: new RegExp(`^${queryParam}`, 'i') } },
            { mobilenumber: { $regex: new RegExp(`^${queryParam}`, 'i') } } // ✅ Fixed field name
          ]
        }
      ]
    });

    // ✅ CORRECT: Use 200 for successful GET responses
    res.status(200).json(users);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
}



export const Logout = async (req, res) => {

  try {

    res.clearCookie('token', cookieOptions).json({message: 'Logged out succesfully'})

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" })
  }

}




