import { Router, Request, Response } from 'express';
import { exportVideo } from '../controllers/exportController';

const router = Router();

router.post("/", exportVideo);

export default router;
