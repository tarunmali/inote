const connect = require('./db');
const express = require('express');
const cors = require('cors');
require("dotenv").config();
connect();

const app = express();
const port = 80;

app.use(cors());
app.use(express.json());
app.get('/', function (req, res) {
 res.send("Hello World")
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(process.env.PORT || 80, () => {
  console.log(`iNotebook listening on port`)
});
