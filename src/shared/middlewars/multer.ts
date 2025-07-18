import multer from "multer";
import path from "path";
import os from "os";
import { Request, Response } from "express";

const storage = multer.diskStorage({
    destination: os.tmpdir(),
    filename: (req, file, cb) => {
        cb(null, Date.now + path.extname(file.originalname)); // nome único
    },
});

// tipos permitidos
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'application/pdf',
  'video/quicktime',
  'video/x-matroska', // <-- adiciona suporte a .mkv
  'video/x-msvideo',  // <-- se quiser .avi
];

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);

    } else {
        cb(new Error("Tipo de arquivo não permitido: " + file.mimetype));
    }
}

const upload = multer({ storage, fileFilter });

export default upload;