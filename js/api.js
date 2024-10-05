// api.js
async function fetchImageFromApi(page) {
  const url = "https://api-hachuraservi1.websiteseguro.com/api/document";

  // Cabeçalhos da API
  const headers = new Headers({
    Authorization: "Basic 96f9c92582aed580ba10a780e8af7fea57531c9c", // Substitua pela sua chave
    "Content-Type": "application/x-www-form-urlencoded",
  });

  // Corpo da requisição, incluindo o número da página
  const body = new URLSearchParams({
    page: page,
  });

  try {
    // Fazendo a requisição POST para a API
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    // Verificando se a resposta foi bem-sucedida
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Erro: ${response.status}`);
    }
  } catch (error) {
    console.error("Erro ao fazer requisição:", error);
    throw new Error("Erro ao fazer requisição para a API.");
  }
}
