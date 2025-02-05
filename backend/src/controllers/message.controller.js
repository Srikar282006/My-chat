import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "cloudinary"
import { getReceiverSocketId,io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (err) {
        console.log("Error in getUsersForSidebar:", err.message);
        res.status(500).json({ err: "Internal Server Error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId }
            ],
        });
        res.status(200).json(messages);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ err: "Internal Error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();
        // TODO: Realtime functionality goes here => socket.io
          const receiverSocketId=getReceiverSocketId(receiverId);
          if(receiverSocketId){
            io.to(receiverSocketId).emit("new Message",newMessage);//it is used to send to one user
          }


        res.status(201).json({ newMessage });
    } catch (error) {
        res.status(501).json({ error: "Internal Error" });
    }
};