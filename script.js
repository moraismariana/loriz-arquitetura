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

// EFEITO DE SCROLL
const transitionElement = document.querySelectorAll(".transition-element");

transitionElement.forEach((element) => {
  if (isInView(element)) {
    element.classList.add("transition-element--visible");
  }
});

document.addEventListener("scroll", function () {
  transitionElement.forEach((element) => {
    if (isInView(element)) {
      element.classList.add("transition-element--visible");
    } else {
      element.classList.remove("transition-element--visible");
    }
  });
});

function isInView(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.top <
      (window.innerHeight - 120 || document.documentElement.clientHeight - 120)
  );
}
