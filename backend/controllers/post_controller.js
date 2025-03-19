import cloudinary from "../lib/cloudinary.js";
import Notification from "../models/notification.js";
import Post from "../models/post_model.js"

export const getFeedPosts = async (req, res) => {

    try {

        const posts = await Post.find({ author: { $in: req.user.connections } })
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name username profilePicture headline")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);

    } catch (error) {

        console.error("Error in getFeedPosts controller :", error);
        res.status(500).json({ message: "Server error" });

    }


}

export const createPost = async (req, res) => {

    try {
        const { content, image } = req.body;

        let newpost;
        if (image) {

            const result = await cloudinary.uploader.upload(image);
            newpost = new Post({
                author: req.user._id,
                content: content,
                image: result.secure_url

            });

        } else {
            newpost = new Post({
                author: req.user._id,
                content: content,


            });
        }

        await newpost.save();
        res.status(201).json(newpost)
    } catch (error) {
        console.error("Error in createPost controller :", error);
        res.status(500).json({ message: "Server error" });

    }
}

export const deletePost = async (req, res) => {
    try {

        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        if (post.author.toString() !== userId.toString())
            return res.status(403).json({ message: "you are not authorized to delete this post" });

        if (post.image) {
            return res.status(403).json({ message: "you are not authorized to delete this post" });
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: "Post delete successfully" })


    } catch (error) {

        console.error("Error in deletePost controller :", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getPostById = async (req, res) => {

    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).populate("author", "name,headline ,username,profilePicture").populate("comment.user", "name,headline ,username,profilePicture");
        if (!post)
            return res.status(403).json({ messge: "post not found" })

        return res.status(201).json(post);
    } catch (error) {


        console.error("Error in getPostById controller :", error);
        res.status(500).json({ message: "Server error" });

    }


}

export const createComment = async (req, res) => {
    try {

        const postId = req.params.id;
        const { content } = req.body;

        const post = await Post.findByIdAndUpdate(postId, { $push: { comment: { user: req.user.id, content } } }).populate("author", "name,headline ,username,profilePicture")

        if (post.author.toString() !== req.user._id.toString()) {
            const newNotification = new Notification({
                recipient: post.author,
                type: "comment",
                relatedUser: req.user._id,
                relatedPost: postId
            })

            await newNotification.save();

            try {
                const postUrl = process.env.CLIENT_URL + '/post' + postId;
                await sendCommentNotificationEmail(post.author.email, author.name, req.user.name, postUrl, content);
            }
            catch (error) {
                console.log("Error to send Email :", error);

            }
        }



        res.status(200).json(post);

    } catch (error) {
        console.error("Error in createComment controller :", error);
        res.status(500).json({ message: "Server error" });

    }
}

export const likePost = async (req, res) => {
    try {

        const postId = req.params.id;
        const post = await Post.findById(postId);
        const userId = req.user._id

        if (post.likes.includes(userId)) {
            //unlike post
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        }
        else {
            post.likes.push(userId);

            if (post.author.toString() != userId.toString()) {
                const newNotification = new Notification({
                    recipient: post.author,
                    type: "like",
                    relatedUser: userId,
                    relatedPost: postId
                });

                await newNotification.save();

            }
        }

    } catch (error) {
        console.error("Error in createComment controller :", error);
        res.status(500).json({ message: "Server error" });

    }
}