import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome',
  });
});

app.listen(3000);

export default app;
