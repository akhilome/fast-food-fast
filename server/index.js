import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import router from './routes/routes';

dotenv.config();
const app = express();

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome. API is live at /api/v1/',
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', router);

app.listen(process.env.PORT);

export default app;
