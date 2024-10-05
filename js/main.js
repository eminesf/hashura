let currentPage = 1; // Começa na página 1
let scale = 1; // Inicializa a escala do zoom como 1 (sem zoom)
let hachurasAtivas = false; // Estado inicial das hachuras (desativadas)
let isDragging = false; // Flag para verificar se o usuário está arrastando
let startX, startY; // Coordenadas iniciais do clique
let currentHachura = null; // Elemento da hachura sendo desenhado
let currentImageId = ""; // Identificador da imagem atual (pode ser a URL ou algum ID único)
let totalPages = 1493; // Substitua pelo valor correto conforme necessário

// Função para renderizar a imagem no HTML
function renderImage(base64Image) {
  const imgElement = document.getElementById("apiImage");
  imgElement.src = base64Image;
  imgElement.style.display = "block"; // Mostra a imagem
  // Define o identificador único da imagem com base na página atual
  currentImageId = `image_hachuras_${currentPage}`;
  aplicarZoom(); // Aplica o zoom atual ao carregar a imagem
  carregarHachuras(); // Carrega hachuras da imagem atual

  document.getElementById("pageInput").value = currentPage;
  document.getElementById("totalPages").textContent = totalPages;
}

// Função para aplicar o zoom ao contêiner da imagem e das hachuras
function aplicarZoom() {
  const container = document.getElementById("image-container");
  container.style.transform = `scale(${scale})`;
  container.style.transformOrigin = "top left"; // Fixa a origem do zoom para a esquerda superior
}

// Função para atualizar o número da página no HTML
function updatePageNumber(page) {
  document.getElementById("pageNumber").textContent = `Página: ${page}`;
}

function updatePageFromInput() {
  const pageInput = document.getElementById("pageInput");
  const pageNumber = parseInt(pageInput.value, 10);

  // Verifica se o número da página está dentro dos limites
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    updatePage(pageNumber - currentPage); // Atualiza a página para o valor inserido
  } else {
    alert(`Por favor, insira um número entre 1 e ${totalPages}`);
    pageInput.value = currentPage; // Restaura o valor correto se fora dos limites
  }
}

// Função que controla a mudança de página e chama a API
async function updatePage(delta) {
  currentPage += delta;
  if (currentPage < 1) {
    currentPage = 1; // Garante que a página não seja menor que 1
  }

  try {
    // Chama a API usando a função definida em api.js
    const response = await fetchImageFromApi(currentPage);

    // Verifica se a resposta contém a imagem
    if (response.image) {
      renderImage(response.image); // Renderiza a imagem no HTML
      updatePageNumber(currentPage); // Atualiza o número da página
    } else {
      document.getElementById("pageNumber").textContent =
        "Nenhuma imagem retornada pela API.";
    }
  } catch (error) {
    document.getElementById("pageNumber").textContent =
      "Erro ao buscar a imagem.";
    console.error(error);
  }
}

// Função para avançar 10 páginas
function advance10Pages() {
  updatePage(10);
}

// Função para retroceder 10 páginas
function goBack10Pages() {
  updatePage(-10);
}

// Função para lidar com o zoom quando o scroll do mouse for usado
function zoomImage(event) {
  event.preventDefault(); // Evita que a página role ao usar o scroll do mouse na imagem

  const imgElement = document.getElementById("apiImage");
  const containerElement = document.getElementById("image-container");

  // Ajuste a escala com base no movimento da roda do mouse
  if (event.deltaY < 0) {
    // Rolagem para cima -> zoom in
    scale += 0.1;
    if (scale > 3) scale = 3; // Limite o zoom a 3x o tamanho original
  } else {
    // Rolagem para baixo -> zoom out
    scale -= 0.1;
    if (scale < 1) scale = 1; // Não permite zoom menor que o tamanho original
  }

  // Aplica o zoom na imagem usando transform scale
  imgElement.style.transform = `scale(${scale})`;

  // Ajusta o tamanho do contêiner de acordo com o zoom
  containerElement.style.width = `${imgElement.offsetWidth * scale}px`;
  containerElement.style.height = `${imgElement.offsetHeight * scale}px`;
}

// Função para alternar o modo de aplicar hachuras
function toggleHachuras() {
  const toggleButton = document.getElementById("toggleHachuras");

  // Verifica se as hachuras estão ativas ou não
  if (hachurasAtivas) {
    toggleButton.classList.remove("active"); // Remove a classe que muda a cor do botão
    toggleButton.textContent = "Aplicar Hachuras";
    hachurasAtivas = false;
  } else {
    toggleButton.classList.add("active"); // Adiciona a classe que muda a cor do botão
    toggleButton.textContent = "Desativar Hachuras";
    hachurasAtivas = true;
  }
}

// Função para iniciar o desenho da hachura (mousedown)
function iniciarHachura(event) {
  if (!hachurasAtivas || event.button !== 0) return; // Apenas clique esquerdo e se as hachuras estiverem ativas

  // Marca que o usuário está arrastando
  isDragging = true;

  // Pega a posição inicial do clique relativo ao contêiner da imagem
  const container = document.getElementById("image-container");
  const rect = container.getBoundingClientRect();
  startX = (event.clientX - rect.left) / scale; // Corrige a posição inicial com base no zoom
  startY = (event.clientY - rect.top) / scale; // Corrige a posição inicial com base no zoom

  // Cria o elemento da hachura
  currentHachura = document.createElement("div");
  currentHachura.classList.add("hachura");
  currentHachura.style.left = `${startX}px`;
  currentHachura.style.top = `${startY}px`;

  // Adiciona a hachura ao container da imagem
  container.appendChild(currentHachura);
}

