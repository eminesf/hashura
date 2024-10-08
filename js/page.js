let currentImageId = "";
let totalPages = 1493;
let currentPage = 1;

function renderImage(base64Image) {
  const imgElement = document.getElementById("apiImage");
  imgElement.src = base64Image;
  imgElement.style.display = "block";

  currentImageId = `image_hachuras_${currentPage}`;
  aplicarZoom();
  carregarHachuras();

  document.getElementById("pageInput").value = currentPage;
  document.getElementById("totalPages").textContent = totalPages;
}

async function updatePage(page) {
  currentPage += page;
  if (currentPage < 1) {
    currentPage = 1;
  }

  try {
    const response = await fetchImageFromApi(currentPage);
    if (response.image) {
      renderImage(response.image);
      updatePageNumber(currentPage);
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

function updatePageNumber(page) {
  document.getElementById("pageNumber").textContent = `Página: ${page}`;
}

function updatePageFromInput() {
  const pageInput = document.getElementById("pageInput");
  const pageNumber = parseInt(pageInput.value, 10);

  if (pageNumber >= 1 && pageNumber <= totalPages) {
    updatePage(pageNumber - currentPage);
  } else {
    alert(`Por favor, insira um número entre 1 e ${totalPages}`);
    pageInput.value = currentPage;
  }
}

function advance10Pages() {
  updatePage(10);
}

function goBack10Pages() {
  updatePage(-10);
}

document
  .getElementById("advance10Btn")
  .addEventListener("click", advance10Pages);
document.getElementById("goBack10Btn").addEventListener("click", goBack10Pages);
document
  .getElementById("pageInput")
  .addEventListener("change", updatePageFromInput);

document
  .getElementById("nextBtn")
  .addEventListener("click", () => updatePage(1));
document
  .getElementById("previousBtn")
  .addEventListener("click", () => updatePage(-1));

updatePage(0);
