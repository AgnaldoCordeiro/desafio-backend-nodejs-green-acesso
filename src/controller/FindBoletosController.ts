import { Request, Response } from "express";
import { prisma } from "../prisma";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { Prisma } from "@prisma/client";

export class FindBoletosController {
  async handle(request: Request, response: Response) {
    try {
      const { nome, valor_inicial, valor_final, id_lote, relatorio } =
        request.query;

      const filters: Prisma.BoletosWhereInput = {};

      if (relatorio === "1") {
        const boletos = await prisma.boletos.findMany();

        // Cria um novo documento PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();

        // Define as configurações da fonte e do tamanho do texto
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 12;

        // Cria um cabeçalho para a tabela
        const headerText =
          "id | nome_sacado | id_lote | valor | linha_digitavel";
        page.drawText(headerText, {
          x: 50,
          y: page.getHeight() - 50,
          font,
          size: fontSize,
        });

        // Cria as linhas da tabela com os dados dos boletos
        let y = page.getHeight() - 70;
        boletos.forEach((boleto) => {
          const rowData = `${boleto.id} | ${boleto.nome_sacado} | ${boleto.id_lote} | ${boleto.valor} | ${boleto.linha_digitavel}`;
          page.drawText(rowData, {
            x: 50,
            y,
            font,
            size: fontSize,
          });
          y -= 20;
        });

        // Converte o documento PDF para base64
        const pdfBytes = await pdfDoc.save();
        const base64 = Buffer.from(pdfBytes).toString("base64");

        // Retorna o resultado no formato esperado
        response.json({ base64 });
      } else {
        if (nome) {
          filters.nome_sacado = { contains: nome as string };
        }

        if (valor_inicial) {
          filters.valor = { gte: parseInt(valor_inicial as string, 10) };
        }

        if (valor_final) {
          filters.valor = {
            ...(filters.valor as object),
            lte: parseInt(valor_final as string, 10),
          };
        }

        if (id_lote) {
          filters.id_lote = { equals: parseInt(id_lote as string, 10) };
        }

        const boletos = await prisma.boletos.findMany({ where: filters });

        response.json(boletos);
      }
    } catch (error) {
      console.error(error);
      response
        .status(500)
        .json({ error: "Ocorreu um erro ao buscar os boletos." });
    }
  }
}
