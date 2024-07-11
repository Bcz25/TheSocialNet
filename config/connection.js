const {connect, connection} = require('mongoose');

connect('mongodb://localhost:27017/TheSocialNetwork');

module.exports = connection;