async function fetchImageFromApi(page) {
  const url = "https://api-hachuraservi1.websiteseguro.com/api/document";

  const headers = new Headers({
    Authorization: "Basic 96f9c92582aed580ba10a780e8af7fea57531c9c", 
    "Content-Type": "application/x-www-form-urlencoded",
  });

  const body = new URLSearchParams({
    page: page,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

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
