import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

const { Pool } = pg;

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    })
  : null;

// Verifica se a API está funcionando
app.get("/", (_req, res) => {
  res.json({
    message: "API do SheSafe funcionando!",
  });
});

// Rota de saúde para o Render
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "SheSafe API",
  });
});

// Verifica a conexão com o PostgreSQL
app.get("/api/db-test", async (_req, res) => {
  if (!pool) {
    res.status(503).json({
      status: "error",
      message: "Banco de dados não configurado.",
    });
    return;
  }

  try {
    await pool.query("SELECT 1");

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Erro ao conectar ao PostgreSQL:", error);

    res.status(500).json({
      status: "error",
      message: "Não foi possível conectar ao banco de dados.",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SheSafe API executando na porta ${PORT}`);
});