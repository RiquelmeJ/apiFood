const express = require("express");
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const Food = require('./Model/food');


app.use(express.json());
app.use(express.urlencoded({extended: true}))


//Rotas
app.get("/", (req,res)=>{
		res.send("Página Inicial");
});

app.get("/api/foods", async (req, res) => {
    try {
        const alimentos = await Food.find();
        res.json(alimentos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/api/foods/:id", async (req, res) => {
    try {
        const alimento = await Food.findById(req.params.id);
        if (alimento == null) {
            return res.status(404).json({ message: "Alimento não encontrado!" });
        }
        res.json(alimento);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/api/foods", async (req, res) => {
    const alimento = new Food({
        name: req.body.name,
        category: req.body.category,
        quantity: req.body.quantity,
        expirationDate: req.body.expirationDate,
        price: req.body.price
    });
    try {
        const novoAlimento = await alimento.save();
        res.status(201).json(novoAlimento);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put("/api/foods/:id", async (req, res) => {
    try {
        const alimentoAtualizado = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (alimentoAtualizado == null) {
            return res.status(404).json({ message: "Alimento não encontrado!" });
        }
        res.json(alimentoAtualizado);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete("/api/foods/:id", async (req, res) => {
    try {
        const alimentoDeletado = await Food.findByIdAndDelete(req.params.id);
        if (alimentoDeletado == null) {
            return res.status(404).json({ message: "Alimento não encontrado!" });
        }
        res.json(alimentoDeletado);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//Conectar ao Banco de Dados - usar URL fornecida pelo Atlas
mongoose.connect(process.env.LIGACAOBD, { useNewUrlParser: true})
    .then(() => console.log('Conexão estabelecida.'))
    .catch(err => console.error('Erro de conexão.', err));

//Servidor
app.listen(3000, ()=>{console.log("Servidor rodando.")});