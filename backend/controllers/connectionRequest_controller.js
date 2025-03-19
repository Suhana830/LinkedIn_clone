import ConnectionRequest from "../models/connectionRequest_model.js";
import Notification from "../models/notification.js";
import User from "../models/user_model.js";


export const sendConnectionRequest = async (req, res) => {

    try {
        const { userId } = req.params;
        const senderId = req.user._id;

        if (senderId.toString === userId)
            return res.status(400).json({ message: "you can't send a request to yourself" });

        if (req.user.connection.inclues(userId))
            return res.status(400).json({ message: "you are already connected" });

        const existingRequest = await ConnectionRequest.findOne({ sender: senderId, recipient: userId, status: "pending" });

        if (existingRequest)
            return res.status(400).json({ message: "A connection request already exists " });

        const newRequest = new ConnectionRequest({
            sender: senderId,
            recipient: userId,

        });

        await newRequest.save();

        return res.status(200).json({ message: "connections requestion send succesfully" });

    } catch (error) {
        res.status(500).json({ error: "server Error in sending connection request" })
    }
}

export const acceptConnectionRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await ConnectionRequest.findById(requestId)
            .populate("sender", "name email username")
            .populate("recipient", "name username");

        if (!request)
            return res.status(404).json({ message: "connection request not found" });

        if (request.recipient.toString() !== userId.toString())
            return res.status(403).json({ message: "not authorized to accept this connection request" });

        if (request.status !== "pending")
            return res.status(400).json({ message: "this connection request has already been processed" });

        request.status = "accepted";
        await request.save();

        //if i am ur  frnd then u also my frnd
        await User.findByIdAndUpdate(req.sender._id, { $addToSet: { connections: userId } });
        await User.findByIdAndUpdate(userId, { $addToSet: { connections: request.sender._id } });

        const notification = new Notification({
            recipient: request.sender._id,
            relatedUser: userId,
            type: "connectionAccepted",



        })
        return res.status(200).json({ message: "request accepted" });

        const senderEmail = request.sender.email;
        const senderName = request.sender.name;
        const recipientName = request.recipient.name;
        const profileUrl = process.env.CLIENT_URL + "/profile/" + request.recipient.username;

        try {
            await sendConnectionAcceptedEmail(senderEmail, senderName, recipientName, profileUrl);

        } catch (error) {
            console.log("error in sending accepting msg ", error);

        }
    } catch (error) {
        res.status(500).json({ error: "server Error in accepting connection request" })
    }
}

export const rejectConnectionRequest = async (req, res) => {

    try {

        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await ConnectionRequest.findById(requestId);

        if (request.recipient.toString() != userId.toString())
            return res.status(403).json({ message: "Not authorized to regect this request" });

        if (request.status !== pending)
            return res.status(400).json({ message: "This request has already been processed" });

        request.status = "rejected";
        await request.save();

        return res.status(200).json({ message: "Connection request rejected" });

    } catch (error) {
        res.status(500).json({ error: "server Error in reject request" })
    }

}

export const getConnectionRequests = async (req, res) => {
    try {


        const userId = req.user._id;

        let requests = await ConnectionRequest.find({ recipient: userId, status: "pending" }).populate("sender", "name username profilePicture headline connections");


        res.json(requests);

    } catch (error) {
        res.status(500).json({ error: "server Error in get connection request" })

    }
}

export const getUserConnections = async (req, res) => {
    try {

        const userId = req.user._id;

        const user = await User.findById(userId).populate("connections", "name username profilePicture headline connections");

        return res.json(user.connections);

    } catch (error) {
        res.status(500).json({ error: "server Error in get user connection request" })

    }

}

export const removeConnection = async (req, res) => {
    try {

        const myId = req.user._id;
        const { userId } = req.params;

        await User.findByIdAndUpdate(myId, { $pull: { connections: userId } });
        await User.findByIdAndUpdate(userId, { $pull: { connections: myId } });

        res.json({ message: "Connection removed successfully" });


    } catch (error) {

        res.status(500).json({ error: "server Error in remove Connection request" })

    }
}

export const getConnectionStatus = async (req, res) => {
    try {

        const targetUserId = req.params.userId;
        const currentUserId = req.user._id;

        const currentUser = req.user;
        if (currentUser.connections.includes(targetUserId)) {
            return res.json({ status: "connected" });
        }

        const pendingRequest = await ConnectionRequest.findOne({
            $or: [
                { sender: currentUserId, recipient: targetUserId },
                { sender: targetUserId, recipient: currentUserId }
            ],
            status: "pending"
        });

        if (pendingRequest) {
            if (pendingRequest.sender.toString() != currentUserId.toString()) {
                return res.json({ status: "pending" });
            }
            else {
                return res.json({ status: "received" });
            }
        }


    } catch (error) {

        res.status(500).json({ error: "server Error in get status request" })


    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const user_ = await User.findById(req.user._id).select("-password").populate("connections", "name headline username profilePicture");
        return res.status(200).json(user_);
    } catch (error) {
        res.status(401).json({ error: "server Error in getCurrent user request" })

    }
}

