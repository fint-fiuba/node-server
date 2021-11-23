const express = require('express');
const app = express();
const routes = require('./routes')

app.set('view engine', 'pug');
app.use('/', routes())

app.listen(3000);