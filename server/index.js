import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/routes';

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome',
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1', router);

app.listen(3000);

export default app;
