var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"],
        unique: true
    },
    precioUni: {
        type: Number,
        required: [true, "El precio Ãºnitario es necesario"]
    },
    descripcion: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: "Categoria", required: false },
    usuario: { type: Schema.Types.ObjectId, ref: "Usuario" },
    img: {
        type: String,
        require: false
    }
});

module.exports = mongoose.model("Producto", productoSchema);