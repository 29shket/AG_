const fileTableBody = document.getElementById("fileTableBody");

async function loadFiles() {
  try {
    const response = await fetch("http://localhost:3000/files");
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
    console.error("Ошибка загрузки файлов:", error);
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
    await response.json();
    loadFiles();
  } catch (error) {
    console.error("Ошибка загрузки файла:", error);
  }
}

async function deleteFile(fileId, row) {
  try {
    await fetch(`http://localhost:3000/files/${fileId}`, {
      method: "DELETE",
    });
    row.remove();
  } catch (error) {
    console.error("Ошибка удаления файла:", error);
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
