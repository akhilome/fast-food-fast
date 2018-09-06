import express from 'express';
import router from './routes/routes';

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome',
  });
});

app.use('/api/v1', router);

app.listen(3000);

export default app;
