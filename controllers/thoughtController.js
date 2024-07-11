const {Thought, User} = require('../models');

module.exports = {
    // get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // get one thought by its _id
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // create a new thought and push to the associated user's thoughts array field
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const newThought = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: thought._id } },
                { new: true }
            );
            res.json(newThought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // update a thought by its _id
    async updateThought(req, res) {
        try {
            const updatedThought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { new: true }
            );
            res.json(updatedThought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // delete a thought by its _id
    async deleteThought(req, res) {
        try {
            const thoughtId = req.params.thoughtId;
            // Assuming you have a way to identify the user (e.g., userId in params or session); 
    
            // Delete the thought
            const thought = await Thought.findById({ _id: thoughtId });
            if (!thought) {
                return res.status(404).json({ message: "Thought not found" });
            }
            const userName = thought.username;
            const deletedThought = await Thought.findOneAndDelete({ _id: thoughtId });
            // Remove the thought from the user's thoughts array
            await User.findOneAndUpdate(
                { username: userName},
                { $pull: { thoughts: thoughtId } },
                { new: true } // Returns the document after update was applied
            );
            res.json(deletedThought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // add a new reaction to a thought's reactions array field
    async addReaction(req, res) {
        try {
            const updatedThought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: { reactions: req.body } },
                { new: true }
            );
            res.json(updatedThought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // delete a reaction from a thought's reactions array field
    async deleteReaction(req, res) {
        try {
            const updatedThought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { new: true }
            );
            res.json(updatedThought);
        } catch (err) {
            res.status(500).json(err);
        }
    }
};