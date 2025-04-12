const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(bodyParser.json());

let gameState = {
  teams: [],
  currentTeamIndex: 0,
  wordList: ["яблоко", "машина", "компьютер", "река", "гора"],
  currentWord: "",
  rounds: [],
  targetScore: 10, // Максимум очков для победы
};

let allWords = [];

// Управление WebSocket
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case "updateState":
        gameState = { ...gameState, ...data.payload };
        broadcast({ type: "stateUpdated", payload: gameState });
        break;
      case "nextWord":
        gameState.currentWord =
          gameState.wordList[
            Math.floor(Math.random() * gameState.wordList.length)
          ];
        broadcast({ type: "newWord", payload: gameState.currentWord });
        break;
      case "addScore":
        gameState.rounds[gameState.currentTeamIndex].guessedWords.push(
          gameState.currentWord
        );
        broadcast({ type: "scoreUpdated", payload: gameState.rounds });
        break;
    }
  });

  ws.send(JSON.stringify({ type: "stateUpdated", payload: gameState }));
});

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

server.listen(3000, () => {
  console.log("Сервер запущен на порту 3000");
});

fetch("data/russian.txt")
  .then((response) => response.text())
  .then((data) => {
    allWords = data.split("\n"); // Разделяем слова по строкам
    console.log(`Загружено ${allWords.length} слов`);
  })
  .catch((error) => {
    console.error("Ошибка загрузки слов:", error);
  });

const showNextWord = () => {
  if (allWords.length === 0) {
    alert("Слова закончились! Перезапустите игру.");
    return;
  }

  const wordIndex = Math.floor(Math.random() * allWords.length);
  const word = allWords.splice(wordIndex, 1)[0]; // Удаляем слово из массива
  document.getElementById("word").textContent = word;
};
