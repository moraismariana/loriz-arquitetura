// Dados da API
// mudar urls e linha de class visible

Promise.all([
  fetch("http://127.0.0.1:8000/projetostexto/1/").then((res) => res.json()),
  fetch("http://127.0.0.1:8000/projetosimagem/1/").then((res) => res.json()),
  fetch("http://127.0.0.1:8000/projetosbg/1/").then((res) => res.json()),
]).then(([textos, imagens, backgrounds]) => {
  // mudar essa linha
  document.getElementById("projetos-content").classList.add("visible");

  // TEXTOS
  let textAPI = Object.values(textos);
  textAPI.shift();
  let textHTML = document.getElementsByClassName("text");
  for (let i = 0; i < textHTML.length; i++) {
    textHTML[i].innerText = textAPI[i];
  }

  // IMAGENS DO HTML
  let imgAPI = Object.values(imagens);
  imgAPI.shift();
  let imgHTML = document.getElementsByClassName("img");
  for (let i = 0; i < imgHTML.length; i++) {
    imgHTML[i].src = imgAPI[i];
  }

  // BACKGROUNDS
  let bgAPI = Object.values(backgrounds);
  bgAPI.shift();
  let bgHTML = document.getElementsByClassName("bg");
  for (let i = 0; i < bgHTML.length; i++) {
    bgHTML[i].style.backgroundImage = `url(${bgAPI[i]})`;
  }
});
