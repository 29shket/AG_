const fileTableBody = document.getElementById("fileTableBody");

async function loadFiles() {
  try {
    const response = await fetch("http://localhost:3000/files");
    if (!response.ok) throw new Error("Ошибка загрузки файлов с сервера");
    const files = await response.json();
    fileTableBody.innerHTML = "";
    files.forEach((file) => {
      addFileToTable(
        file.id,
        file.name,
        `http://localhost:3000/uploads/${file.path}`
      );
    });
  } catch (error) {
    console.error("Ошибка при загрузке файлов:", error);
    alert("Не удалось загрузить файлы.");
  }
}

async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Ошибка загрузки файла");
    await response.json();
    loadFiles();
  } catch (error) {
    console.error("Ошибка загрузки файла:", error);
    alert("Ошибка при загрузке файла.");
  }
}

async function deleteFile(fileId, row) {
  try {
    const response = await fetch(`http://localhost:3000/files/${fileId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Ошибка удаления файла");
    row.remove();
  } catch (error) {
    console.error("Ошибка удаления файла:", error);
    alert("Ошибка при удалении файла.");
  }
}

function addFileToTable(id, name, url) {
  const row = document.createElement("tr");

  const nameCell = document.createElement("td");
  nameCell.textContent = name;
  row.appendChild(nameCell);

  const downloadCell = document.createElement("td");
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.textContent = "Скачать";
  downloadLink.download = name;
  downloadCell.appendChild(downloadLink);
  row.appendChild(downloadCell);

  const deleteCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Удалить";
  deleteButton.className = "btn btn-danger btn-sm";
  deleteButton.addEventListener("click", () => deleteFile(id, row));
  deleteCell.appendChild(deleteButton);
  row.appendChild(deleteCell);

  fileTableBody.appendChild(row);
}

document.getElementById("uploadButton").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  if (fileInput.files.length > 0) {
    uploadFile(fileInput.files[0]);
  } else {
    alert("Пожалуйста, выберите файл для загрузки.");
  }
});

loadFiles();
