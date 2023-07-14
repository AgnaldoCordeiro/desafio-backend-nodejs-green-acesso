import { Request, Response } from "express";
import { EOL } from "os";
import * as csv from "fast-csv";
import { Readable } from "stream";
import { prisma } from "../prisma";

// Interface para representar os dados do CSV
interface IDados {
  nome: string;
  unidade: string;
  valor: number;
  linha_digitavel: string;
}

// Conteúdo do CSV como uma string
const CSV_STRING = ["nome;unidade;valor;linha_digitavel"].join(EOL);

export class ImportCSVController {
  async handle(request: Request, response: Response) {
    const { file } = request;
    const { buffer }: any = file;

    // Criação de um Readable Stream com o buffer do arquivo
    const readableFile = new Readable();
    readableFile.push(buffer);
    readableFile.push(null);

    // Configuração do parser do CSV
    const stream = csv
      .parseStream(readableFile, {
        headers: ["nome", "unidade", "valor", "linha_digitavel"], // Definição dos cabeçalhos das colunas
        delimiter: ";", // Delimitador do CSV
        quote: '"', // Caractere usado para citar valores
        renameHeaders: true, // Renomeia as colunas para remover espaços em branco e caracteres especiais
      })
      .on("data", async function (data: IDados) {
        // Evento que é disparado para cada linha do CSV

        // Busca o ID do lote com base na unidade
        const buscaId = await prisma.lotes.findFirst({
          where: {
            nome_lote: parseInt(data.unidade.toString()),
          },
        });

        if (buscaId) {
          // Cria um novo boleto com os dados do CSV e o ID do lote correspondente
          await prisma.boletos.create({
            data: {
              nome_sacado: data.nome,
              valor: parseFloat(data.valor.toString()), // Convertido para número e depois para decimal
              linha_digitavel: data.linha_digitavel,
              ativo: true,
              id_lote: buscaId.id,
            },
          });
        }
      })
      .on("end", (rowCount: number) => console.log(`Parsed ${rowCount} rows`)); // Evento que é disparado quando a leitura do CSV é concluída

    stream.write(CSV_STRING); // Escreve o conteúdo do CSV no stream de leitura
    return response.send(); // Retorna uma resposta vazia para indicar o sucesso do processo
  }
}
