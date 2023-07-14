# Sistema de Importação e Exportação de Boletos

Este projeto é um sistema desenvolvido em Node.js utilizando TypeScript, Prisma e um banco de dados SQL para importar boletos em formato CSV, realizar o mapeamento dos lotes e gerar um relatório. Ele também oferece endpoints para visualizar e filtrar os boletos.

## Funcionalidades

Importação de boletos a partir de um arquivo CSV
Mapeamento dos lotes dos boletos com base em um arquivo externo
Geração de arquivos PDF com os boletos importados
Visualização e filtragem dos boletos através de endpoints REST

## Pré-requisitos

Node.js (versão 18.16.0)

## Configuração

Clone o repositório: git clone https://github.com/agnaldocordeiro/nome-do-repositorio.git
Instale as dependências: npm install
Configure as variáveis de ambiente no arquivo .env com a informação: DATABASE_URL="file:./dev.db"

Inicie o Servidor: npm run dev
Visualizar o Banco de Dados: npm run prisma:studio

## Endpoints
### Importação de Boletos
### POST /importar/csv

Endpoint responsável por importar boletos a partir de um arquivo CSV enviado no corpo da requisição.

## Mapeamento dos Lotes
### POST /importar/pdf

Endpoint responsável por realizar o mapeamento dos lotes dos boletos com base em um arquivo externo enviado no corpo da requisição.

### Geração de Relatório em PDF
### GET /boletos?relatorio=1

Endpoint para obter um relatório em formato PDF com os boletos importados. Retorna o relatório em formato base64.

## Visualização dos Boletos
### GET /boletos

Endpoint para obter a lista de boletos importados. Pode conter parâmetros de filtro, como nome, valor_inicial, valor_final e id_lote.
