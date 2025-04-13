const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// Используем переменную PORT или значение по умолчанию (3000)
const port = process.env.PORT || 3000;

// Указываем папку для загрузок
const uploadDir = path.join(__dirname, "uploads");

// Проверяем, существует ли папка uploads, и создаём её, если нет
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Настройка хранения для Multer (загрузка файлов)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Подключаем CORS для разрешения запросов с других устройств
app.use(cors({ origin: "*" }));

// Middleware для обработки JSON-запросов
app.use(express.json());

// Список файлов, доступных на сервере
let files = [];

// Маршрут для получения списка всех файлов
app.get("/files", (req, res) => {
  res.json(files);
});

// Маршрут для загрузки файла
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Файл не найден." });
  }

  const file = {
    id: Date.now().toString(),
    name: req.file.originalname,
    path: req.file.filename,
  };
  files.push(file);
  res.json({ message: "Файл успешно загружен." });
});

// Маршрут для удаления файла
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

// Указываем статический маршрут для загружаемых файлов
app.use("/uploads", express.static(uploadDir));

// Запуск сервера, который слушает все IP-адреса (включая Radmin VPN)
app.listen(port, "0.0.0.0", () => {
  console.log(`Сервер запущен на порту ${port}`);
});
