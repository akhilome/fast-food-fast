import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import router from './routes/routes';
import authRouter from './routes/authRouter';

dotenv.config();
const app = express();

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome. API is live at /api/v1/',
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1', router);
// Auth routes
app.use('/api/v1/auth/', authRouter);

app.listen(process.env.PORT);

export default app;
