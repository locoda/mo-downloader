// ==UserScript==
// @name         LDH mo Images download
// @namespace    https://1mether.me/
// @version      0.6
// @description  Add download button for downloading ALL Images from LDH mo details page
// @author       乙醚
// @match        http*://m.tribe-m.jp/diary/detail?id=*
// @match        http*://m.tribe-m.jp/image_diary/detail?id=*
// @match        http*://m.tribe-m.jp/news/detail?news_id=*
// @match        http*://m.ex-m.jp/diary/detail?id=*
// @match        http*://m.ex-m.jp/image_diary/detail?id=*
// @match        http*://m.ex-m.jp/news/detail?news_id=*
// @match        http*://m.ldh-m.jp/diary/detail?id=*
// @match        http*://m.ldh-m.jp/image_diary/detail?id=*
// @match        http*://m.ldh-m.jp/news/detail?news_id=*
// @match        http*://m.ldhgirls-m.jp/diary/detail?id=*
// @match        http*://m.ldhgirls-m.jp/image_diary/detail?id=*
// @match        http*://m.ldhgirls-m.jp/news/detail?news_id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tribe-m.jp
// @source       https://gist.github.com/locoda/460ac9d42b05e75df12ef2f80d66c3d2
// @updateURL    https://gist.github.com/locoda/460ac9d42b05e75df12ef2f80d66c3d2/raw/ldh-mo-img-dl.user.js
// @downloadURL  https://gist.github.com/locoda/460ac9d42b05e75df12ef2f80d66c3d2/raw/ldh-mo-img-dl.user.js
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    "use strict";

    var imgs = findEligibleImgs();
    injectButtons(imgs);
})();

function findEligibleImgs() {
    const keywords = ["uplcmn", "upload"]; // , "off_shot", "offshot", "artist_photo"];

    var imgs = document.querySelectorAll(".protectimg img");
    var imgSrcs = Array.from(imgs)
        .map((img) => img.src)
        .filter((img) => keywords.some((k) => img.includes(k)));
    return imgSrcs;
}

function injectButtons(imgs) {
    var article = document.querySelector("article");
    var downloadButton = document.createElement("BUTTON");
    var downloadButtonText = document.createTextNode(
        "下载所有图片 (" + imgs.length + ")"
    );
    downloadButton.appendChild(downloadButtonText);
    downloadButton.addEventListener("click", function () {
        downloadOnClickHandler(imgs);
    });
    downloadButton.className = "ldh-mo-dl";
    article.insertBefore(downloadButton, article.firstChild);
    var generateButton = document.createElement("BUTTON");
    var generateButtonText = document.createTextNode("生成图片链接");
    generateButton.appendChild(generateButtonText);
    generateButton.addEventListener("click", function () {
        generateOnClickHandler(imgs);
    });
    generateButton.className = "ldh-mo-dl";
    article.insertBefore(generateButton, article.firstChild);
}

function downloadOnClickHandler(imgs) {
    console.log(imgs);
    downloadAll(imgs);
}

function generateOnClickHandler(imgs) {
    console.log(imgs);
    var article = document.querySelector("article");
    var textarea = document.querySelector("textarea.ldh-mo-dl");
    if (!textarea) {
        textarea = document.createElement("textarea");
        textarea.className = "ldh-mo-dl";
        textarea.style = "height: 100px; width: 80%;";
        var br = document.createElement("br");
        article.insertBefore(br, article.firstChild);
        article.insertBefore(textarea, article.firstChild);
    }
    textarea.value = imgs.join("\n");
    textarea.select();
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
