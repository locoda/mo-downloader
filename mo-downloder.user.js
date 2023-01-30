// ==UserScript==
// @name                mo (LDH) 下载器
// @namespace           https://1mether.me/
// @version             0.22
// @description         在mo的内容页增加图片和视频下载的按钮， 解锁右键功能
// @author              乙醚(@locoda)
// @match               http*://m.tribe-m.jp/*
// @match               http*://m.ex-m.jp/*
// @match               http*://m.ldh-m.jp/*
// @match               http*://m.ldhgirls-m.jp/*
// @icon                https://www.google.com/s2/favicons?sz=64&domain=ldh.co.jp
// @source              https://github.com/locoda/mo-downloader
// @updateURL           https://github.com/locoda/mo-downloader/raw/main/mo-downloder.user.js
// @downloadURL         https://github.com/locoda/mo-downloader/raw/main/mo-downloder.user.js
// @license             MIT
// ==/UserScript==

(function () {
    "use strict";
    // 删除图片保护
    removeProtectImg();
    // 在详情页注入按钮
    if (window.location.href.includes("detail")) {
        injectDownloadAllButtons();
    }
    // 根据视频注入按钮
    if (window.location.href.includes("movie")) {
        if (document.querySelector("div.limelight-player")) {
            injectPerVideoDownloadButton(document);
        }
    }
    // 在时间轴界面设置Listener
    if (window.location.href.includes("timeline")) {
        // 等待加载scroll
        (function init() {
            var counter = document.querySelector("ldh-infinite-scroll");
            if (counter) {
                customizedTimelinePage();
            } else {
                setTimeout(init, 300);
            }
        })();
    }
})();

function removeProtectImg() {
    // 移除右键限制
    document.oncontextmenu = function () {
        return true;
    };
    // 移除protectimg限制
    document
        .querySelectorAll(".protectimg")
        .forEach((node) => node.classList.remove("protectimg"));
}

function findEligibleImgs(article) {
    const keywords = ["uplcmn", "upload"];
    return Array.from(article.querySelectorAll("img"))
        .map((img) => img.src)
        .filter((img) => keywords.some((k) => img.includes(k)));
}

function injectDownloadAllButtons() {
    var article = document.querySelector("article");
    if (article.classList.contains("article--news")) {
        // 新闻页面特殊处理
        article = article.querySelector(".article__body");
    }
    attachButtonToArticle(article);
}

function attachButtonToArticle(article) {
    var imgs = findEligibleImgs(article);
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
            generateOnClickHandler(buttonsDiv, imgs);
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
    if (article.querySelector("div.limelight-player")) {
        injectOneButton(buttonsDiv, "下载所有视频", function () {
            downloadVideoOnClickHandler(article);
        });
        injectPerVideoDownloadButton(article);
    }
}

function injectPerVideoDownloadButton(div) {
    div.querySelectorAll("div.limelight-player").forEach((videoDiv) => {
        var mediaId = videoDiv.id.substring(videoDiv.id.lastIndexOf("_") + 1);
        injectOneButton(videoDiv.parentElement, "下载这个视频", function () {
            downloadVideo(mediaId);
        });
    });
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

function generateOnClickHandler(article, imgs) {
    console.log(imgs);
    var textarea = article.querySelector("textarea.ldh-mo-dl");
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

function downloadVideoOnClickHandler(artile) {
    var elems = artile.querySelectorAll("script");
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
    videos.map((video) => downloadVideo(video));
}

function customizedTimelinePage() {
    // 初始化
    document
        .querySelectorAll("ldh-infinite-scroll article")
        .forEach((article) => attachButtonToArticle(article));
    //
    const infiniteScrollContainer = document.querySelector("ldh-infinite-scroll");
    const config = { childList: true };
    const observer = new MutationObserver(function (mutations, observer) {
        var nodes = mutations.find((r) =>
            Array.from(r.addedNodes).filter((n) => (n.className = "article"))
        ).addedNodes;
        nodes.forEach((node) =>
            attachButtonToArticle(node.querySelector("article"))
        );
        removeProtectImg();
    });
    observer.observe(infiniteScrollContainer, config);
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

function downloadVideo(video) {
    const videoRequestURL =
        "https://production-ps.lvp.llnw.net/r/PlaylistService/media/<mediaId>/getMobilePlaylistByMediaId";
    fetch(videoRequestURL.replace("<mediaId>", video), {
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
