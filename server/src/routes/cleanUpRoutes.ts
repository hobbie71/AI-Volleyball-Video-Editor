import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

router.post('/', (req, res) => {
  const videosDir = path.join(__dirname, '..', '..', 'videos');
  try {
    if (fs.existsSync(videosDir)) {
      fs.readdirSync(videosDir).forEach((file) => {
        const curPath = path.join(videosDir, file);
        fs.rmSync(curPath, { recursive: true, force: true });
      });
    }
    res.json({ ok: true, message: 'All contents in videos folder deleted' });
  } catch (err) {
    console.error("Cleanup error: ", err)
    res.status(500).json({ error: 'Failed to clean videos directory' });
  }
});

export default router;