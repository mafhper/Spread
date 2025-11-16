document.addEventListener("DOMContentLoaded", () => {
  // === PEGA O BASE PATH DO BODY (definido no index.astro) ===
  const base = (document.body.dataset.base || "").replace(/\/$/, "");
  const fallbackFaviconSrc = base ? `${base}/favicon.svg` : "/favicon.svg";

  // === ELEMENTOS DOM ===
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
  const previewDomain = document.querySelector("#previewFavicon + span");
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
  let isUpdatingFromHex = false;

  // === FUNÇÕES DE UI ===
  function showLoading(show) {
    if (show) {
      skeletonLoader.classList.remove("hidden");
      previewCard.classList.add("hidden");
      downloadSection.classList.add("hidden");
      downloadButton.disabled = true;
    } else {
      skeletonLoader.classList.add("hidden");
      previewCard.classList.remove("hidden");
      downloadSection.classList.remove("hidden");
      downloadButton.disabled = false;
    }
  }

  function showMessage(text, type = "") {
    errorMessage.textContent = text;
    errorMessage.className = `mt-2 text-sm ${
      type === "error"
        ? "text-message-error"
        : type === "success"
        ? "text-message-success"
        : "text-message-info"
    }`;
  }

  function showDownloadStatus(text, type = "") {
    downloadStatus.textContent = text;
    downloadStatus.className = `text-sm text-center min-h-[20px] ${
      type === "error"
        ? "text-message-error"
        : type === "success"
        ? "text-message-success"
        : "text-message-info"
    }`;
  }

  function updateGradient() {
    const color1 = bgColor1.value;
    const color2 = bgColor2.value;
    const style = gradientStyle.value;
    const bg = style.includes("circle")
      ? `radial-gradient(${style}, ${color1}, ${color2})`
      : `linear-gradient(${style}, ${color1}, ${color2})`;
    gradientBackground.style.backgroundImage = bg;
  }

  function updateImageStyle() {
    const aspect = imageAspect.value;
    const position = imagePosition.value;
    previewImage.className = `w-full rounded-lg object-cover border border-border-primary ${aspect} ${position} ${
      previewImage.src ? "" : "hidden"
    }`;
  }

  function updateBorderRadius() {
    const outer = outerRadiusSlider.value + "px";
    const inner = innerRadiusSlider.value + "px";
    gradientBackground.style.borderRadius = outer;
    innerCard.style.borderRadius = inner;
    outerRadiusValue.textContent = outer;
    innerRadiusValue.textContent = inner;
  }

  function updatePadding() {
    const padding = paddingSlider.value * 0.25 + "rem";
    innerCard.style.padding = padding;
    paddingValue.textContent = padding;
  }

  function updateOpacity() {
    const opacity = opacitySlider.value / 100;
    innerCard.style.backgroundColor = `rgba(26, 26, 26, ${opacity})`;
    opacityValue.textContent = opacitySlider.value + "%";
  }

  function updateFontSize() {
    const scale = fontSizeSlider.value / 100;
    innerCard.style.fontSize = `${scale}rem`;
    fontSizeValue.textContent = fontSizeSlider.value + "%";
  }

  // === EXTRAÇÃO DE COR ===
  async function extractDominantColor(imageBase64) {
    if (!imageBase64) return;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageBase64;
    await new Promise((r) => {
      img.onload = r;
      img.onerror = r;
    });
    try {
      const rgb = colorThief.getColor(img);
      const dominant = tinycolor(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
      bgColor1.value = dominant.darken(15).toHexString();
      bgColor2.value = dominant.lighten(20).toHexString();
      bgColor1Hex.value = bgColor1.value.toUpperCase();
      bgColor2Hex.value = bgColor2.value.toUpperCase();
      updateGradient();
    } catch (err) {
      console.warn("Falha ao extrair cor:", err);
    }
  }

  // === TEMPLATE ===
  function applyTemplate(data) {
    currentLinkData = data;
    Object.values(templates).forEach((t) => t.classList.add("hidden"));

    // SPREAD FIXO
    previewFavicon.src = fallbackFaviconSrc;
    previewFavicon.onerror = () => {
      previewFavicon.src = fallbackFaviconSrc;
    };
    if (previewDomain) previewDomain.textContent = "Spread";

    // IMAGEM
    if (data.image) {
      previewImage.src = data.image;
      previewImage.classList.remove("hidden");
      extractDominantColor(data.image);
    } else {
      previewImage.src = "";
      previewImage.classList.add("hidden");
    }

    // TEMPLATES
    if (data.template === "music") {
      templates.music.classList.remove("hidden");
      templateData.musicTitle.textContent = data.title;
      templateData.musicArtist.textContent =
        data.author || "Artista desconhecido";
      const isSpotify = data.url.includes("spotify");
      platformIcon.innerHTML = isSpotify
        ? '<svg viewBox="0 0 24 24" class="h-5 w-5"><path fill="#1DB954" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2.5 15.5c-2.33 0-4.21-1.88-4.21-4.21 0-2.33 1.88-4.21 4.21-4.21 2.33 0 4.21 1.88 4.21 4.21 0 2.33-1.88 4.21-4.21 4.21zm6.18-7.32c-.3-.18-.66-.3-1.03-.3-.9 0-1.8.54-2.7 1.62-.9-1.08-1.8-1.62-2.7-1.62-.66 0-1.26.36-1.68.96-.42.6-.54 1.38-.36 2.16.18.78.72 1.38 1.38 1.38.66 0 1.2-.48 1.38-1.14.18-.66.06-1.38-.36-1.92-.24-.3-.6-.48-1.02-.48-.6 0-1.14.42-1.5 1.08.36.66.9 1.08 1.5 1.08.9 0 1.62-.72 1.62-1.62 0-.9-.72-1.62-1.62-1.62-.48 0-.9.24-1.2.6.3.36.78.6 1.32.6.9 0 1.62-.72 1.62-1.62 0-.54-.3-1.02-.78-1.32z"/></svg>'
        : '<svg viewBox="0 0 24 24" class="h-5 w-5"><path fill="#FF0000" d="M19.59 6.62a3.24 3.24 0 0 0-2.29-2.3C15.44 4 12 4 12 4s-3.44 0-5.3.32a3.24 3.24 0 0 0-2.29 2.3C4.09 8.48 4.09 12 4.09 12s0 3.52.32 5.38a3.24 3.24 0 0 0 2.29 2.3C8.56 20 12 20 12 20s3.44 0 5.3-.32a3.24 3.24 0 0 0 2.29-2.3C20.91 15.52 20.91 12 20.91 12s0-3.52-.32-5.38zM10.09 15.5v-7l6 3.5-6 3.5z"/></svg>';
      platformIcon.classList.remove("hidden");
    } else if (data.template === "news") {
      templates.news.classList.remove("hidden");
      templateData.newsHeadline.textContent = data.title;
      templateData.newsAuthor.textContent = data.author;
      templateData.newsDescription.textContent = data.description;
      platformIcon.classList.add("hidden");
    } else {
      templates.default.classList.remove("hidden");
      templateData.defaultTitle.textContent = data.title;
      templateData.defaultDescription.textContent = data.description;
      platformIcon.classList.add("hidden");
    }

    updateImageStyle();
    showLoading(false);
    downloadButton.disabled = false;
  }

  // === PARSE LINK ===
  async function parseLink(url) {
    if (!url || !url.match(/^https?:\/\//i))
      return showMessage("URL inválida", "error");
    showLoading(true);
    showMessage("");
    showDownloadStatus("");

    let linkData = null;
    try {
      const res = await fetch(
        `https://api.microlink.io/?url=${encodeURIComponent(url)}`
      );
      if (!res.ok) throw new Error();
      const result = await res.json();
      const d = result.data;
      const image = d.image?.url ? await toBase64(d.image.url) : "";
      const favicon =
        (await toBase64(
          d.logo?.url ||
            `https://www.google.com/s2/favicons?domain=${
              new URL(url).hostname
            }&sz=64`
        )) || fallbackFaviconSrc;

      linkData = {
        title: d.title || "Sem título",
        description: d.description || "",
        image,
        favicon,
        domain: new URL(url).hostname,
        author: d.author_name || d.author || null,
        url,
        template:
          url.includes("music.youtube.com") || url.includes("spotify")
            ? "music"
            : d.author
            ? "news"
            : "default",
      };
    } catch (err) {
      console.warn("Microlink falhou, tentando fallback...");
      linkData = await scrapeOpenGraph(url);
    }

    if (linkData) {
      applyTemplate(linkData);
      currentLinkData = linkData;
    } else {
      showMessage("Falha ao carregar link", "error");
    }
    showLoading(false);
  }

  async function toBase64(url) {
    if (!url) return null;
    try {
      const proxy = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      const res = await fetch(proxy);
      if (!res.ok) return null;
      const blob = await res.blob();
      return await new Promise((r) => {
        const reader = new FileReader();
        reader.onload = () => r(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  }

  async function scrapeOpenGraph(url) {
    try {
      const proxy = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      const html = await (await fetch(proxy)).text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const get = (p) =>
        doc.querySelector(`meta[property="${p}"], meta[name="${p}"]`)
          ?.content || "";
      const title = get("og:title") || doc.title || "Sem título";
      const description = get("og:description") || get("description") || "";
      const image = get("og:image") ? await toBase64(get("og:image")) : "";
      return {
        title,
        description,
        image,
        favicon: fallbackFaviconSrc,
        domain: new URL(url).hostname,
        author: null,
        url,
        template:
          url.includes("music.youtube.com") || url.includes("spotify")
            ? "music"
            : "default",
      };
    } catch {
      return null;
    }
  }

  // === DOWNLOAD ===
  async function downloadImage() {
    if (downloadButton.disabled)
      return showDownloadStatus("Gere um preview", "error");
    showDownloadStatus("Gerando...", "info");
    try {
      const dataUrl = await htmlToImage.toPng(gradientBackground, {
        pixelRatio: 2,
        backgroundColor: "#0a0a0f",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = currentLinkData?.title
        ? `${currentLinkData.title
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase()
            .substring(0, 30)}-spread.png`
        : "spread.png";
      a.click();
      showDownloadStatus("Concluído!", "success");
      setTimeout(() => showDownloadStatus(""), 3000);
    } catch (err) {
      showDownloadStatus("Erro", "error");
    }
  }

  // === EVENTOS ===
  generateButton.addEventListener("click", () =>
    parseLink(linkInput.value.trim())
  );
  linkInput.addEventListener(
    "keypress",
    (e) => e.key === "Enter" && parseLink(linkInput.value.trim())
  );
  downloadButton.addEventListener("click", downloadImage);

  // === INICIALIZAÇÃO ===
  const [c1, c2] = ["#8b5cf6", "#ec4899"]; // ou generateRandomColors()
  bgColor1.value = c1;
  bgColor2.value = c2;
  bgColor1Hex.value = c1.toUpperCase();
  bgColor2Hex.value = c2.toUpperCase();

  applyTemplate({
    title: "Bem-vindo ao Spread",
    description:
      "Crie e compartilhe visualizações de links elegantes e modernas, 100% no seu navegador.",
    domain: "Spread",
    image: "",
    template: "default",
  });

  updateGradient();
  updateImageStyle();
  updateBorderRadius();
  updatePadding();
  updateOpacity();
  updateFontSize();
  showLoading(false);
});
