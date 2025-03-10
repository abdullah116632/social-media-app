import path from "path";
import mongoose from "mongoose";
import Verification from "../models/emailVerification.js";
import Users from "../models/userModel.js";
import { compareString, createJWT, hashString } from "../utils/index.js";
import PasswordReset from "../models/passwordReset.js";
import { resetPasswordLink } from "../utils/sendEmail.js";
import FriendRequest from "../models/friendRequest.js";

const __dirname = path.resolve(path.dirname(""));

export const verifyEmail = async (req, res) => {
  const { userId, token } = req.params;

  try {
    const result = await Verification.findOne({ userId });

    if (!result) {
      const message = "Invalid verification link.";
      return res.redirect(`/users/verified?status=error&message=${message}`);
    }

    const { expiresAt, token: hashedToken } = result;

    // Check if the token has expired
    if (expiresAt < Date.now()) {
      try {
        await Verification.findOneAndDelete({ userId });
        await Users.findOneAndDelete({ _id: userId });

        const message =
          "Verification token has expired. Please register again.";
        return res.redirect(`/users/verified?status=error&message=${message}`);
      } catch (error) {
        console.error("Error deleting expired verification:", error);
        return res.redirect(`/users/verified?status=error&message=`);
      }
    }

    // Token is valid, verify it
    const isMatch = await compareString(token, hashedToken);

    if (!isMatch) {
      const message =
        "Invalid verification token. Please check your email and try again.";
      return res.redirect(`/users/verified?status=error&message=${message}`);
    }

    try {
      await Users.findOneAndUpdate({ _id: userId }, { verified: true });

      // Delete verification record after success
      await Verification.findOneAndDelete({ userId });

      const message = "Your email has been successfully verified!";
      return res.redirect(`/users/verified?status=success&message=${message}`);
    } catch (error) {
      console.error("Error updating user verification status:", error);
      const message = "Verification process failed. Please try again later.";
      return res.redirect(`/users/verified?status=error&message=${message}`);
    }
  } catch (error) {
    console.error("Verification error:", error);
    const message = "An unexpected error occurred. Please try again later.";
    return res.redirect(`/users/verified?status=error&message=${message}`);
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "Email address not found.",
      });
    }

    const existingRequest = await PasswordReset.findOne({ email });
    if (existingRequest) {
      if (existingRequest.expiresAt > Date.now()) {
        return res.status(201).json({
          status: "PENDING",
          message: "Reset password link has already been sent tp your email.",
        });
      }
      await PasswordReset.findOneAndDelete({ email });
    }
    await resetPasswordLink(user, res);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { id: userId, token, password } = req.body;

  try {
    // find record
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid password reset link. Try again",
      });
    }

    const resetPassword = await PasswordReset.findOne({ userId });

    if (!resetPassword) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid password reset link. Try again",
      });
    }

    const { expiresAt, token: storedResetToken } = resetPassword;

    if (expiresAt < Date.now()) {
      return res.status(400).json({
        status: "failed",
        message: "Reset Password link has expired. Please try again",
      });
    }
    const isMatch = await compareString(token, storedResetToken);

    if (!isMatch) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid reset password link. Please try again",
      });
    }

    let hashedPassword;
    try {
      hashedPassword = await hashString(password);
    } catch (error) {
      return res
        .status(500)
        .json({
          status: "failed",
          message: "Error hashing password. Please try again.",
        });
    }
    user.password = hashedPassword;

    const savedUser = await user.save();

    if (savedUser) {
      await PasswordReset.findOneAndDelete({ userId });

      const token = createJWT(user?._id);

      res.status(201).json({
        success: true,
        message: "Password reset successfully. You can now log in.",
        user,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// export const changePassword = async (req, res, next) => {
//   try {
//     const { userId, password } = req.body;
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ message: error.message });
//   }
// };

export const getUser = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;

    const user = await Users.findById(id ?? userId).populate({
      path: "friends",
      select: "-password",
    });

    if (!user) {
      return res.status(200).send({
        message: "User Not Found",
        success: false,
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, location, profileUrl, profession } = req.body;

    if (!(firstName || lastName || contact || profession || location)) {
      next("Please provide all required fields");
      return;
    }

    const { userId } = req.body.user;

    const updateUser = {
      firstName,
      lastName,
      location,
      profileUrl,
      profession,
      _id: userId,
    };
    const user = await Users.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });

    await user.populate({ path: "friends", select: "-password" });
    const token = createJWT(user?._id);

    user.password = undefined;

    res.status(200).json({
      sucess: true,
      message: "User updated successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const friendRequest = async (req, res, next) => {
  try {
    const { userId } = req.body.user;

    const { requestTo } = req.body;

    const requestExist = await FriendRequest.findOne({
      requestFrom: userId,
      requestTo,
    });

    if (requestExist) {
      next("Friend Request already sent.");
      return;
    }

    const accountExist = await FriendRequest.findOne({
      requestFrom: requestTo,
      requestTo: userId,
    });

    if (accountExist) {
      next("Friend Request already sent.");
      return;
    }

    const newRes = await FriendRequest.create({
      requestTo,
      requestFrom: userId,
    });

    res.status(201).json({
      success: true,
      message: "Friend Request sent successfully",
      data: newRes
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

export const getFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body.user;

    const request = await FriendRequest.find({
      requestTo: userId,
      requestStatus: "Pending",
    })
      .populate({
        path: "requestFrom",
        select: "firstName lastName profileUrl profession -password",
      })
      .limit(10)
      .sort({
        _id: -1,
      });

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

export const acceptRequest = async (req, res, next) => {
  try {
    const id = req.body.user.userId;

    const { rid, status } = req.body;

    const requestExist = await FriendRequest.findById(rid);

    if (!requestExist) {
      next("No Friend Request Found.");
      return;
    }

    const newRes = await FriendRequest.findByIdAndUpdate(
      { _id: rid },
      { requestStatus: status }
    );

    if (status === "Accepted") {
      const user = await Users.findById(id);

      user.friends.push(newRes?.requestFrom);

      await user.save();

      const friend = await Users.findById(newRes?.requestFrom);

      friend.friends.push(newRes?.requestTo);

      await friend.save();
    }

    res.status(201).json({
      success: true,
      message: "Friend Request " + status,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

export const profileViews = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.body;

    const user = await Users.findById(id);

    user.views.push(userId);

    await user.save();

    res.status(201).json({
      success: true,
      message: "Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

export const suggestedFriends = async (req, res) => {
  try {
    const { userId } = req.body.user;

    const friendRequests = await FriendRequest.find({ requestFrom: userId }).select("requestTo");
    
    const requestedUserIds = friendRequests.map(request => request.requestTo);

    let queryObject = { _id: { $ne: userId } }

    queryObject._id = { $ne: userId, $nin: requestedUserIds };
    queryObject.friends = { $nin: userId };


    let queryResult = Users.find(queryObject)
      .limit(15)
      .select("firstName lastName profileUrl profession -password");

    const suggestedFriends = await queryResult;

    res.status(200).json({
      success: true,
      data: suggestedFriends,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getRequestedFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body.user;

    const request = await FriendRequest.find({
      requestFrom: userId,
      requestStatus: "Pending",
    })
      .populate({
        path: "requestFrom",
        select: "firstName lastName profileUrl profession -password",
      })
      .limit(10)
      .sort({
        _id: -1,
      });

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
}

export const cancelFriendRequest = async (req, res) => {
  try{
    const { userId } = req.body.user;
    const { requestTo } = req.body;

    const deletedRequest = await FriendRequest.findOneAndDelete({
      requestFrom: userId,
      requestTo,
    });

    if (!deletedRequest) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found or already canceled.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Friend request canceled successfully.",
    });
  }catch(e){
    res.status(500).json({
      success: false,
      message: "Error canceling friend request.",
      error: error.message,
    });
  }
}
