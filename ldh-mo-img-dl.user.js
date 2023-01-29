// ==UserScript==
// @name                mo (LDH) Images download
// @name:zh-CN          mo (LDH) 图片下载器
// @namespace           https://1mether.me/
// @version             0.10
// @description         Add download button for downloading ALL Images from LDH mo details page
// @description:zh-CN   在mo的内容页增加下载和复制图片链接的按钮，用于批量下载页面图片
// @author              乙醚(@locoda)
// @match               http*://m.tribe-m.jp/diary/*
// @match               http*://m.tribe-m.jp/image_diary/*
// @match               http*://m.tribe-m.jp/news/detail?news_id=*
// @match               http*://m.ex-m.jp/diary/*
// @match               http*://m.ex-m.jp/image_diary/*
// @match               http*://m.ex-m.jp/news/detail?news_id=*
// @match               http*://m.ldh-m.jp/diary/*
// @match               http*://m.ldh-m.jp/image_diary/*
// @match               http*://m.ldh-m.jp/news/detail?news_id=*
// @match               http*://m.ldhgirls-m.jp/diary/*
// @match               http*://m.ldhgirls-m.jp/image_diary/*
// @match               http*://m.ldhgirls-m.jp/news/detail?news_id=*
// @icon                https://www.google.com/s2/favicons?sz=64&domain=tribe-m.jp
// @source              https://gist.github.com/locoda/460ac9d42b05e75df12ef2f80d66c3d2
// @updateURL           https://gist.github.com/locoda/460ac9d42b05e75df12ef2f80d66c3d2/raw/ldh-mo-img-dl.user.js
// @downloadURL         https://gist.github.com/locoda/460ac9d42b05e75df12ef2f80d66c3d2/raw/ldh-mo-img-dl.user.js
// @grant               none
// @license             MIT
// ==/UserScript==

(function () {
    "use strict";

    var imgs = findEligibleImgs();
    injectButtons(imgs);
    removeProtectImg();
})();

function removeProtectImg() {
    var protectImgs = document.querySelectorAll(".protectimg");
    protectImgs.forEach((node) => node.classList.remove("protectimg"));
}

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
    // 视频下载按钮
    var downloadVideoButton = document.createElement("BUTTON");
    var downloadVideoButtonText = document.createTextNode(
        "下载所有视频"
    );
    downloadVideoButton.appendChild(downloadVideoButtonText);
    downloadVideoButton.addEventListener("click", function () {
        downloadVideoOnClickHandler();
    });
    downloadVideoButton.className = "ldh-mo-dl";
    downloadVideoButton.style =
        "background-color: transparent; border: solid #808080 2px; border-radius: 20px; color: #545454;";
    article.insertBefore(downloadVideoButton, article.firstChild);
    // 图片下载按钮
    var downloadButton = document.createElement("BUTTON");
    var downloadButtonText = document.createTextNode(
        "下载所有图片 (" + imgs.length + ")"
    );
    downloadButton.appendChild(downloadButtonText);
    downloadButton.addEventListener("click", function () {
        downloadOnClickHandler(imgs);
    });
    downloadButton.className = "ldh-mo-dl";
    downloadButton.style =
        "background-color: transparent; border: solid #808080 2px; border-radius: 20px; color: #545454;";
    article.insertBefore(downloadButton, article.firstChild);
    // 图片链接生成按钮
    var generateButton = document.createElement("BUTTON");
    var generateButtonText = document.createTextNode("生成图片链接");
    generateButton.appendChild(generateButtonText);
    generateButton.addEventListener("click", function () {
        generateOnClickHandler(imgs);
    });
    generateButton.className = "ldh-mo-dl";
    generateButton.style =
        "background-color: transparent; border: solid #808080 2px; border-radius: 20px; color: #545454;";
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

function downloadVideoOnClickHandler() {
    var elems = document.querySelectorAll("script")
    var videos = Array.from(elems).filter(v => v.textContent.includes('mediaId') && !v.textContent.includes('blogTalkData')).map(v => JSON.parse(v.textContent.substring(v.textContent.indexOf('(')+1, v.textContent.lastIndexOf(')'))).mediaId);
    downloadVideos(videos);
}

function downloadAll(imgs) {
    // Thanks to https://github.com/y252328/Instagram_Download_Button
    imgs.map((img) =>
        fetch(img, {
            headers: new Headers({
                Origin: window.location.origin,
            }),
            mode: "cors",
            cache: "no-cache",
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

function downloadVideos(videos) {
    const videoRequestURL = 'https://production-ps.lvp.llnw.net/r/PlaylistService/media/<mediaId>/getMobilePlaylistByMediaId'
    var elems = document.querySelectorAll("script");
    var videos = Array.from(elems)
        .filter(
            (v) =>
                v.textContent.includes("mediaId") &&
                !v.textContent.includes("blogTalkData")
        )
        .map(
            (v) =>
                JSON.parse(
                    v.textContent.substring(
                        v.textContent.indexOf("(") + 1,
                        v.textContent.lastIndexOf(")")
                    )
                ).mediaId
        );
    videos.map(mediaId => fetch(videoRequestURL.replace('<mediaId>', mediaId), {
        headers: new Headers({
            Origin: window.location.origin,
            Referer: window.location.origin,
        }),
        mode: "cors",
        cache: "no-cache",
    })
        .then((response) => response.json())
        .then(
            (response) =>
                response.mediaList[0].mobileUrls.filter(
                    (v) => v.targetMediaPlatform == "MobileH264"
                )[0].mobileUrl
        )
        .then((mobileUrl) =>
            fetch(
                mobileUrl.replace("http://", "https://")
            ).then((response) => response.blob())
                .then((blob) =>
                    dowloadBlob(
                        window.URL.createObjectURL(blob),
                        mobileUrl.substring(mobileUrl.lastIndexOf("/") + 1)
                    )
                )
                .catch((e) => console.error(e))
        ));
}

function dowloadBlob(blob, filename) {
    var a = document.createElement("a");
    a.download = filename;
    a.href = blob;
    document.body.appendChild(a);
    a.click();
    a.remove();
}