// Função para desenhar a hachura enquanto o mouse é arrastado (mousemove)
function desenharHachura(event) {
  if (!isDragging || !currentHachura) return;

  // Pega a posição atual do mouse relativa ao contêiner da imagem
  const container = document.getElementById("image-container");
  const rect = container.getBoundingClientRect();
  const currentX = (event.clientX - rect.left) / scale; // Corrige a posição atual com base no zoom
  const currentY = (event.clientY - rect.top) / scale; // Corrige a posição atual com base no zoom

  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  // Define o tamanho e ajusta a posição se necessário (para suportar arrasto em todas as direções)
  currentHachura.style.width = `${width}px`;
  currentHachura.style.height = `${height}px`;

  if (currentX < startX) {
    currentHachura.style.left = `${currentX}px`;
  }
  if (currentY < startY) {
    currentHachura.style.top = `${currentY}px`;
  }
}

// Função para finalizar o desenho da hachura (mouseup)
function finalizarHachura(event) {
  if (!isDragging || !currentHachura) return;

  isDragging = false; // O usuário parou de arrastar
  salvarHachura(currentHachura); // Salva a hachura no localStorage
  currentHachura = null; // Finaliza o desenho da hachura
}

// Função para salvar uma hachura no localStorage
function salvarHachura(hachuraElement) {
  const hachuras = JSON.parse(localStorage.getItem(currentImageId)) || [];

  // Extrai as propriedades da hachura
  const hachura = {
    left: parseFloat(hachuraElement.style.left),
    top: parseFloat(hachuraElement.style.top),
    width: parseFloat(hachuraElement.style.width),
    height: parseFloat(hachuraElement.style.height),
  };

  // Adiciona a hachura ao array
  hachuras.push(hachura);

  // Salva no localStorage
  localStorage.setItem(currentImageId, JSON.stringify(hachuras));
}

function removerTodasHachuras() {
  const container = document.getElementById("image-container");

  // Remove todas as hachuras do DOM
  const hachurasExistentes = container.querySelectorAll(".hachura");
  hachurasExistentes.forEach((h) => h.remove());

  // Remove as hachuras do localStorage para a imagem atual
  localStorage.removeItem(currentImageId);
}

// Função para carregar as hachuras de uma imagem do localStorage
function carregarHachuras() {
  const container = document.getElementById("image-container");
  const hachuras = JSON.parse(localStorage.getItem(currentImageId)) || [];

  // Remove todas as hachuras existentes (se houver)
  const hachurasExistentes = container.querySelectorAll(".hachura");
  hachurasExistentes.forEach((h) => h.remove());

  // Recria todas as hachuras salvas
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

// Função para remover uma hachura existente com o clique direito
function removerHachura(event) {
  if (event.button === 2) {
    // Clique direito
    const hachura = document.elementFromPoint(event.clientX, event.clientY);
    if (hachura && hachura.classList.contains("hachura")) {
      hachura.remove(); // Remove a hachura do DOM
      removerHachuraLocalStorage(hachura); // Remove do localStorage
    }
  }
}

// Função para remover uma hachura do localStorage
function removerHachuraLocalStorage(hachuraElement) {
  const hachuras = JSON.parse(localStorage.getItem(currentImageId)) || [];
  const left = parseFloat(hachuraElement.style.left);
  const top = parseFloat(hachuraElement.style.top);

  // Filtra a hachura removida e salva o restante
  const hachurasAtualizadas = hachuras.filter(
    (h) => h.left !== left || h.top !== top
  );
  localStorage.setItem(currentImageId, JSON.stringify(hachurasAtualizadas));
}

document
  .getElementById("pageInput")
  .addEventListener("change", updatePageFromInput);

document
  .getElementById("advance10Btn")
  .addEventListener("click", advance10Pages);
document.getElementById("goBack10Btn").addEventListener("click", goBack10Pages);

// Evita o menu de contexto padrão ao clicar com o botão direito na imagem
document
  .getElementById("image-container")
  .addEventListener("contextmenu", (event) => event.preventDefault());

// Adiciona os eventos de clique aos botões
document
  .getElementById("nextBtn")
  .addEventListener("click", () => updatePage(1)); // Próxima página
document
  .getElementById("previousBtn")
  .addEventListener("click", () => updatePage(-1)); // Página anterior

// Carrega a imagem da primeira página ao iniciar
updatePage(0); // Inicializa sem alterar a página, ou seja, carregando a página 1

// Adiciona o evento de zoom na imagem usando o scroll do mouse
document.getElementById("apiImage").addEventListener("wheel", zoomImage);

document
  .getElementById("removeHachurasBtn")
  .addEventListener("click", removerTodasHachuras);

// Adiciona o evento ao botão de hachuras
document
  .getElementById("toggleHachuras")
  .addEventListener("click", toggleHachuras);

// Eventos de mousedown, mousemove e mouseup para desenhar hachuras
const imageContainer = document.getElementById("image-container");
imageContainer.addEventListener("mousedown", iniciarHachura);
imageContainer.addEventListener("mousemove", desenharHachura);
imageContainer.addEventListener("mouseup", finalizarHachura);

// Adiciona o evento de remoção de hachura com o clique direito
imageContainer.addEventListener("mousedown", removerHachura);
