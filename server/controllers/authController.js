// import dotenv from "dotenv";
// dotenv.config();
import cloudinary from "../config/cloudinaryConfig.js";
import Users from "../models/userModel.js";
import { compareString, createJWT, hashString } from "../utils/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  //validate fileds
  if (!(firstName || lastName || email || password)) {
    next("Provide Required Fields!");
    return;
  }

  try {
    const userExist = await Users.findOne({ email });
  
    if (userExist) {
      next("Email Address already exists");
      return;
    }

    const hashedPassword = await hashString(password);

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    //send email verification to user
    sendVerificationEmail(user, res);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //validation
    if (!email || !password) {
      next("Please Provide User Credentials");
      return;
    }

    // find user by email
    const user = await Users.findOne({ email }).select("+password").populate({
      path: "friends",
      select: "firstName lastName location profileUrl -password",
    });

    if (!user) {
      next("Invalid email or password");
      return;
    }

    if (!user?.verified) {
      next(
        "User email is not verified. Check your email account and verify your email"
      );
      return;
    }

    // compare password
    const isMatch = await compareString(password, user?.password);

    if (!isMatch) {
      next("Invalid email or password");
      return;
    }

    user.password = undefined;

    const token = createJWT(user?._id);

    res.status(201).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({success: false, message: error.message });
  }
};

export const generateSignature = async (req, res, next) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000); // Cloudinary requires a timestamp

    const paramsToSign = {
      folder: "socialmedia/uploads",
      timestamp: timestamp,
      upload_preset: "socialmedia",  // ✅ Ensure this is included
    };

    // const stringToSign = `folder=${params.folder}&timestamp=${params.timestamp}&upload_preset=${params.upload_preset}`;
    // console.log("String to Sign:", stringToSign);

    console.log("api secret", process.env.CLOUDINARY_API_SECRET)
    
    // Generate the signature using Cloudinary's API method
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign, 
      process.env.CLOUDINARY_API_SECRET
    );

    console.log("Generated Signature:", signature);
    // Respond with the signature and timestamp
    res.json({
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,  // ✅ Include API key
    });
  } catch (error) {
    console.error("Signature Generation Error:", error);
    res.status(500).json({ message: 'Error generating signature' });
  }
}

// export const generateSignature = async (req, res, next) => {
//   const { folder } = req.body; // Get additional parameters from frontend
  
//   const params = {
//     timestamp: Math.round(Date.now() / 1000),
//     upload_preset: process.env.UPLOAD_PRESET,
//     folder: folder || '' // Include folder parameter if present
//   };

//   // Remove undefined/null parameters
//   Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

//   // Sort parameters alphabetically (IMPORTANT!)
//   const sortedParams = Object.keys(params)
//     .sort()
//     .reduce((acc, key) => {
//       acc[key] = params[key];
//       return acc;
//     }, {});

//     try {
//       const signature = cloudinary.utils.api_sign_request(
//         sortedParams,
//         process.env.API_SECRET
//       );
  
//       res.json({
//         ...sortedParams,
//         signature,
//         api_key: process.env.API_KEY
//       });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
// }