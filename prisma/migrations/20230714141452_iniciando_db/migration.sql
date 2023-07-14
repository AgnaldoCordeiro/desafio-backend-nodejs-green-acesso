-- CreateTable
CREATE TABLE "lotes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "nome_lote" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "boletos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_sacado" TEXT NOT NULL,
    "id_lote" INTEGER NOT NULL,
    "valor" DECIMAL NOT NULL,
    "linha_digitavel" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "boletos_id_lote_fkey" FOREIGN KEY ("id_lote") REFERENCES "lotes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "lotes_nome_lote_key" ON "lotes"("nome_lote");

-- CreateIndex
CREATE INDEX "lotes_nome_lote_idx" ON "lotes"("nome_lote");
