const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion')

let app = express();
let Producto = require('../models/producto');

// ===============================
// Mostrar todos los productos
// ===============================

app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort("nombre")
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")

    .exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productos
        });
    });
});


// ===============================
// Mostrar un producto por ID
// ===============================
app.get("/productos/:id", verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")
        .exec((err, productoDB) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                res.status(400).json({
                    ok: false,
                    err: {
                        message: "ID no existe"
                    }
                });
            }

            res.json({
                ok: true,
                productoDB
            });
        });
});

// ===============================
// Buscar un producto
// ===============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate("categoria", "descripcion")
        .exec((err, productos) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        })

});


// ===============================
// Crear un producto
// ===============================
app.post("/productos", verificaToken, function(req, res) {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id,
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

// ===============================
// Actualizar un producto
// ===============================
app.put('/productos/:id', verificaToken, (req, res) => {
    // grabar usuario
    //grabar categoria del listado
    let id = req.params.id;
    let body = req.body;

    let actProducto = {
        nombre: body.nombre,
        precioUnit: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoria,
        disponible: body.disponible,
    };

    Categoria.findByIdAndUpdate(id, actProducto, { new: true, runValidators: true }, (err, categoriaActualizada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!actProducto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Producto No encontrada"
                }
            });
        }

        res.json({
            ok: true,
            Producto: actProducto
        });
    });
});

// ===============================
// Borrar un producto
// ===============================
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "ID invalido"
                }
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Producto No encontrado"
                }
            });
        }

        res.json({
            ok: true,
            usuario: productoBorrado
        });
    });
});

module.exports = app;