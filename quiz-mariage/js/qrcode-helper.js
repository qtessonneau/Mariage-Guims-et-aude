import QRCode from "https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm";
import { getQuizUrl } from "./site-config.js";

export async function renderQrCode(container, size = 280) {
  const url = getQuizUrl();
  const canvas = document.createElement("canvas");

  await QRCode.toCanvas(canvas, url, {
    width: size,
    margin: 2,
    color: { dark: "#3d3229", light: "#ffffff" },
  });

  container.innerHTML = "";
  container.appendChild(canvas);
  return url;
}

export async function copyQuizUrl() {
  const url = getQuizUrl();
  await navigator.clipboard.writeText(url);
  return url;
}
