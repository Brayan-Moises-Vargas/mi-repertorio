const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
const app = express();

const PORT = 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  try {
    res.sendFile(__dirname + "/index.html");
  } catch (error) {
    res.json({ message: "Recurso no disponible" });
  }
});

app.get("/canciones", (req, res) => {
  try {
    const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf8"));
    res.json(canciones);
  } catch (error) {
    res.json({ message: "Recurso no disponible" });
  }
});

app.post("/canciones", (req, res) => {
  try {
    const cancion = req.body;

    if (Object.values(cancion).some((value) => value === "")) {
      return res
        .status(400)
        .json({ message: "Debes completar todos los campos" });
    }

    const canciones = JSON.parse(fs.readFileSync("repertorio.json"));
    fs.writeFileSync(
      "repertorio.json",
      JSON.stringify([...canciones, cancion])
    );

    res.send("Cancion agregada");
  } catch (error) {
    res.json({ message: "Recurso no disponible" });
  }
});

app.put("/canciones/:id", (req, res) => {
  try {
    const id = req.params.id;
    const datosActualizados = req.body;

    const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf8"));

    const cancionIndex = canciones.findIndex((c) => c.id === parseInt(id));
    if (cancionIndex !== -1) {
      canciones[cancionIndex] = {
        id: parseInt(id),
        titulo: datosActualizados.titulo,
        artista: datosActualizados.artista,
        tono: datosActualizados.tono,
      };

      fs.writeFileSync("repertorio.json", JSON.stringify(canciones));

      res.status(200).json({ message: "Canción actualizada" });
    } else {
      res.status(404).json({ message: "Canción no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo 🚀  http://localhost:${PORT}`);
});
