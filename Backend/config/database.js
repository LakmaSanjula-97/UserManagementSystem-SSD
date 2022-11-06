require("dotenv").config();

module.exports = {
    database: process.env.APP_DB,
    secret: process.env.APP_SECRET
};

// module.exports = {
//     database: 'mongodb+srv://Lakma:lsg123@mongo.gxd3nr4.mongodb.net/usermk_db?retryWrites=true&w=majority',
//     secret: 'yoursecret'
// };
