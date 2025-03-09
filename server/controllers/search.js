import Users from "../models/userModel.js";
import Posts from "../models/postModel.js";

export const basicSearch = async (req, res) => {
    const { query } = req.query;
    const { userId } = req.body.user;
  
    if (!query) {
      return res.status(400).json({ message: 'Query string is required in body' });
    }
  
    try {
      const users = await Users.find({
        $or: [
            { firstName: { $regex: query, $options: 'i' } },  
            { lastName: { $regex: query, $options: 'i' } }   
          ],
          _id: { $ne: userId }   
      });

      const posts = await Posts.find({
        description: { $regex: query, $options: 'i' },
        userId: { $ne: userId }
      }).populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 });

      return res.json({
        sucess: true,
      message: "successfully",
      data: {
        users,
        posts,
      },
      });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }