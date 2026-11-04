const express = require("express");
const pool = require("./config/database");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: "http://ec2-3-92-145-136.compute-1.amazonaws.com"
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    res.send("Sistema de chamados funcionando!");
});

app.get("/chamados", async (req, res) => { 
    try {
        const resultado = await pool.query("SELECT * FROM chamados");
        res.json(resultado.rows);
    } catch (erro) {
        console.error("Erro ao buscar chamados: ",erro);
        res.status(500).json({
            erro: "Erro ao buscar chamados"
        });
    }
});
    app.post("/chamados", async (req, res) => {
        try {
            const { titulo, descricao, prioridade } = req.body;

            const resultado = await pool.query(
                `INSERT INTO chamados (titulo, descricao, prioridade)
                 VALUES ($1, $2, $3)
                 RETURNING *`,
                [titulo, descricao, prioridade]
            );

            res.status(201).json(resultado.rows[0]); }
            catch (erro) {
                console.error("Erro ao criar chamado: ", erro);

                res.status(500).json({
                    erro: "Erro ao criar chamado"
                });
            }
        });

        app.put("/chamados/:id", async (req,res) => {
            try {
                const { id } = req.params;
                const { titulo, descricao, status, prioridade } = req.body;

                const resultado = await pool.query(
                    `UPDATE chamados
                    SET titulo = $1,
                        descricao = $2,
                        status = $3,
                        prioridade = $4
                    WHERE id = $5
                    RETURNING *`,
                    [titulo, descricao, status, prioridade, id]
                );

                if (resultado.rows.length === 0) {
                    return res.status(404).json({
                        erro: "Chamado não encontrado"
                    });
                }
                res.json(resultado.rows[0]);
            } catch (erro) {
                console.error("Erro ao atualizar chamado: ", erro);

                res.status(500).json({
                    erro: "Erro ao atualizar chamado"
                });
            }
        });

        app.delete("/chamados/:id", async (req, res) => {
            try {
                const { id } = req.params;

                const resultado = await pool.query(
                    `DELETE FROM chamados
                     WHERE id = $1
                     RETURNING *`,
                     [id]
                );

                if(resultado.rows.length === 0) {
                    return res.status(404).json({
                        erro: "Chamado não encontrado"
                    });
                }

                res.json({
                    mensagem: "Chamado excluido com sucesso",
                    chamado: resultado.rows[0]
                });
            } catch (erro) {
                console.error("Erro ao excluir chamado: ", erro);

                res.status(500).json({
                    erro: "Erro ao excluir chamado"
                });
            }
        });
app.put("/chamados/:id",async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, status, prioridade } = req.body;

        const resultado = await pool.query(
            `UPDATE chamados
             SET titulo = $1,
                descricao = $2,
                status = $3,
                prioridade = $4
             WHERE id = $5
             RETURNING *`,
            [titulo, descricao, status, prioridade, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: "Chamado não encontrado"
            });
        }

        res.json({
            mensagem: "Chamado atualizado com sucesso",
            chamado: resultado.rows[0] 
        });
    } catch (erro) {
        console.error("Erro ao atualizar chamado:", erro);

        res.status(500).json({
            erro: "Erro ao atualizar chamado"
        });
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
