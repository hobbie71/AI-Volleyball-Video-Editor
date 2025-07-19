import { Router } from 'express';
import { handleImport } from '../controllers/importController';
import mime from 'mime-types'
import multer from 'multer';
import path from 'path';

// Store videos in /server/videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null ,path.join(__dirname, '..', '..', 'videos'));
  },
  filename: (req, file, cb) => {
    const ext = "." + mime.extension(file.mimetype)
    cb(null, file.originalname + ext);
  },
});

const upload = multer({ storage });

const router = Router();

router.post('/', upload.single('video'), handleImport);

export default router;