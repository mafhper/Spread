document.addEventListener("DOMContentLoaded", () => {
  const linkInput = document.getElementById("linkInput");
  const generateButton = document.getElementById("generateButton");
  const errorMessage = document.getElementById("errorMessage");

  const skeletonLoader = document.getElementById("skeletonLoader");
  const previewCard = document.getElementById("previewCard");
  const downloadButton = document.getElementById("downloadButton");
  const downloadSection = document.getElementById("downloadSection");
  const downloadStatus = document.getElementById("downloadStatus");

  const gradientBackground = document.getElementById("gradientBackground");
  const innerCard = document.getElementById("innerCard");
  const previewFavicon = document.getElementById("previewFavicon");
  const previewDomain = document.getElementById("previewDomain");
  const previewImage = document.getElementById("previewImage");

  const bgColor1 = document.getElementById("bgColor1");
  const bgColor2 = document.getElementById("bgColor2");
  const bgColor1Hex = document.getElementById("bgColor1Hex");
  const bgColor2Hex = document.getElementById("bgColor2Hex");
  const gradientStyle = document.getElementById("gradientStyle");
  const imageAspect = document.getElementById("imageAspect");
  const imagePosition = document.getElementById("imagePosition");

  const outerRadiusSlider = document.getElementById("outerRadiusSlider");
  const outerRadiusValue = document.getElementById("outerRadiusValue");

  const innerRadiusSlider = document.getElementById("innerRadiusSlider");
  const innerRadiusValue = document.getElementById("innerRadiusValue");

  const paddingSlider = document.getElementById("paddingSlider");
  const paddingValue = document.getElementById("paddingValue");

  const opacitySlider = document.getElementById("opacitySlider");
  const opacityValue = document.getElementById("opacityValue");

  const fontSizeSlider = document.getElementById("fontSizeSlider");
  const fontSizeValue = document.getElementById("fontSizeValue");

  const resetButton = document.getElementById("resetButton");

  const assistButtons = {
    analogous: document.getElementById("assistAnalogous"),
    triad: document.getElementById("assistTriad"),
    split: document.getElementById("assistSplit"),
    mono: document.getElementById("assistMono"),
  };

  const themeButtons = {
    sunset: document.getElementById("themeSunset"),
    ocean: document.getElementById("themeOcean"),
    forest: document.getElementById("themeForest"),
    neon: document.getElementById("themeNeon"),
  };

  const templates = {
    default: document.getElementById("templateDefault"),
    music: document.getElementById("templateMusic"),
    news: document.getElementById("templateNews"),
  };
  const templateData = {
    defaultTitle: document.getElementById("defaultTitle"),
    defaultDescription: document.getElementById("defaultDescription"),
    musicTitle: document.getElementById("musicTitle"),
    musicArtist: document.getElementById("musicArtist"),
    newsHeadline: document.getElementById("newsHeadline"),
    newsAuthor: document.getElementById("newsAuthor"),
    newsDescription: document.getElementById("newsDescription"),
  };
  const platformIcon = document.getElementById("platformIcon");

  const colorThief = new ColorThief();

  let currentLinkData = null;
  let dominantColor = null;
  let isUpdatingFromHex = false; // Flag para evitar loops

  // Placeholder vazio - sem imagem padrão
  const fallbackImageSrc = "";

  // Gera cores aleatórias vibrantes (sem azul)
  function generateRandomColors() {
    const colorPalettes = [
      // Roxo e Rosa
      ["#8b5cf6", "#ec4899"],
      ["#a855f7", "#f472b6"],
      ["#9333ea", "#db2777"],
      // Rosa e Laranja
      ["#ec4899", "#f97316"],
      ["#f472b6", "#fb923c"],
      ["#db2777", "#ea580c"],
      // Laranja e Vermelho
      ["#f97316", "#ef4444"],
      ["#fb923c", "#f87171"],
      ["#ea580c", "#dc2626"],
      // Roxo e Fúcsia
      ["#d946ef", "#c026d3"],
      ["#e879f9", "#d946ef"],
      ["#c026d3", "#a21caf"],
      // Verde e Lima
      ["#22c55e", "#84cc16"],
      ["#10b981", "#65a30d"],
      ["#14b8a6", "#a3e635"],
      // Rosa e Fúcsia
      ["#f472b6", "#e879f9"],
      ["#ec4899", "#d946ef"],
      ["#fb7185", "#f0abfc"],
    ];

    return colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
  }

  // Favicon com o logo do projeto
  const fallbackFaviconSrc =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYmdHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxYTE2MjU7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzI1MWEzMDtzdG9wLW9wYWNpdHk6MSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9Imljb25HcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNjMDg0ZmM7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjBhYmZjO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNkOGI0ZmU7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI3IiBmaWxsPSJ1cmwoI2JnR3JhZGllbnQpIi8+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNCwgNCkgc2NhbGUoMSkiPgogICAgPHBhdGggZD0iTTEyIDlDMTAuMzQzMSA5IDkgNy42NTY4NSA5IDZDOSA0LjM0MzE1IDEwLjM0MzEgMyAxMiAzQzEzLjY1NjkgMyAxNSA0LjM0MzE1IDE1IDZDMTUgNy42NTY4NSAxMy42NTY5IDkgMTIgOVoiIHN0cm9rZT0idXJsKCNpY29uR3JhZGllbnQpIiBzdHJva2Utd2lkdGg9IjEuOCIvPgogICAgPHBhdGggZD0iTTUuNSAyMUMzLjg0MzE1IDIxIDIuNSAxOS42NTY5IDIuNSAxOEMyLjUgMTYuMzQzMSAzLjg0MzE1IDE1IDUuNSAxNUM3LjE1Njg1IDE1IDguNSAxNi4zNDMxIDguNSAxOEM4LjUgMTkuNjU2OSA3LjE1Njg1IDIxIDUuNSAyMVoiIHN0cm9rZT0idXJsKCNpY29uR3JhZGllbnQpIiBzdHJva2Utd2lkdGg9IjEuOCIvPgogICAgPHBhdGggZD0iTTE4LjUgMjFDMTYuODQzMSAyMSAxNS41IDE5LjY1NjkgMTUuNSAxOEMxNS41IDE2LjM0MzEgMTYuODQzMSAxNSAxOC41IDE1QzIwLjE1NjkgMTUgMjEuNSAxNi4zNDMxIDIxLjUgMThDMjEuNSAxOS42NTY5IDIwLjE1NjkgMjEgMTguNSAyMVoiIHN0cm9rZT0idXJsKCNpY29uR3JhZGllbnQpIiBzdHJva2Utd2lkdGg9IjEuOCIvPgogICAgPHBhdGggZD0iTTIwIDEzQzIwIDEwLjYxMDYgMTguOTUyNSA4LjQ2NTg5IDE3LjI5MTYgN000IDEzQzQgMTAuNjEwNiA1LjA0NzUyIDguNDY1ODkgNi43MDgzOCA3TTEwIDIwLjc0OEMxMC42MzkyIDIwLjkxMjUgMTEuMzA5NCAyMSAxMiAyMUMxMi42OTA2IDIxIDEzLjM2MDggMjAuOTEyNSAxNCAyMC43NDgiIHN0cm9rZT0idXJsKCNpY29uR3JhZGllbnQpIiBzdHJva2Utd2lkdGg9IjEuOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPC9nPgo8L3N2Zz4=";

  async function toBase64(url, mimeType = "image/png") {
    if (!url || url.startsWith("data:")) {
      return url;
    }

    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) {
        throw new Error(
          `Falha ao buscar imagem: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();
      const finalMimeType = blob.type.includes("image/") ? blob.type : mimeType;

      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      return null;
    }
  }

  async function inlineGoogleFonts() {
    try {
      const fontUrl =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
      const response = await fetch(fontUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      if (!response.ok) throw new Error("Falha ao buscar a fonte.");

      const cssText = await response.text();
      const styleEl = document.getElementById("google-fonts-inline");
      if (styleEl) {
        styleEl.innerHTML = cssText;
      }
    } catch (error) {
      // Silently fail
    }
  }

  async function fetchYouTubeMusicData(url) {
    try {
      // Extrai o ID do vídeo da URL
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");

      if (!videoId) {
        throw new Error("ID do vídeo não encontrado");
      }

      // Usa a API do YouTube oEmbed para obter informações
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const response = await fetch(oembedUrl);

      if (!response.ok) {
        throw new Error("Falha ao buscar dados do YouTube");
      }

      const data = await response.json();

      // O título geralmente vem no formato "Artista - Música"
      return {
        title: data.title,
        author: data.author_name,
        thumbnail: data.thumbnail_url,
      };
    } catch (error) {
      console.log(
        "Não foi possível buscar dados específicos do YouTube Music:",
        error
      );
      return null;
    }
  }

  async function parseLink(url) {
    if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) {
      showMessage("Por favor, insira uma URL válida (com https://).", "error");
      return;
    }

    showLoading(true);
    showMessage("");
    showDownloadStatus("");
    setAssistButtonsDisabled(true);

    const originalInputUrl = url;
    let data = null;

    try {
      // Tenta buscar dados específicos do YouTube Music primeiro
      let youtubeData = null;
      if (url.includes("music.youtube.com")) {
        youtubeData = await fetchYouTubeMusicData(url);
      }
      const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 408) {
          throw new Error("Tempo esgotado. Tente novamente ou use outro link.");
        }
        throw new Error(
          "Não foi possível buscar os dados do link. Status: " + response.status
        );
      }

      const result = await response.json();
      data = result.data;

      if (!data) {
        throw new Error("A API não retornou dados para esta URL.");
      }

      // Se temos dados do YouTube Music, sobrescreve os dados genéricos
      if (youtubeData) {
        console.log("Usando dados do YouTube oEmbed:", youtubeData);
        data.title = youtubeData.title;
        data.author = youtubeData.author;
        // Usa a thumbnail do YouTube se disponível
        if (youtubeData.thumbnail && !data.image?.url) {
          data.image = { url: youtubeData.thumbnail };
        }
      } else {
        // Debug: mostra o que a API retornou
        console.log("Dados da API Microlink:", {
          title: data.title,
          author: data.author,
          description: data.description,
          publisher: data.publisher,
          url: data.url,
        });
      }

      const imageUrl = data.image?.url || data.screenshot?.url;
      const base64Image = imageUrl
        ? await toBase64(imageUrl, "image/jpeg")
        : null;
      const finalImageSrc = base64Image || fallbackImageSrc;

      const faviconUrl =
        data.logo?.url ||
        `https://www.google.com/s2/favicons?domain=${
          new URL(originalInputUrl).hostname
        }&sz=64`;
      const base64Favicon = faviconUrl
        ? await toBase64(faviconUrl, "image/png")
        : null;
      const finalFaviconSrc = base64Favicon || fallbackFaviconSrc;

      const parsedData = {
        title: data.title || "Título não encontrado",
        description: data.description || "Descrição não encontrada",
        image: finalImageSrc,
        favicon: finalFaviconSrc,
        url: data.url || originalInputUrl,
        domain: new URL(originalInputUrl).hostname.replace("www.", ""),
        author: data.author || null,
      };

      currentLinkData = parsedData;
      updatePreviewUI(parsedData);
      applyTemplate(parsedData);
    } catch (error) {
      let errorMsg = "Falha ao processar o link";

      if (error.name === "AbortError") {
        errorMsg =
          "Tempo esgotado. A API demorou muito para responder. Tente novamente.";
      } else {
        errorMsg = `${errorMsg}: ${error.message}`;
      }

      showMessage(errorMsg, "error");

      const fallbackData = {
        title: data?.title || "Falha ao carregar metadados",
        description: "Verifique a URL e tente novamente.",
        image: fallbackImageSrc,
        favicon: fallbackFaviconSrc,
        url: originalInputUrl,
        domain: "erro.app",
        author: null,
      };
      currentLinkData = fallbackData;
      updatePreviewUI(fallbackData);
      applyTemplate(fallbackData);
    } finally {
      if (previewImage.src === fallbackImageSrc) {
        showLoading(false);
        dominantColor = null;
        setAssistButtonsDisabled(true);
      }
    }
  }

  function getPlatformIcon(domain) {
    // Retorna SVG do ícone da plataforma
    if (
      domain.includes("youtube.com") ||
      domain.includes("music.youtube.com")
    ) {
      return `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-red-500">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>`;
    }
    if (domain.includes("spotify.com")) {
      return `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-green-500">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>`;
    }
    if (domain.includes("bandcamp.com")) {
      return `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-cyan-400">
                <path d="M0 9.6l7.2 4.8L24 9.6l-7.2-4.8L0 9.6zm24 4.8l-7.2-4.8L0 14.4l7.2 4.8L24 14.4z"/>
            </svg>`;
    }
    if (domain.includes("soundcloud.com")) {
      return `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-orange-500">
                <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.09-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c0 .055.045.094.09.094s.089-.045.104-.104l.21-1.319-.21-1.334c0-.061-.044-.09-.09-.09m1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.12.119.12.061 0 .105-.061.121-.12l.254-2.474-.254-2.548c-.016-.06-.061-.12-.121-.12m.945-.089c-.075 0-.135.06-.15.135l-.193 2.64.21 2.544c.016.077.075.138.149.138.075 0 .135-.061.15-.15l.24-2.532-.24-2.623c0-.075-.06-.135-.135-.135m.959-.166c-.09 0-.15.074-.165.148l-.195 2.883.209 2.714c.016.09.075.15.166.15.074 0 .149-.074.164-.165l.226-2.699-.226-2.883c-.015-.09-.075-.148-.149-.148m1.012.045c-.091 0-.166.074-.18.164l-.18 3.08.18 2.883c.015.09.09.165.18.165.09 0 .164-.074.18-.18l.209-2.868-.209-3.08c-.016-.09-.09-.164-.18-.164m.972-.119c-.104 0-.18.09-.195.18l-.164 3.199.18 2.774c.016.104.09.18.195.18.09 0 .18-.09.195-.195l.209-2.759-.209-3.199c-.015-.104-.09-.18-.195-.18m1.012.119c-.12 0-.21.09-.225.209l-.15 3.08.165 2.714c.015.12.105.21.225.21s.21-.09.225-.225l.195-2.699-.209-3.08c-.016-.12-.105-.209-.226-.209m.972.074c-.135 0-.24.106-.24.24l-.149 3.006.149 2.639c0 .135.105.24.24.24.119 0 .24-.105.24-.24l.164-2.639-.164-3.006c-.016-.134-.121-.24-.24-.24m1.043.061c-.15 0-.271.12-.271.27l-.119 2.945.119 2.58c.016.149.121.27.271.27.135 0 .27-.121.27-.27l.15-2.58-.15-2.945c0-.15-.135-.27-.27-.27m.987.119c-.166 0-.3.135-.3.3l-.104 2.826.118 2.471c0 .165.135.3.301.3.164 0 .3-.135.3-.3l.119-2.471-.119-2.826c0-.165-.135-.3-.3-.3m1.058.104c-.181 0-.33.15-.33.33l-.09 2.722.09 2.377c0 .181.149.33.33.33.18 0 .33-.149.33-.33l.104-2.377-.104-2.722c0-.18-.15-.33-.33-.33m1.102.061c-.195 0-.359.164-.359.359l-.061 2.661.061 2.293c0 .195.164.359.359.359.196 0 .36-.164.36-.359l.074-2.293-.074-2.661c0-.195-.164-.359-.36-.359m1.043.074c-.209 0-.375.166-.375.375l-.061 2.587.061 2.205c0 .209.166.375.375.375.21 0 .375-.166.375-.375l.075-2.205-.075-2.587c0-.209-.165-.375-.375-.375m1.028.104c-.226 0-.404.18-.404.404l-.045 2.483.045 2.14c0 .226.178.404.404.404.225 0 .404-.178.404-.404l.06-2.14-.06-2.483c0-.224-.179-.404-.404-.404m1.043.09c-.24 0-.435.194-.435.434l-.03 2.393.03 2.06c0 .24.195.435.435.435.239 0 .435-.195.435-.435l.044-2.06-.044-2.393c0-.24-.196-.434-.435-.434m1.013.074c-.255 0-.465.21-.465.465l-.015 2.319.015 1.996c0 .255.21.465.465.465.254 0 .464-.21.464-.465l.03-1.996-.03-2.319c0-.255-.21-.465-.464-.465m1.043.09c-.27 0-.48.225-.48.48v4.288c0 .27.225.48.48.48.269 0 .479-.225.479-.48V14.53c0-.269-.21-.48-.479-.48m1.028.104c-.285 0-.524.24-.524.524v4.02c0 .285.239.524.524.524.284 0 .524-.239.524-.524v-4.02c0-.284-.24-.524-.524-.524m1.043.09c-.3 0-.539.24-.539.539v3.841c0 .3.239.539.539.539.3 0 .539-.239.539-.539v-3.841c0-.3-.239-.539-.539-.539m1.043.104c-.314 0-.569.255-.569.569v3.633c0 .314.255.569.569.569.314 0 .569-.255.569-.569v-3.633c0-.314-.255-.569-.569-.569m1.043.09c-.33 0-.599.27-.599.599v3.453c0 .33.269.599.599.599.329 0 .599-.269.599-.599v-3.453c0-.33-.27-.599-.599-.599m1.043.104c-.345 0-.629.285-.629.629v3.273c0 .345.284.629.629.629.344 0 .629-.284.629-.629v-3.273c0-.344-.285-.629-.629-.629m1.043.09c-.359 0-.659.3-.659.659v3.093c0 .359.3.659.659.659.36 0 .659-.3.659-.659v-3.093c0-.359-.3-.659-.659-.659m1.043.104c-.375 0-.689.314-.689.689v2.913c0 .375.314.689.689.689.375 0 .689-.314.689-.689v-2.913c0-.375-.314-.689-.689-.689m1.043.09c-.39 0-.719.33-.719.719v2.733c0 .39.329.719.719.719.39 0 .719-.329.719-.719v-2.733c0-.39-.329-.719-.719-.719m1.043.104c-.404 0-.749.345-.749.749v2.553c0 .404.345.749.749.749.405 0 .749-.345.749-.749v-2.553c0-.404-.344-.749-.749-.749m1.043.09c-.42 0-.779.36-.779.779v2.373c0 .42.359.779.779.779.42 0 .779-.359.779-.779v-2.373c0-.42-.359-.779-.779-.779m1.043.104c-.435 0-.809.375-.809.809v2.193c0 .435.374.809.809.809.434 0 .809-.374.809-.809v-2.193c0-.434-.375-.809-.809-.809m1.043.09c-.45 0-.839.39-.839.839v2.013c0 .45.389.839.839.839.449 0 .839-.389.839-.839v-2.013c0-.45-.39-.839-.839-.839m1.043.104c-.465 0-.869.404-.869.869v1.833c0 .465.404.869.869.869.464 0 .869-.404.869-.869v-1.833c0-.465-.405-.869-.869-.869m1.043.09c-.48 0-.899.42-.899.899v1.653c0 .48.419.899.899.899.479 0 .899-.419.899-.899v-1.653c0-.48-.42-.899-.899-.899m1.043.104c-.495 0-.929.435-.929.929v1.473c0 .495.434.929.929.929.494 0 .929-.434.929-.929v-1.473c0-.494-.435-.929-.929-.929m1.043.09c-.51 0-.959.45-.959.959v1.293c0 .51.449.959.959.959.509 0 .959-.449.959-.959v-1.293c0-.51-.45-.959-.959-.959m1.043.104c-.524 0-.989.465-.989.989v1.113c0 .524.465.989.989.989.524 0 .989-.465.989-.989v-1.113c0-.524-.465-.989-.989-.989m1.043.09c-.539 0-1.019.48-1.019 1.019v.933c0 .539.48 1.019 1.019 1.019.539 0 1.019-.48 1.019-1.019v-.933c0-.539-.48-1.019-1.019-1.019m1.043.104c-.554 0-1.049.495-1.049 1.049v.753c0 .554.495 1.049 1.049 1.049.554 0 1.049-.495 1.049-1.049v-.753c0-.554-.495-1.049-1.049-1.049m1.043.09c-.569 0-1.079.51-1.079 1.079v.573c0 .569.51 1.079 1.079 1.079.569 0 1.079-.51 1.079-1.079v-.573c0-.569-.51-1.079-1.079-1.079m1.043.104c-.584 0-1.109.524-1.109 1.109v.393c0 .584.525 1.109 1.109 1.109.584 0 1.109-.525 1.109-1.109v-.393c0-.585-.525-1.109-1.109-1.109m1.043.09c-.599 0-1.139.54-1.139 1.139v.213c0 .599.54 1.139 1.139 1.139.599 0 1.139-.54 1.139-1.139v-.213c0-.599-.54-1.139-1.139-1.139"/>
            </svg>`;
    }
    if (
      domain.includes("music.apple.com") ||
      domain.includes("apple.com/music")
    ) {
      return `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-pink-500">
                <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408a10.61 10.61 0 0 0-.1 1.18c0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 0 0 1.57-.1c.822-.106 1.596-.35 2.296-.81a5.046 5.046 0 0 0 1.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.045-1.773-.6-1.943-1.536a1.88 1.88 0 0 1 1.038-2.022c.323-.16.67-.25 1.018-.324.378-.082.758-.153 1.134-.24.274-.063.457-.23.51-.516a.904.904 0 0 0 .02-.193c0-1.815 0-3.63-.002-5.443a.725.725 0 0 0-.026-.185c-.04-.15-.15-.243-.304-.234-.16.01-.318.035-.475.066-.76.15-1.52.303-2.28.456l-2.325.47-1.374.278c-.016.003-.032.01-.048.013-.277.077-.377.203-.39.49-.002.042 0 .086 0 .13-.002 2.602 0 5.204-.003 7.805 0 .42-.047.836-.215 1.227-.278.64-.77 1.04-1.434 1.233-.35.1-.71.16-1.075.172-.96.036-1.755-.6-1.92-1.544a1.88 1.88 0 0 1 1.038-2.022c.332-.167.688-.26 1.046-.336.344-.072.69-.14 1.033-.216.302-.067.472-.237.525-.55a.85.85 0 0 0 .02-.168c0-3.183.002-6.367-.002-9.55 0-.07.01-.146.028-.213.07-.27.255-.445.517-.518.675-.19 1.35-.372 2.027-.558.664-.182 1.328-.367 1.993-.548.665-.18 1.33-.36 1.996-.538.654-.174 1.31-.347 1.965-.523.323-.087.645-.18.97-.26.14-.036.294-.055.44-.06.24-.007.423.14.486.372.013.05.02.103.02.154.002 1.88 0 3.76 0 5.64z"/>
            </svg>`;
    }
    if (domain.includes("deezer.com")) {
      return `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-orange-400">
                <path d="M18.81 4.16v3.03h5.16V4.16h-5.16zm0 4.52v3.03h5.16V8.68h-5.16zm0 4.53v3.03h5.16v-3.03h-5.16zM12.68 4.16v3.03h5.16V4.16h-5.16zm0 4.52v3.03h5.16V8.68h-5.16zm0 4.53v3.03h5.16v-3.03h-5.16zm0 4.52v3.03h5.16v-3.03h-5.16zM6.56 8.68v3.03h5.16V8.68H6.56zm0 4.53v3.03h5.16v-3.03H6.56zm0 4.52v3.03h5.16v-3.03H6.56zM.43 13.21v3.03h5.16v-3.03H.43zm0 4.52v3.03h5.16v-3.03H.43z"/>
            </svg>`;
    }
    return null;
  }

  function updatePreviewUI(data) {
    // Mantém o favicon e título Spread fixos
    previewFavicon.src = "/favicon.svg";

    // Mostra a imagem apenas se houver uma válida
    if (data.image && data.image !== "") {
      previewImage.src = data.image;
      previewImage.classList.remove("hidden");

      if (!previewImage.src.startsWith("data:")) {
        console.error(
          "ERRO: Imagem principal não é Base64. A conversão falhou."
        );
        previewImage.src = fallbackImageSrc;
      }

      // Habilita o botão de download quando há imagem válida
      downloadButton.disabled = false;
    } else {
      previewImage.classList.add("hidden");
      downloadButton.disabled = true;
    }
  }

  function applyTemplate(data) {
    const domain = data.domain;

    Object.values(templates).forEach((t) => t.classList.add("hidden"));

    if (
      domain.includes("music.youtube.com") ||
      domain.includes("spotify.com") ||
      domain.includes("bandcamp.com")
    ) {
      templates.music.classList.remove("hidden");

      // Adiciona ícone da plataforma
      const iconSvg = getPlatformIcon(domain);
      if (iconSvg) {
        platformIcon.innerHTML = iconSvg;
        platformIcon.classList.remove("hidden");
      } else {
        platformIcon.classList.add("hidden");
      }

      // Tenta diferentes separadores comuns em títulos de música
      let parts = null;
      const separators = [" - ", " – ", " — ", " | ", " • "];

      for (const separator of separators) {
        if (data.title.includes(separator)) {
          parts = data.title.split(separator);
          break;
        }
      }

      if (parts && parts.length >= 2) {
        // Formato: "Artista - Música"
        templateData.musicArtist.textContent = parts[0].trim();
        templateData.musicTitle.textContent = parts.slice(1).join(" - ").trim();
      } else if (
        data.author &&
        data.author !== "YouTube" &&
        data.author !== "YouTube Music"
      ) {
        // Se temos um author válido (não genérico), usa ele
        templateData.musicArtist.textContent = data.author;
        templateData.musicTitle.textContent = data.title;
      } else {
        // Fallback: usa o domínio
        templateData.musicArtist.textContent = data.domain;
        templateData.musicTitle.textContent = data.title;
      }
    } else if (data.author && data.description) {
      templates.news.classList.remove("hidden");
      templateData.newsHeadline.textContent = data.title;
      templateData.newsAuthor.textContent = `Por ${data.author}`;
      templateData.newsDescription.textContent = data.description;
    } else {
      templates.default.classList.remove("hidden");
      templateData.defaultTitle.textContent = data.title;
      templateData.defaultDescription.textContent = data.description;
    }
  }

  function showLoading(isLoading) {
    if (isLoading) {
      skeletonLoader.classList.remove("hidden");
      previewCard.classList.add("hidden");
      downloadSection.classList.add("hidden");
      setAssistButtonsDisabled(true);
      downloadButton.disabled = true;
      errorMessage.textContent = "";
      errorMessage.className = "mt-2 text-sm";
    } else {
      skeletonLoader.classList.add("hidden");
      previewCard.classList.remove("hidden");
      downloadSection.classList.remove("hidden");
    }
  }

  function showMessage(message, type = "info") {
    errorMessage.textContent = message;
    errorMessage.className = "mt-2 text-sm message-" + type;
  }

  function showDownloadStatus(message, type = "info") {
    downloadStatus.textContent = message;
    downloadStatus.className =
      "text-sm text-center min-h-[20px] message-" + type;
  }

  function updateGradient() {
    const direction = gradientStyle.value;
    let type = "linear-gradient";

    if (direction.includes("circle")) {
      type = "radial-gradient";
    }

    gradientBackground.style.backgroundImage = `${type}(${direction}, ${bgColor1.value}, ${bgColor2.value})`;

    // Atualiza os campos hex apenas se não estiver sendo editado manualmente
    if (!isUpdatingFromHex) {
      bgColor1Hex.value = bgColor1.value.toUpperCase();
      bgColor2Hex.value = bgColor2.value.toUpperCase();
    }
  }

  function updatePadding() {
    const paddingPx = paddingSlider.value * 0.25 * 16;
    const paddingValueText = paddingSlider.value * 0.25 + "rem";

    gradientBackground.style.padding = paddingValueText;
    paddingValue.textContent = paddingValueText + ` (${paddingPx}px)`;
  }

  function updateImageStyle() {
    const aspect = imageAspect.value;
    const position = imagePosition.value;

    const aspectClasses = ["aspect-video", "aspect-square", "aspect-[9/16]"];
    const positionClasses = [
      "object-center",
      "object-top",
      "object-bottom",
      "object-left",
      "object-right",
    ];

    previewImage.classList.remove(...aspectClasses, ...positionClasses);

    previewImage.classList.add(aspect, position);
  }

  function updateBorderRadius() {
    const outerRadius = outerRadiusSlider.value + "px";
    const innerRadius = innerRadiusSlider.value + "px";

    gradientBackground.style.borderRadius = outerRadius;
    innerCard.style.borderRadius = innerRadius;

    previewImage.style.borderRadius = `calc(${innerRadiusSlider.value / 2}px)`;

    outerRadiusValue.textContent = outerRadius;
    innerRadiusValue.textContent = innerRadius;
  }

  function updateOpacity() {
    const opacity = opacitySlider.value / 100;
    innerCard.style.backgroundColor = `rgba(26, 26, 26, ${opacity})`;
    opacityValue.textContent = opacitySlider.value + "%";
  }

  function updateFontSize() {
    const scale = fontSizeSlider.value / 100;

    // Atualiza todos os templates
    const titles = [
      templateData.defaultTitle,
      templateData.musicTitle,
      templateData.newsHeadline,
    ];
    const descriptions = [
      templateData.defaultDescription,
      templateData.musicArtist,
      templateData.newsAuthor,
      templateData.newsDescription,
    ];

    titles.forEach((el) => {
      if (el) el.style.fontSize = `${1.25 * scale}rem`; // text-xl = 1.25rem
    });

    descriptions.forEach((el) => {
      if (el) el.style.fontSize = `${0.875 * scale}rem`; // text-sm = 0.875rem
    });

    fontSizeValue.textContent = fontSizeSlider.value + "%";
  }

  function setAssistButtonsDisabled(disabled) {
    Object.values(assistButtons).forEach((button) => {
      button.disabled = disabled;
    });
  }

  function applyColorAssist(type) {
    if (!dominantColor) return;

    const tiny = tinycolor(dominantColor);
    let palette;

    switch (type) {
      case "analogous":
        palette = tiny.analogous();
        bgColor1.value = palette[1].toHexString();
        bgColor2.value = palette[2].toHexString();
        break;
      case "triad":
        palette = tiny.triad();
        bgColor1.value = palette[1].toHexString();
        bgColor2.value = palette[2].toHexString();
        break;
      case "split":
        palette = tiny.splitcomplement();
        bgColor1.value = palette[1].toHexString();
        bgColor2.value = palette[2].toHexString();
        break;
      case "mono":
        palette = tiny.monochromatic();
        bgColor1.value = palette[1].toHexString();
        bgColor2.value = palette[2].toHexString();
        break;
    }

    // Atualiza os campos hex
    bgColor1Hex.value = bgColor1.value.toUpperCase();
    bgColor2Hex.value = bgColor2.value.toUpperCase();

    updateGradient();
  }

  function applyTheme(theme) {
    const themes = {
      sunset: {
        colors: ["#ff6b35", "#f7931e"],
        gradient: "135deg",
      },
      ocean: {
        colors: ["#0077be", "#00b4d8"],
        gradient: "180deg",
      },
      forest: {
        colors: ["#2d6a4f", "#52b788"],
        gradient: "315deg",
      },
      neon: {
        colors: ["#ff006e", "#8338ec"],
        gradient: "circle at top left",
      },
    };

    const themeData = themes[theme];
    if (themeData) {
      bgColor1.value = themeData.colors[0];
      bgColor2.value = themeData.colors[1];
      bgColor1Hex.value = themeData.colors[0].toUpperCase();
      bgColor2Hex.value = themeData.colors[1].toUpperCase();
      gradientStyle.value = themeData.gradient;
      updateGradient();
    }
  }

  function resetSettings() {
    // Se não há cor dominante (sem imagem), usa cores aleatórias
    if (!dominantColor) {
      const [randomColor1, randomColor2] = generateRandomColors();
      bgColor1.value = randomColor1;
      bgColor2.value = randomColor2;
      bgColor1Hex.value = randomColor1.toUpperCase();
      bgColor2Hex.value = randomColor2.toUpperCase();
    } else {
      // Se há imagem, reaplica as cores extraídas
      handleImageLoad();
    }

    // Gradiente
    gradientStyle.value = "135deg";

    // Imagem
    imageAspect.value = "aspect-video";
    imagePosition.value = "object-center";

    // Layout
    outerRadiusSlider.value = 0;
    innerRadiusSlider.value = 8;
    paddingSlider.value = 6;
    opacitySlider.value = 80;
    fontSizeSlider.value = 100;

    // Atualiza tudo
    updateGradient();
    updateImageStyle();
    updateBorderRadius();
    updatePadding();
    updateOpacity();
    updateFontSize();
  }

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  function handleImageLoad() {
    const isFallback = previewImage.src === fallbackImageSrc;

    try {
      if (isFallback) {
        throw new Error("Fallback image loaded, skipping color extraction.");
      }

      const palette = colorThief.getPalette(previewImage, 3);
      const dominant = palette[0];
      const secondary = palette[1] || palette[0];

      dominantColor = `rgb(${dominant.join(",")})`;

      bgColor1.value = rgbToHex(dominant[0], dominant[1], dominant[2]);
      bgColor2.value = rgbToHex(secondary[0], secondary[1], secondary[2]);

      // Atualiza os campos hex
      bgColor1Hex.value = bgColor1.value.toUpperCase();
      bgColor2Hex.value = bgColor2.value.toUpperCase();

      updateGradient();

      setAssistButtonsDisabled(false);
    } catch (colorError) {
      updateGradient();
      dominantColor = null;
      setAssistButtonsDisabled(isFallback);
    } finally {
      showLoading(false);
    }
  }

  function handleImageError() {
    console.error(
      "Falha catastrófica ao carregar imagem (mesmo Base64). Usando fallback."
    );
    previewImage.src = fallbackImageSrc;
    dominantColor = null;
    setAssistButtonsDisabled(true);
    showLoading(false);
  }

  function generateFileName() {
    if (!currentLinkData) {
      return "spread-card.png";
    }

    // Função auxiliar para limpar strings para nome de arquivo
    function sanitize(str) {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
        .replace(/\s+/g, "_") // Substitui espaços por underscore
        .replace(/_+/g, "_") // Remove underscores duplicados
        .replace(/^_|_$/g, "") // Remove underscores no início/fim
        .substring(0, 50); // Limita tamanho
    }

    const domain = currentLinkData.domain;
    let fileName = "";

    // Template de Música
    if (
      domain.includes("music.youtube.com") ||
      domain.includes("spotify.com") ||
      domain.includes("bandcamp.com")
    ) {
      // Tenta diferentes separadores comuns em títulos de música
      let parts = null;
      const separators = [" - ", " – ", " — ", " | ", " • "];

      for (const separator of separators) {
        if (currentLinkData.title.includes(separator)) {
          parts = currentLinkData.title.split(separator);
          break;
        }
      }

      if (parts && parts.length >= 2) {
        const artist = sanitize(parts[0].trim());
        const song = sanitize(parts.slice(1).join(" - ").trim());
        fileName = `${artist}-${song}`;
      } else {
        const artist = sanitize(currentLinkData.author || domain);
        const song = sanitize(currentLinkData.title);
        fileName = `${artist}-${song}`;
      }
    }
    // Template de Notícia
    else if (currentLinkData.author && currentLinkData.description) {
      const author = sanitize(currentLinkData.author);
      const headline = sanitize(currentLinkData.title);
      fileName = `${author}-${headline}`;
    }
    // Template Padrão
    else {
      const title = sanitize(currentLinkData.title);
      const domainClean = sanitize(domain);
      fileName = `${title}-${domainClean}`;
    }

    // Fallback se o nome ficou vazio
    if (!fileName || fileName.length < 3) {
      fileName = "spread-card";
    }

    return `${fileName}.png`;
  }

  async function downloadImage() {
    if (downloadButton.disabled) {
      showDownloadStatus("Gere um preview primeiro.", "error");
      return;
    }

    if (previewCard.classList.contains("hidden")) {
      showDownloadStatus("Gere um preview primeiro.", "error");
      return;
    }

    showDownloadStatus("Preparando para download...", "info");
    const node = document.getElementById("gradientBackground");

    try {
      const dataUrl = await htmlToImage.toPng(node, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = generateFileName();
      link.href = dataUrl;
      link.click();
      showDownloadStatus("✓ Download concluído com sucesso!", "success");

      // Limpa a mensagem após 3 segundos
      setTimeout(() => {
        showDownloadStatus("");
      }, 3000);
    } catch (error) {
      console.error("Falha ao gerar o download:", error);
      showDownloadStatus(
        `Falha ao gerar o download: ${error.message || "Erro desconhecido"}`,
        "error"
      );
    }
  }

  generateButton.addEventListener("click", () => parseLink(linkInput.value));
  linkInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      parseLink(linkInput.value);
    }
  });

  downloadButton.addEventListener("click", downloadImage);

  bgColor1.addEventListener("input", () => {
    if (!isUpdatingFromHex) {
      updateGradient();
    }
  });

  bgColor2.addEventListener("input", () => {
    if (!isUpdatingFromHex) {
      updateGradient();
    }
  });

  // Converte hex de 3 dígitos para 6 dígitos (#FFF -> #FFFFFF)
  function expandHex(hex) {
    if (hex.length === 4) {
      // #RGB
      return "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    return hex;
  }

  // Permite editar os campos hex - usa 'change' para validar apenas quando terminar de digitar
  bgColor1Hex.addEventListener("change", (e) => {
    isUpdatingFromHex = true;
    let value = e.target.value.trim().toUpperCase();

    // Garante que começa com #
    if (value && !value.startsWith("#")) {
      value = "#" + value;
    }

    // Valida se é uma cor hex válida (3 ou 6 dígitos)
    const hexRegex = /^#([A-F0-9]{3}|[A-F0-9]{6})$/;
    if (hexRegex.test(value)) {
      // Converte 3 dígitos para 6 dígitos para o color picker
      const expandedValue = expandHex(value);
      bgColor1.value = expandedValue;
      e.target.value = expandedValue; // Atualiza o campo também
      updateGradient();
    } else {
      // Se inválido, volta para o valor atual do color picker
      e.target.value = bgColor1.value.toUpperCase();
    }

    isUpdatingFromHex = false;
  });

  // Converte para maiúsculas enquanto digita
  bgColor1Hex.addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase();
  });

  bgColor2Hex.addEventListener("change", (e) => {
    isUpdatingFromHex = true;
    let value = e.target.value.trim().toUpperCase();

    // Garante que começa com #
    if (value && !value.startsWith("#")) {
      value = "#" + value;
    }

    // Valida se é uma cor hex válida (3 ou 6 dígitos)
    const hexRegex = /^#([A-F0-9]{3}|[A-F0-9]{6})$/;
    if (hexRegex.test(value)) {
      // Converte 3 dígitos para 6 dígitos para o color picker
      const expandedValue = expandHex(value);
      bgColor2.value = expandedValue;
      e.target.value = expandedValue; // Atualiza o campo também
      updateGradient();
    } else {
      // Se inválido, volta para o valor atual do color picker
      e.target.value = bgColor2.value.toUpperCase();
    }

    isUpdatingFromHex = false;
  });

  // Converte para maiúsculas enquanto digita
  bgColor2Hex.addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase();
  });
  gradientStyle.addEventListener("input", updateGradient);
  imageAspect.addEventListener("input", updateImageStyle);
  imagePosition.addEventListener("input", updateImageStyle);

  outerRadiusSlider.addEventListener("input", updateBorderRadius);
  innerRadiusSlider.addEventListener("input", updateBorderRadius);
  paddingSlider.addEventListener("input", updatePadding);
  opacitySlider.addEventListener("input", updateOpacity);
  fontSizeSlider.addEventListener("input", updateFontSize);

  resetButton.addEventListener("click", resetSettings);

  themeButtons.sunset.addEventListener("click", () => applyTheme("sunset"));
  themeButtons.ocean.addEventListener("click", () => applyTheme("ocean"));
  themeButtons.forest.addEventListener("click", () => applyTheme("forest"));
  themeButtons.neon.addEventListener("click", () => applyTheme("neon"));

  assistButtons.analogous.addEventListener("click", () =>
    applyColorAssist("analogous")
  );
  assistButtons.triad.addEventListener("click", () =>
    applyColorAssist("triad")
  );
  assistButtons.split.addEventListener("click", () =>
    applyColorAssist("split")
  );
  assistButtons.mono.addEventListener("click", () => applyColorAssist("mono"));

  previewImage.onload = handleImageLoad;
  previewImage.onerror = handleImageError;
  previewFavicon.onerror = () => {
    previewFavicon.src = fallbackFaviconSrc;
  };

  // Inicializa a visualização padrão
  showLoading(false);

  // Define cores aleatórias no início
  const [randomColor1, randomColor2] = generateRandomColors();
  bgColor1.value = randomColor1;
  bgColor2.value = randomColor2;
  bgColor1Hex.value = randomColor1.toUpperCase();
  bgColor2Hex.value = randomColor2.toUpperCase();

  applyTemplate({
    title: "Bem-vindo ao Spread",
    description:
      "Crie e compartilhe visualizações de links elegantes e modernas, 100% no seu navegador.",
    domain: "Spread",
    author: null,
  });
  updateGradient();
  updatePadding();
  updateImageStyle();
  updateBorderRadius();
  updateOpacity();
  updateFontSize();

  inlineGoogleFonts();
});
