/**
 * Site estático (GitHub Pages) que sorteia uma imagem.
 * Ele carrega a lista de imagens de ./images.json
 */

const IMG_EL = document.getElementById("randomImg");
const META_EL = document.getElementById("meta");
const BTN_NEW = document.getElementById("btnNew");
const CHK_NO_REPEAT = document.getElementById("chkNoRepeat");

const STORAGE_KEY_LAST = "random-image:last";

async function loadImagesList() {
  const res = await fetch("./images.json", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(
      `Falha ao carregar images.json (HTTP ${res.status}). Confira se o arquivo existe na raiz do site.`
    );
  }
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("images.json precisa ser um array com pelo menos 1 imagem.");
  }
  return data;
}

function pickRandom(list, { avoid } = {}) {
  if (!avoid || list.length === 1) {
    return list[Math.floor(Math.random() * list.length)];
  }

  // tenta algumas vezes evitar repetir
  for (let i = 0; i < 10; i++) {
    const chosen = list[Math.floor(Math.random() * list.length)];
    if (chosen !== avoid) return chosen;
  }

  // fallback (se lista pequena ou azar)
  return list[Math.floor(Math.random() * list.length)];
}

function setImage(src) {
  IMG_EL.src = src;
  META_EL.textContent = src.replace("./", "");
}

async function showRandomImage() {
  try {
    BTN_NEW.disabled = true;

    const list = await loadImagesList();

    const avoidRepeat = CHK_NO_REPEAT.checked;
    const last = localStorage.getItem(STORAGE_KEY_LAST) || "";

    const chosen = pickRandom(list, { avoid: avoidRepeat ? last : "" });

    setImage(chosen);
    localStorage.setItem(STORAGE_KEY_LAST, chosen);
  } catch (err) {
    console.error(err);
    META_EL.textContent = String(err?.message || err);
  } finally {
    BTN_NEW.disabled = false;
  }
}

BTN_NEW.addEventListener("click", () => {
  showRandomImage();
});

// primeira carga
showRandomImage();