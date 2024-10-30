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
  const urls = [window.API_URL];

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
      alert("Sessão expirada. Por favor, faça login novamente.");
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

  const APIUrl = window.API_URL;

  const [apiResponse] = await Promise.all([
    fetch(APIUrl, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  // Convertendo para JSON (ou tratando como necessário)
  const data = await apiResponse.json();

  // Textos
  document.getElementById("text-input1").value = data.titulo;
  document.getElementById("text-input2").value = data.descricao;

  // Imagens
  document.getElementById("img").src = data.imagem;

  // INPUT / REDIMENSIONAMENTO DE IMAGENS

  document.getElementById("img").addEventListener("click", function () {
    document.getElementById("img-input").click();
  });

  // Redimensionar e trocar a imagem após selecionar um arquivo
  document
    .getElementById("img-input")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = new Image();
          img.onload = function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Obter largura e altura personalizadas dos atributos data da <img>
            const targetWidth = parseInt(
              document.getElementById("img").getAttribute("data-width")
            );
            const targetHeight = parseInt(
              document.getElementById("img").getAttribute("data-height")
            );

            // Calcular a proporção para o crop
            const aspectRatio = Math.max(
              targetWidth / img.width,
              targetHeight / img.height
            );
            const newWidth = img.width * aspectRatio;
            const newHeight = img.height * aspectRatio;
            const offsetX = (newWidth - targetWidth) / 2;
            const offsetY = (newHeight - targetHeight) / 2;

            // Definir o tamanho do canvas com as dimensões alvo
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            // Desenhar a imagem cortada e centralizada no canvas
            ctx.drawImage(img, -offsetX, -offsetY, newWidth, newHeight);

            // Converter o canvas para URL e atualizar o src da imagem
            document.getElementById("img").src = canvas.toDataURL(file.type);

            // Armazenar a imagem redimensionada para referência posterior (upload para API)
            document.getElementById("img").dataset.imageData = canvas.toDataURL(
              file.type
            );
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

  // ATUALIZAÇÃO DE DADOS DA API
  document
    .querySelector("form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      let formData = new FormData();

      // textos
      formData.append("titulo", document.getElementById("text-input1").value);
      formData.append(
        "descricao",
        document.getElementById("text-input2").value
      );

      // imagem
      const img = document.getElementById("img-input").files[0];
      if (img) {
        const imgDataUrl = document.getElementById("img").dataset.imageData;

        if (imgDataUrl) {
          // Converter o Data URL (base64) em um Blob
          const response = await fetch(imgDataUrl);
          const blob = await response.blob();

          // Adicionar o Blob ao FormData
          formData.append(
            "imagem",
            blob,
            `imagem-projeto${window.API_OBJECT}.png`
          );
        }
      }

      const routesAndData = [{ url: APIUrl, formData: formData }];

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
