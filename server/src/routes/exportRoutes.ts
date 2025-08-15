import { Router, Request, Response } from 'express';
import { exportVideo } from '../controllers/exportController';
import { validateExportRequest } from '../middlewares/validation';

const router = Router();

router.post("/", validateExportRequest, exportVideo);

export default router;
