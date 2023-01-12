const express = require('express');
const app = express();
const port = 5000;


app.get('/', (req, res) => {
    res.send({ title: 'GeeksforGeeks' });
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});