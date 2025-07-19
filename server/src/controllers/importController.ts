import { Request, Response, NextFunction } from 'express';

export const handleImport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  res.status(200).json({
    ok: true,
    message: 'Upload successful',
    videoID: req.file.filename,
    filename: req.file.filename,
    originalname: req.file.originalname,
  });
};