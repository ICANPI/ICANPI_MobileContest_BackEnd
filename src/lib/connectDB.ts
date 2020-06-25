const mongoose = require('mongoose');

const MONGO_URL = process.env.DB_HOST || 'mongodb://localhost:27017/nodetemplate';
const env = process.env.NODE_ENV || 'development';

let mongoURL: any = MONGO_URL;
if (env !== 'production') mongoURL += `_${env}`;
if (env === 'development') {
    console.log("개발자 모드")
    mongoose.set('debug', true);
}
module.exports = () => mongoose.connect(mongoURL);