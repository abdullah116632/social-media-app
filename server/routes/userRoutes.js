import express from "express";
import path from "path";
import { acceptRequest,  friendRequest, getFriendRequest, getUser, profileViews, requestPasswordReset, resetPassword, suggestedFriends, updateUser, verifyEmail, getRequestedFriendRequest, cancelFriendRequest } from "../controllers/userController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();
const __dirname = path.resolve(path.dirname(""));

router.get("/verify/:userId/:token", verifyEmail);

router.post("/request-passwordreset", requestPasswordReset);
router.post("/reset-password", resetPassword);
// router.post("/reset-password", changePassword);

// user routes
router.post("/get-user/:id?", userAuth, getUser);
router.put("/update-user", userAuth, updateUser);

// friend request
router.post("/friend-request", userAuth, friendRequest);
router.post("/get-friend-request", userAuth, getFriendRequest);
router.post("/get-requested-friend-request", userAuth, getRequestedFriendRequest)
router.post("/cancel-friend-request", userAuth, cancelFriendRequest);

// accept / deny friend request
router.post("/accept-request", userAuth, acceptRequest);

// view profile
router.post("/profile-view", userAuth, profileViews);

//suggested friends
router.post("/suggested-friends", userAuth, suggestedFriends);

router.get("/verified", (req, res) => {
    res.sendFile(path.join(__dirname, "./views", "index.html"));
});
// router.get("/resetpassword", (req, res) => {
//     res.sendFile(path.join(__dirname, "./views", "index.html"));
//   });

export default router;