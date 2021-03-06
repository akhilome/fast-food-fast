import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import authRouter from './routes/authRouter';
import ordersRouter from './routes/ordersRouter';
import menuRouter from './routes/menuRouter';

dotenv.config();
const app = express();

// Enable CORS
app.use(cors());

// Serve ui templates
app.use(express.static('ui'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Orders routes
app.use('/api/v1', ordersRouter);

// Auth routes
app.use('/api/v1/auth', authRouter);

// Menu routes
app.use('/api/v1/menu', menuRouter);

// Catch all unassigned routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'no route has been assigned to that URL',
  });
});

app.listen(process.env.PORT);

export default app;
