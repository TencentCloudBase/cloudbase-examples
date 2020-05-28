const express = require('express');
const app = express();

app.get('/', (req, res) => {
    console.log('Hello world received a request.');

    res.send(`Hello, Welcome to CloudBase!`);
});

const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log('Hello world listening on port', port);
});
