links = document.querySelectorAll(".intern-link");
links.forEach((element) => {
  element.addEventListener("click", (event) => {
    event.preventDefault();
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  // Verifica se o usuário está autenticado
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("Você precisa estar autenticado para editar.");
    window.location.href = window.LOGIN_URL;
    return;
  }

  // URLs das APIs
  const urls = [window.TEXT_URL, window.BG_URL];

  try {
    // Verifica a autorização para todas as rotas simultaneamente
    const responses = await Promise.all(
      urls.map((url) =>
        fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      )
    );

    // Verifica se todas as respostas estão OK
    const allValid = responses.every((res) => res.ok);

    if (!allValid) {
      alert("Você não tem permissão para acessar todas as áreas.");
      localStorage.removeItem("accessToken");
      window.location.href = window.LOGIN_URL;
      return;
    }

    console.log("Acesso permitido a todas as rotas!");
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
    alert("Erro ao verificar sua sessão. Por favor, faça login novamente.");
    localStorage.removeItem("accessToken");
    window.location.href = window.LOGIN_URL;
  }

  // PREENCHER OS DADOS DA API

  const textAPIUrl = window.TEXT_URL;
  const bgAPIUrl = window.BG_URL;

  const [textResponse, bgResponse] = await Promise.all([
    fetch(textAPIUrl, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch(bgAPIUrl, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  // Convertendo para JSON (ou tratando como necessário)
  const textos = await textResponse.json();
  const backgrounds = await bgResponse.json();

  // Armazenar valores da API em variáveis
  let textAPI_keys = Object.keys(textos);
  textAPI_keys.shift();
  let bgAPI_keys = Object.keys(backgrounds);
  bgAPI_keys.shift();

  // Armazenar valores do HTML em variáveis
  let textInput = document.getElementsByClassName("text-input");
  let bgHTML = document.getElementsByClassName("bg");

  // TEXTOS
  let textAPI = Object.values(textos);
  textAPI.shift();
  for (let i = 0; i < textInput.length; i++) {
    textInput[i].value = textAPI[i];
  }

  // BACKGROUNDS
  let bgAPI = Object.values(backgrounds);
  bgAPI.shift();
  for (let i = 0; i < bgHTML.length; i++) {
    bgHTML[i].style.backgroundImage = `url(${bgAPI[i]})`;
  }

  // INPUT DE BACKGROUND
  let bgInputs = document.getElementsByClassName("bg-input");

  for (let i = 0; i < bgHTML.length; i++) {
    bgHTML[i].addEventListener("click", (event) => {
      if (event.target.tagName !== "TEXTAREA" && event.target.tagName !== "A") {
        bgInputs[i].click();
      }
    });

    bgInputs[i].addEventListener("change", (event) => {
      let file = event.target.files[0];
      if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
          bgHTML[i].style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ATUALIZAÇÃO DE DADOS DA API
  document
    .querySelector("form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      let textFormData = new FormData();
      let imgFormData = new FormData();
      let bgFormData = new FormData();

      // TEXTOS
      for (i = 0; i < textInput.length; i++) {
        textFormData.append(textAPI_keys[i], textInput[i].value);
      }

      // BACKGROUNDS
      for (i = 0; i < bgInputs.length; i++) {
        let bg = bgInputs[i].files[0];
        if (bg) {
          bgFormData.append(bgAPI_keys[i], bg, `background-${i + 1}.png`);
        }
      }

      const routesAndData = [
        { url: textAPIUrl, formData: textFormData },
        { url: bgAPIUrl, formData: bgFormData },
      ];

      try {
        const responses = await Promise.all(
          routesAndData.map(({ url, formData }) =>
            fetch(url, {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            })
          )
        );

        const allSuccessful = responses.every((res) => res.ok);

        if (!allSuccessful) {
          throw new Error("Erro ao atualizar uma ou mais APIs.");
        }

        alert("Todas as atualizações foram realizadas com sucesso!");

        window.location.href = window.ROOT_URL;
      } catch (error) {
        console.error("Erro ao atualizar os dados:", error);
        alert("Você não tem permissão para atualizar os dados.");
      }
    });
});
