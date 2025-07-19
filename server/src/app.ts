import express from 'express';
import exportRoutes from './routes/exportRoutes';
import importRoutes from './routes/importRoutes'
import cleanUpRoutes from './routes/cleanUpRoutes'
import errorHandler from './middlewares/errorHandler';
import path from 'path';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5173', // Allow Vite dev server
  credentials: true
}));

app.use('/api/export', exportRoutes);
app.use('/exports', express.static(path.join(__dirname, '..', 'exports')));
app.use('/api/import', importRoutes)
app.use('/api/cleanup', cleanUpRoutes)

app.get('/api/test', (req, res) => {
  res.send('Backend is working!');
});

app.use(errorHandler);

export default app;
