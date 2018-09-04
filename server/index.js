const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Working just fine!');
});

app.listen(3000, () => {
  console.log('App running on 3000');
});
