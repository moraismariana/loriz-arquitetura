document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = `http://127.0.0.1:8000/projetoespecifico/${window.API_OBJECT}/`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // mudar essa linha
      document.getElementById("projeto-esp-content").classList.add("visible");

      // Textos
      document.getElementById("text1").innerText = data.titulo;
      document.getElementById("text2").innerText = data.descricao;

      // Imagens
      document.getElementById("img").src = data.imagem;
    })
    .catch((error) => {
      console.error("Erro ao buscar dados da API:", error);
    });
});
