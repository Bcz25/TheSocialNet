const connection = require('../config/connection');
const { User, Thought} = require('../models');
const {users, thoughts} = require('./data');

console.time('seedTime');

connection.once('open', async () => {
    await User.deleteMany({});
    await Thought.deleteMany({});

    // Insert users and store their IDs
    const insertedUsers = await User.insertMany(users);
    const userMap = new Map();
    insertedUsers.forEach(user => {
        userMap.set(user.username, user._id);
    });

    // Adjust thoughts to include user _id references
    const adjustedThoughts = thoughts.map(thought => ({
        ...thought,
        username: [userMap.get(thought.username)] // Adjust to use ObjectId
        // Optionally add reactions here if needed
    }));

    await Thought.insertMany(adjustedThoughts);

    console.log('Database seeded!');
    connection.close();
});