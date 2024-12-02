import path from "path";
import mongoose from "mongoose";
import Verification from "../models/emailVerification.js";
import Users from "../models/userModel.js";
import { compareString } from "../utils/index.js";

const __dirname = path.resolve(path.dirname(""));

export const verifyEmail = async (req, res) => {
  const { userId, token } = req.params;
  console.log(__dirname)

  try {
    const result = await Verification.findOne({ userId });

    if (result) {
      const { expiresAt, token: hashedToken } = result;

      if (expiresAt < Date.now()) {
        await Verification.findOneAndDelete({ userId });
        await Users.findOneAndDelete({ _id: userId });

        return res.sendFile(
          path.join(__dirname, "./views", "verification-failed.html")
        );
      }

      // Compare tokens
      const isMatch = await compareString(token, hashedToken);

      if (isMatch) {
        // Update user verification status
        await Users.findOneAndUpdate({ _id: userId }, { verified: true });
        await Verification.findOneAndDelete({ userId });

        // Redirect to the success page
        return res.redirect("/users/verified");
      } else {
        // Invalid token
        return res.sendFile(
          path.join(__dirname, "./views", "verification-failed.html")
        );
      }
    } else {
      // Invalid verification link
      return res.sendFile(
        path.join(__dirname, "./views", "verification-failed.html")
      );
    }
  } catch (error) {
    console.log(error);

    // Send the failure page for unexpected errors
    return res.sendFile(
      path.join(__dirname, "./views", "verification-failed.html")
    );
  }
};
