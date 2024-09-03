const express = require('express');
const dotenv = require('dotenv');
const { router } = require('./routes/user.router');
const { serverListeningMessage } = require('./constants');

const app = express();

dotenv.config();
const PORT = process.env.PORT

app.use(express.json());

app.use('/user', router);

app.listen(PORT, () => {
    console.log(`${serverListeningMessage} ${PORT}`);
});


module.exports = { app }