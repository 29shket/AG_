<<<<<<< HEAD
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Настройка хранилища файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Настройка базы данных
const db = new sqlite3.Database("./files.db");

db.run(`
    CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        path TEXT
    )
`);

// Маршрут для загрузки файлов
app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  db.run(
    `INSERT INTO files (name, path) VALUES (?, ?)`,
    [file.originalname, file.path],
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Ошибка при сохранении файла в базе данных" });
      }
      res.json({ message: "Файл загружен", file });
    }
  );
});

// Маршрут для получения списка файлов
app.get("/files", (req, res) => {
  db.all(`SELECT * FROM files`, (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Ошибка при получении списка файлов" });
    }
    res.json(rows);
  });
});

// Маршрут для удаления файлов
app.delete("/files/:id", (req, res) => {
  const fileId = req.params.id;
  db.get(`SELECT path FROM files WHERE id = ?`, [fileId], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: "Файл не найден" });
    }

    fs.unlink(row.path, (fsErr) => {
      if (fsErr) {
        return res.status(500).json({ error: "Ошибка при удалении файла" });
      }

      db.run(`DELETE FROM files WHERE id = ?`, [fileId], (dbErr) => {
        if (dbErr) {
          return res
            .status(500)
            .json({ error: "Ошибка при удалении записи из базы данных" });
        }
        res.json({ message: "Файл успешно удален" });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
=======
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Настройка хранилища файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Настройка базы данных
const db = new sqlite3.Database("./files.db");

db.run(`
    CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        path TEXT
    )
`);

// Маршрут для загрузки файлов
app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  db.run(
    `INSERT INTO files (name, path) VALUES (?, ?)`,
    [file.originalname, file.path],
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Ошибка при сохранении файла в базе данных" });
      }
      res.json({ message: "Файл загружен", file });
    }
  );
});

// Маршрут для получения списка файлов
app.get("/files", (req, res) => {
  db.all(`SELECT * FROM files`, (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Ошибка при получении списка файлов" });
    }
    res.json(rows);
  });
});

// Маршрут для удаления файлов
app.delete("/files/:id", (req, res) => {
  const fileId = req.params.id;
  db.get(`SELECT path FROM files WHERE id = ?`, [fileId], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: "Файл не найден" });
    }

    fs.unlink(row.path, (fsErr) => {
      if (fsErr) {
        return res.status(500).json({ error: "Ошибка при удалении файла" });
      }

      db.run(`DELETE FROM files WHERE id = ?`, [fileId], (dbErr) => {
        if (dbErr) {
          return res
            .status(500)
            .json({ error: "Ошибка при удалении записи из базы данных" });
        }
        res.json({ message: "Файл успешно удален" });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
>>>>>>> 9691e2c (Первый коммит)
