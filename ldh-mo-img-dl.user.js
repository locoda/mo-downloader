// ==UserScript==
// @name         LDH mo Images download
// @namespace    https://1mether.me/
// @version      0.3
// @description  Download ALL Images from LDH mo page
// @author       https://github.com/locoda
// @match        https*://m.tribe-m.jp/diary/detail?id=*
// @match        https*://m.tribe-m.jp/image_diary/detail?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tribe-m.jp
// @updateURL    https://gist.github.com/locoda/460ac9d42b05e75df12ef2f80d66c3d2/raw/ldh-mo-img-dl.user.js
// @downloadURL  https://gist.github.com/locoda/460ac9d42b05e75df12ef2f80d66c3d2/raw/ldh-mo-img-dl.user.js
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  injectButtons();
})();

const keywords = ["uplcmn", "upload"]; // , "off_shot", "offshot", "artist_photo"];

function findEligibleImgs() {
  var imgs = document.querySelectorAll(".protectimg img");
  var imgSrcs = Array.from(imgs)
    .map((img) => img.src)
    .filter((img) => keywords.some((k) => img.includes(k)));
  return imgSrcs;
}

function injectButtons() {
  var article = document.querySelector("article");
  var downloadButton = document.createElement("BUTTON");
  var downloadButtonText = document.createTextNode("下载所有图片");
  downloadButton.appendChild(downloadButtonText);
  downloadButton.onclick = downloadOnClickHandler;
  article.insertBefore(downloadButton, article.firstChild);
  var copyButton = document.createElement("BUTTON");
  var copyButtonText = document.createTextNode("复制图片链接");
  copyButton.appendChild(copyButtonText);
  copyButton.onclick = copyOnClickHandler;
  article.insertBefore(copyButton, article.firstChild);
}

function downloadOnClickHandler() {
  var imgs = findEligibleImgs();
  console.log(imgs);
  downloadAll(imgs);
}

function copyOnClickHandler() {
    var imgs = findEligibleImgs();
    console.log(imgs);
    if (navigator.clipboard) {
        navigator.clipboard.writeText(imgs.join("\n"));
    }
}

function downloadAll(imgs) {
  // Thanks to https://github.com/y252328/Instagram_Download_Button
  imgs.map((img) =>
    fetch(img, {
      headers: new Headers({
        Origin: window.location.origin,
      }),
      mode: "cors",
    })
      .then((response) => response.blob())
      .then((blob) =>
        dowloadBlob(
          window.URL.createObjectURL(blob),
          img.substring(img.lastIndexOf("/") + 1)
        )
      )
      .catch((e) => console.error(e))
  );
}

function dowloadBlob(blob, filename) {
  var a = document.createElement("a");
  a.download = filename;
  a.href = blob;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
