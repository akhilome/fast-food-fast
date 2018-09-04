import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Working just fine!');
});

app.listen(3000);

export default app;
