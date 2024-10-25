// MENU RESPONSIVO

let logoHeader = document.querySelector(".header nav a img");
let logoFooter = document.querySelector(".footer .footer-flex > img");
function updateImageSrc() {
  const baseUrl = window.BASE_URL;
  if (window.innerWidth <= 1024) {
    logoHeader.src = `${baseUrl}logo-min.svg`;
    logoFooter.src = `${baseUrl}logo-min.svg`;
  } else {
    logoHeader.src = `${baseUrl}logo.svg`;
    logoFooter.src = `${baseUrl}logo.svg`;
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
