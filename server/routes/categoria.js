const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ===============================
// Mostrar todas las categorias
// ===============================
app.get("/categorias", verificaToken, (req, res) => {

    Categoria.find({ estado: true })
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias,
            });

        });
});

// //===============================
// // Mostrar una catergorias por ID
// //===============================
app.get('/categorias/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            res.status(500).json({
                ok: false,
                err: {
                    message: "El ID no es correcto"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//===============================
// Crear una catergoria
// //===============================
app.post("/categorias", verificaToken, function(req, res) {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// //===============================
// // Actualizar una catergorias
// //===============================
app.put("/categorias:id", verificaToken, function(req, res) {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaActualizada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaActualizada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoria No encontrada"
                }
            });
        }

        res.json({
            ok: true,
            Categoria: categoriaActualizada
        });
    });
});

// //===============================
// // Eliminar una catergorias
// //===============================
app.delete("/categorias/:id", [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id,
        (err, categoriaBorrada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaBorrada) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "El ID no existe"
                    }
                });
            }

            res.json({
                ok: true,
                message: "Categoria Borrada",
                categoria: categoriaBorrada
            });
        }
    );
});


module.exports = app;