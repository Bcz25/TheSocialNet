const {User} = require('../models');

module.exports = {
    // get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err)
      console.log(err); 
    }
  },
    // get one user by its _id
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
    // update a user by its _id
    async updateUser(req, res) {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $set : req.body },
          { new: true }
        );
        res.json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // delete a user by its _id and delete all thoghts from the user
    async deleteUser(req, res) {
      try {
        const deletedUser = await User.findOneAndDelete({ _id: req.params.userId });
        res.json(deletedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // add a new friend to a user's friend list
    async addFriend(req, res) {
      try {
        const updatedUser = await User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true });
        res.json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // remove a friend from a user's friend list
    async removeFriend(req, res) {
      try {
        const updatedUser = await User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true });
        res.json(updatedUser);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
};
