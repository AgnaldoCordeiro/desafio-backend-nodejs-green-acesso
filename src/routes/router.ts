import express, { Request, Response } from "express";
import multer from "multer";
import {
  FindBoletosController,
  ImportCSVController,
  ImportPDFController,
} from "../controller";

export const routes = express.Router();

const importCSVController = new ImportCSVController();
const importPDFController = new ImportPDFController();
const findBoletosController = new FindBoletosController();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Pasta onde os arquivos PDF serão armazenados
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Usar o nome original do arquivo PDF
  },
});

const multerConfig = multer();
const upload = multer({ storage });

routes.get("/boletos", findBoletosController.handle);
routes.post("/import/csv", multerConfig.single("file"), importCSVController.handle);
routes.post("/import/pdf", upload.single("pdf"), importPDFController.handle);
