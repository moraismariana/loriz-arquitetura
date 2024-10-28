// Dados da API
// mudar urls e linha de class visible

Promise.all([
  fetch("http://127.0.0.1:8000/clientestexto/1/").then((res) => res.json()),
  fetch("http://127.0.0.1:8000/clientesbg/1/").then((res) => res.json()),
]).then(([textos, backgrounds]) => {
  // mudar essa linha
  document.getElementById("clientes-content").classList.add("visible");

  // TEXTOS
  let textAPI = Object.values(textos);
  textAPI.shift();
  let textHTML = document.getElementsByClassName("text");
  for (let i = 0; i < textHTML.length; i++) {
    textHTML[i].innerText = textAPI[i];
  }

  // BACKGROUNDS
  let bgAPI = Object.values(backgrounds);
  bgAPI.shift();
  let bgHTML = document.getElementsByClassName("bg");
  for (let i = 0; i < bgHTML.length; i++) {
    bgHTML[i].style.backgroundImage = `url(${bgAPI[i]})`;
  }
});
