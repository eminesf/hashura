let scale = 1;
let hachurasAtivas = false;
let isDragging = false;
let startX, startY;
let currentHachura = null;

function aplicarZoom() {
  const container = document.getElementById("image-container");
  container.style.transform = `scale(${scale})`;
  container.style.transformOrigin = "top left";
}

function zoomImage(event) {
  event.preventDefault();

  const imgElement = document.getElementById("apiImage");
  const containerElement = document.getElementById("image-container");

  if (event.deltaY < 0) {
    scale += 0.1;
    if (scale > 3) scale = 3;
  } else {
    scale -= 0.1;
    if (scale < 1) scale = 1;
  }

  imgElement.style.transform = `scale(${scale})`;

  containerElement.style.width = `${imgElement.offsetWidth * scale}px`;
  containerElement.style.height = `${imgElement.offsetHeight * scale}px`;
}

function toggleHachuras() {
  const toggleButton = document.getElementById("toggleHachuras");

  if (hachurasAtivas) {
    toggleButton.classList.remove("active");
    toggleButton.textContent = "Aplicar Hachuras";
    hachurasAtivas = false;
  } else {
    toggleButton.classList.add("active");
    toggleButton.textContent = "Desativar Hachuras";
    hachurasAtivas = true;
  }
}

function iniciarHachura(event) {
  if (!hachurasAtivas || event.button !== 0) return;

  isDragging = true;

  const container = document.getElementById("image-container");
  const rect = container.getBoundingClientRect();
  startX = (event.clientX - rect.left) / scale;
  startY = (event.clientY - rect.top) / scale;

  currentHachura = document.createElement("div");
  currentHachura.classList.add("hachura");
  currentHachura.style.left = `${startX}px`;
  currentHachura.style.top = `${startY}px`;

  container.appendChild(currentHachura);
}

function desenharHachura(event) {
  if (!isDragging || !currentHachura) return;

  const container = document.getElementById("image-container");
  const rect = container.getBoundingClientRect();
  const currentX = (event.clientX - rect.left) / scale;
  const currentY = (event.clientY - rect.top) / scale;

  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  currentHachura.style.width = `${width}px`;
  currentHachura.style.height = `${height}px`;

  if (currentX < startX) {
    currentHachura.style.left = `${currentX}px`;
  }
  if (currentY < startY) {
    currentHachura.style.top = `${currentY}px`;
  }
}

function finalizarHachura(event) {
  if (!isDragging || !currentHachura) return;

  isDragging = false;
  salvarHachuraStorage(currentHachura);
  currentHachura = null;
}

function salvarHachuraStorage(hachuraElement) {
  const hachuras = JSON.parse(localStorage.getItem(currentImageId)) || [];

  const hachura = {
    left: parseFloat(hachuraElement.style.left),
    top: parseFloat(hachuraElement.style.top),
    width: parseFloat(hachuraElement.style.width),
    height: parseFloat(hachuraElement.style.height),
  };

  hachuras.push(hachura);

  localStorage.setItem(currentImageId, JSON.stringify(hachuras));
}

function removerTodasHachuras() {
  const container = document.getElementById("image-container");

  const hachurasExistentes = container.querySelectorAll(".hachura");
  hachurasExistentes.forEach((h) => h.remove());

  localStorage.removeItem(currentImageId);
}

function carregarHachuras() {
  const container = document.getElementById("image-container");
  const hachuras = JSON.parse(localStorage.getItem(currentImageId)) || [];

  const hachurasExistentes = container.querySelectorAll(".hachura");
  hachurasExistentes.forEach((h) => h.remove());

  hachuras.forEach((hachura) => {
    const hachuraElement = document.createElement("div");
    hachuraElement.classList.add("hachura");
    hachuraElement.style.left = `${hachura.left}px`;
    hachuraElement.style.top = `${hachura.top}px`;
    hachuraElement.style.width = `${hachura.width}px`;
    hachuraElement.style.height = `${hachura.height}px`;
    container.appendChild(hachuraElement);
  });
}

function removerHachura(event) {
  if (event.button === 2) {
    const hachura = document.elementFromPoint(event.clientX, event.clientY);
    if (hachura && hachura.classList.contains("hachura")) {
      hachura.remove();
      removerHachuraLocalStorage(hachura);
    }
  }
}

function removerHachuraLocalStorage(hachuraElement) {
  const hachuras = JSON.parse(localStorage.getItem(currentImageId)) || [];
  const left = parseFloat(hachuraElement.style.left);
  const top = parseFloat(hachuraElement.style.top);

  const hachurasAtualizadas = hachuras.filter(
    (h) => h.left !== left || h.top !== top
  );
  localStorage.setItem(currentImageId, JSON.stringify(hachurasAtualizadas));
}

document
  .getElementById("image-container")
  .addEventListener("contextmenu", (event) => event.preventDefault());

document.getElementById("apiImage").addEventListener("wheel", zoomImage);

document
  .getElementById("removeHachurasBtn")
  .addEventListener("click", removerTodasHachuras);

document
  .getElementById("toggleHachuras")
  .addEventListener("click", toggleHachuras);

const imageContainer = document.getElementById("image-container");
imageContainer.addEventListener("mousedown", iniciarHachura);
imageContainer.addEventListener("mousemove", desenharHachura);
imageContainer.addEventListener("mouseup", finalizarHachura);

imageContainer.addEventListener("mousedown", removerHachura);
