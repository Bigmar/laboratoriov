const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Post = require('./models/post'); // Importar el modelo

// Inicializar la APP
const app = express();
const PORT = 3900;

// Configuración de middlewares
app.use(cors());
app.use(bodyParser.json()); // Para analizar las solicitudes con cuerpo JSON

// Inicializar la base de datos
mongoose.connect('mongodb://localhost:27017/basededatos', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Base de datos conectada');
}).catch(err => {
    console.error('Error al conectar a la base de datos:', err);
});

// Rutas
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener los posts",
            error
        });
    }
});

app.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post no encontrado" });
        }
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener el post",
            error
        });
    }
});

app.post('/posts', async (req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();
        return res.status(201).json(post);
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear el post",
            error
        });
    }
});

app.put('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!post) {
            return res.status(404).json({ message: "Post no encontrado" });
        }
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar el post",
            error
        });
    }
});

app.delete('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post no encontrado" });
        }
        return res.status(200).json({ message: "Post eliminado" });
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar el post",
            error
        });
    }
});

// Crear servidor y escuchar peticiones
app.listen(PORT, () => {
    console.log(`Servidor web corriendo desde el puerto ${PORT}`);
});

