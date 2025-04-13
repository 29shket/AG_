const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());

let files = [];

app.get("/files", (req, res) => {
  res.json(files);
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Файл не найден." });

  const file = {
    id: Date.now().toString(),
    name: req.file.originalname,
    path: req.file.filename,
  };
  files.push(file);
  res.json({ message: "Файл успешно загружен." });
});

app.delete("/files/:id", (req, res) => {
  const fileId = req.params.id;
  const fileIndex = files.findIndex((file) => file.id === fileId);

  if (fileIndex === -1) {
    return res.status(404).json({ error: "Файл не найден." });
  }

  const [deletedFile] = files.splice(fileIndex, 1);
  fs.unlinkSync(path.join(uploadDir, deletedFile.path));
  res.json({ message: "Файл успешно удалён." });
});

app.use("/uploads", express.static(uploadDir));

app.listen(port, () => {
  console.log(`Сервер запущен: http://localhost:${port}`);
});
