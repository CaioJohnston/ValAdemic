const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = 3000;

const uri = "mongodb+srv://caio_valademic:NxB43X22SIv85PWq@cluster0.2jgn7eg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectToDB() {
  try {
    await client.connect();
    db = client.db('valademic_hashes');
    console.log("Conectado ao MongoDB Atlas");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB Atlas:", error);
    throw error;
  }
}

connectToDB().catch(console.error);

app.use(bodyParser.json());
app.use(cors());

app.post('/saveHash', async (req, res) => {
  const { studentName, studentId, institution, date, hash } = req.body;
  console.log("Recebido POST /saveHash:", req.body);
  try {
    const result = await db.collection('student_hashes').insertOne({ studentName, studentId, institution, date, hash });
    console.log("Hash salvo com sucesso:", result);
    res.status(200).send('Hash salvo com sucesso');
  } catch (error) {
    console.error("Erro ao salvar o hash no MongoDB:", error);
    res.status(500).send('Erro ao salvar o hash no MongoDB');
  }
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Servidor rodando em http://127.0.0.1:${port}`);
});
