// ==UserScript==
// @name                mo (LDH) Images download
// @name:zh-CN          mo (LDH) 图片下载器
// @namespace           https://1mether.me/
// @version             0.14
// @description         Add download button for downloading ALL Images from LDH mo details page
// @description:zh-CN   在mo的内容页增加下载和复制图片链接的按钮，用于批量下载页面图片
// @author              乙醚(@locoda)
// @match               http*://m.tribe-m.jp/*
// @match               http*://m.ex-m.jp/*
// @match               http*://m.ldh-m.jp/*
// @match               http*://m.ldhgirls-m.jp/*
// @icon                https://www.google.com/s2/favicons?sz=64&domain=ldh.co.jp
// @source              https://gist.github.com/locoda/460ac9d42b05e75df12ef2f80d66c3d2
// @updateURL           https://gist.github.com/locoda/460ac9d42b05e75df12ef2f80d66c3d2/raw/ldh-mo-img-dl.user.js
// @downloadURL         https://gist.github.com/locoda/460ac9d42b05e75df12ef2f80d66c3d2/raw/ldh-mo-img-dl.user.js
// @grant               none
// @license             MIT
// ==/UserScript==

(function () {
    "use strict";
    // 在详情页注入按钮
    if (window.location.href.includes("detail")) {
        var imgs = findEligibleImgs();
        injectButtons(imgs);
    }
    // 删除图片保护
    removeProtectImg();
})();

function removeProtectImg() {
    document
        .querySelectorAll(".protectimg")
        .forEach((node) => node.classList.remove("protectimg"));
}

function findEligibleImgs() {
    const keywords = ["uplcmn", "upload"];
    return Array.from(document.querySelectorAll("article .protectimg img"))
        .map((img) => img.src)
        .filter((img) => keywords.some((k) => img.includes(k)));
}

function injectButtons(imgs) {
    var article = document.querySelector("article");
    if (article.classList.contains("article--news")) {
        // 新闻页面特殊处理
        article = article.querySelector(".article__body");
    }
    // 注入按钮 div
    var buttonsDiv = document.createElement("div");
    buttonsDiv.className = "ldh-mo-dl";
    buttonsDiv.style = "margin-top: 0.4em; margin-bottom: 0.4em;";
    article.insertBefore(buttonsDiv, article.firstChild);
    // 图片链接生成按钮
    const isMobile = () =>
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    if (isMobile()) {
        injectOneButton(buttonsDiv, "生成图片链接", function () {
            generateOnClickHandler(imgs);
        });
    }
    // 图片下载按钮
    injectOneButton(
        buttonsDiv,
        "下载所有图片 (" + imgs.length + ")",
        function () {
            downloadOnClickHandler(imgs);
        }
    );
    // 视频下载按钮
    if (document.querySelector("div.limelight-player")) {
        injectOneButton(buttonsDiv, "下载所有视频", function () {
            downloadVideoOnClickHandler();
        });
    }
}

function injectOneButton(element, textOnButton, clickListener) {
    var btn = document.createElement("BUTTON");
    var btnText = document.createTextNode(textOnButton);
    btn.appendChild(btnText);
    btn.addEventListener("click", clickListener);
    btn.style =
        "background-color: transparent; border: solid #808080 2px; border-radius: 20px; color: #545454; margin: 0.2em";
    element.appendChild(btn);
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
    console.log(videos);
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
    const videoRequestURL =
        "https://production-ps.lvp.llnw.net/r/PlaylistService/media/<mediaId>/getMobilePlaylistByMediaId";
    var elems = document.querySelectorAll("script");
    videos.map((mediaId) =>
        fetch(videoRequestURL.replace("<mediaId>", mediaId), {
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
                fetch(mobileUrl.replace("http://", "https://"))
                    .then((response) => response.blob())
                    .then((blob) => {
                        let tempName = mobileUrl.replace("/root-message-cxf-apache", "");
                        dowloadBlob(
                            window.URL.createObjectURL(blob),
                            tempName.substring(tempName.lastIndexOf("/") + 1)
                        );
                    })
                    .catch((e) => console.error(e))
            )
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
