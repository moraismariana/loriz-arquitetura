// MENU RESPONSIVO

let img = document.querySelector(".header nav a img");
function updateImageSrc() {
  const baseUrl = window.BASE_URL;
  if (window.innerWidth <= 1024) {
    img.src = `${baseUrl}logo-min.svg`;
  } else {
    img.src = `${baseUrl}logo.svg`;
  }
}
updateImageSrc();
window.addEventListener("resize", updateImageSrc);

function menuShow() {
  document.querySelector(".menu-mobile").classList.toggle("menu-mobile-ativo");
  document.querySelector(".header").classList.toggle("menu-mobile-ativo");

  // casos especificos
  // projeto especifico
  let backgroundProjetoEspecifico = document.querySelector(".header-2-bg");
  if (backgroundProjetoEspecifico) {
    backgroundProjetoEspecifico.classList.toggle("menu-mobile-ativo");
  }
}

document.querySelectorAll(".menu-mobile a").forEach((link) => {
  link.addEventListener("click", function () {
    menuShow(); // Esconde o menu quando um link é clicado
  });
});
