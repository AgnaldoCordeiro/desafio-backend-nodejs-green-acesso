import { Request, Response } from "express";

import fs from "fs";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { prisma } from "../prisma";

// Definindo o local do arquivo do worker para o pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.js";

export class ImportPDFController {
  async handle(request: Request, response: Response) {
    if (!request.file) {
      return response
        .status(400)
        .json({ error: "Nenhum arquivo PDF enviado." });
    }

    const { path } = request.file;

    try {
      // Buscar todos os boletos na tabela
      const boletos = await prisma.boletos.findMany();

      // Carregar o arquivo PDF usando a biblioteca pdf-lib
      const pdfDoc = await PDFDocument.load(fs.readFileSync(path));
      const boletosPages = pdfDoc.getPages();

      // Verificar se o número de boletos no PDF corresponde ao número de registros na tabela
      if (boletos.length !== boletosPages.length) {
        return response
          .status(400)
          .json({
            error:
              "O número de boletos no PDF não corresponde ao número de registros na tabela.",
          });
      }

      // Iterar sobre cada boleto
      for (let i = 0; i < boletos.length; i++) {
        const boleto = boletos[i];
        const page = boletosPages[i];

        // Criar um novo documento PDF para cada boleto
        const boletoDoc = await PDFDocument.create();
        const newPage = await boletoDoc.copyPages(pdfDoc, [i]);
        boletoDoc.addPage(newPage[0]);

        // Gerar o nome do arquivo usando o ID do boleto
        const filename = `${boleto.id}.pdf`;
        const outputPath = `boletos/${filename}`;

        // Salvar o arquivo PDF separado
        fs.writeFileSync(outputPath, await boletoDoc.save());
      }

      // Responder com uma mensagem de sucesso
      response
        .status(200)
        .json({ message: "Boletos processados com sucesso!" });
    } catch (error) {
      console.error(error);
      response
        .status(500)
        .json({ error: "Ocorreu um erro ao processar os boletos." });
    }
  }
}
