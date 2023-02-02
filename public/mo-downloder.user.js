// ==UserScript==
// @name                mo (LDH) 下载器
// @namespace           https://1mether.me/
// @version             0.32
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
    // ================
    // =    Consts    =
    // ================

    const isMobile = () =>
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );

    const keywords = ["uplcmn", "upload"];

    // ==============
    // =    Main    =
    // ==============

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

    if (
        window.location.href.includes("artistphoto") ||
        window.location.href.includes("artist_photo")
    ) {
        injectArtistPhodoDownloadButton();
    }

    // ===============
    // =    Utils    =
    // ===============

    function removeProtectImg() {
        // 移除右键限制
        document.oncontextmenu = function () {
            return true;
        };
        // 移除protectimg限制
        document
            .querySelectorAll(".protectimg")
            .forEach((node) => node.classList.remove("protectimg"));
        moDownloaderLog("移除右键限制");
    }

    // ================================
    // =    Button Injection Utils    =
    // ================================

    function injectDownloadAllButtons() {
        var article = document.querySelector("article");
        if (article.classList.contains("article--news")) {
            // 新闻页面特殊处理
            article = article.querySelector(".article__body");
        }
        attachButtonToArticle(article);
    }

    function findEligibleImgs(article) {
        return Array.from(article.querySelectorAll("img"))
            .map((img) => img.src)
            .filter((img) => keywords.some((k) => img.includes(k)));
    }

    function attachButtonToArticle(article) {
        var imgs = findEligibleImgs(article);
        // 注入按钮 div
        var buttonsDiv = document.createElement("div");
        buttonsDiv.className = "ldh-mo-dl";
        buttonsDiv.style = "margin-top: 0.4em; margin-bottom: 0.4em;";
        article.insertBefore(buttonsDiv, article.firstChild);
        // 图片链接生成按钮
        if (isMobile()) {
            injectOneButton(
                buttonsDiv,
                "生成图片链接(" + imgs.length + ")",
                function () {
                    generateOnClickHandler(buttonsDiv, article);
                }
            );
        } else {
            // 图片下载按钮
            injectOneButton(
                buttonsDiv,
                "下载所有图片 (" + imgs.length + ")",
                function () {
                    downloadOnClickHandler(article);
                }
            );
        }
        // 视频下载按钮
        if (
            article.querySelector("div.limelight-player") ||
            article.querySelector("a.popup_link")
        ) {
            // List View 视频
            injectPerVideoDownloadButton(article);
            // Timeline 视频
            injectPerVideoDownloadButtonForTimeline(article);
        }
        moDownloaderLog("注入按钮");
    }

    function injectPerVideoDownloadButton(div) {
        div.querySelectorAll("div.limelight-player").forEach((videoDiv) => {
            var mediaId = videoDiv.id.substring(videoDiv.id.lastIndexOf("_") + 1);
            moDownloaderDebug("正在下载视频： " + mediaId);
            injectOneButton(videoDiv.parentElement, "下载视频", function (event) {
                downloadVideo(
                    event.target,
                    mediaId,
                    getPrefixFromArticle(div) || getPrefixFromMovieDocument()
                );
            });
        });
    }

    function injectArtistPhodoDownloadButton() {
        var inner = document.querySelector("#cms-inner");
        if (inner) {
            // New Page
            var title = inner.querySelector(".cms-section__inner__one-col");
            var imgs = Array.from(inner.querySelectorAll("ldh-cms-img img")).map(
                (img) => img.src
            );
        } else {
            // Legacy Page
            inner = document.querySelector(".inner");
            var title = inner.querySelector("section");
            var imgs = Array.from(inner.querySelectorAll("img")).map(
                (img) => img.src
            );
        }
        var buttonsDiv = document.createElement("div");
        buttonsDiv.className = "ldh-mo-dl";
        buttonsDiv.style = "margin-top: 0.4em; margin-bottom: 0.4em;";
        title.append(buttonsDiv);
        injectOneButton(
            buttonsDiv,
            "下载所有图片 (" + imgs.length + ")",
            function () {
                downloadImages(imgs, document.title.split("|")[0]);
            }
        );
    }

    function injectPerVideoDownloadButtonForTimeline(div) {
        div.querySelectorAll("a.popup_link").forEach((videoDiv) => {
            var mediaId = videoDiv
                .getAttribute("onclick")
                .split("movie/")[1]
                .split("/")[0];
            moDownloaderDebug("正在下载视频： " + mediaId);
            injectOneButton(videoDiv.parentElement, "下载视频", function (event) {
                downloadVideo(
                    event.target,
                    mediaId,
                    getPrefixFromArticle(div) || getPrefixFromMovieDocument()
                );
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

    function downloadOnClickHandler(article) {
        downloadImages(findEligibleImgs(article), getPrefixFromArticle(article));
    }

    function generateOnClickHandler(buttonsDiv, article) {
        var imgs = findEligibleImgs(article);
        var textarea = buttonsDiv.querySelector("textarea.ldh-mo-dl");
        if (!textarea) {
            textarea = document.createElement("textarea");
            textarea.className = "ldh-mo-dl";
            textarea.style = "height: 100px; width: 80%;";
            var br = document.createElement("br");
            buttonsDiv.insertBefore(br, buttonsDiv.firstChild);
            buttonsDiv.insertBefore(textarea, buttonsDiv.firstChild);
        }
        textarea.value = imgs.join("\n");
        textarea.select();
    }

    function customizedTimelinePage() {
        // 初始化
        document
            .querySelectorAll("ldh-infinite-scroll article")
            .forEach((article) => attachButtonToArticle(article));
        //
        const infiniteScrollContainer = document.querySelector(
            "ldh-infinite-scroll"
        );
        const config = { childList: true };
        const observer = new MutationObserver(function (mutations, observer) {
            var nodes = mutations.find((r) =>
                Array.from(r.addedNodes).filter((n) => (n.className = "article"))
            ).addedNodes;
            nodes.forEach((node) =>
                attachButtonToArticle(node.querySelector("article"))
            );
            removeProtectImg();
            moDownloaderDebug("解除刷新后时间线右键限制");
        });
        observer.observe(infiniteScrollContainer, config);
        moDownloaderLog("Timeline页面注入按钮");
    }

    // ========================
    // =    Download Utils    =
    // ========================

    function downloadImages(imgs, prefix = "") {
        moDownloaderDebug("正在下载图片： " + imgs);
        // Thanks to https://github.com/y252328/Instagram_Download_Button
        if (imgs.length <= 10) {
            // 同时最多下载十张图
            imgs.map((img) => downloadOneImage(img, prefix));
        } else {
            // 设置延时下载更多图片 https://stackoverflow.com/questions/56244902/56245610#56245610
            imgs.forEach((img, index) => {
                setTimeout(function () {
                    downloadOneImage(img, prefix);
                }, index * 300);
            });
        }
    }

    function downloadOneImage(img, prefix = "") {
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
                    prefix + img.substring(img.lastIndexOf("/") + 1)
                )
            )
            .catch((e) => console.error(e));
    }

    function downloadVideo(button, video, prefix = "") {
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
            .then((response) => {
                // 主m3u8
                let m3u8Url = response.mediaList[0].mobileUrls
                    .find((v) => v.targetMediaPlatform == "HttpLiveStreaming")
                    .mobileUrl.replace("http://", "https://");
                fetch(m3u8Url)
                    .then((response) => response.text())
                    .then((response) => {
                        // 获取m3u8中最高清的
                        const bandwithRe = /BANDWIDTH=(\d+)/i;
                        var eligibleStreamsRaw = response
                            .split("#EXT-X-STREAM-INF:")
                            .slice(1);
                        eligibleStreamsRaw.sort((a, b) => {
                            return (
                                parseInt(b.match(bandwithRe)[1]) -
                                parseInt(a.match(bandwithRe)[1])
                            );
                        });
                        var candidate = eligibleStreamsRaw[0].split("\n")[1];
                        return new URL(candidate, new URL(m3u8Url).origin).href;
                    })
                    .then((m3u8Url) =>
                        openM3U8ToolBox(
                            button,
                            m3u8Url,
                            prefix + getFilenameFromVideoUrl(m3u8Url)
                        )
                    );
            });
    }

    function dowloadBlob(blob, filename) {
        var a = document.createElement("a");
        a.download = filename;
        a.href = blob;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    function openM3U8ToolBox(button, m3u8Url, filename) {
        // 打开 https://tools.thatwind.com/tool/m3u8downloader
        if (isMobile()) {
            let id = btoa(encodeURIComponent(filename));
            var a = button.parentElement.querySelector("a.mo-downloader");
            if (!a) {
                var a = document.createElement("a");
                var aText = document.createTextNode("点击打开下载页面");
                a.className = "mo-downloader";
                a.append(aText);
                a.target = "_blank";
                a.href = constructM3U8ToolBoxURL(m3u8Url, filename);
                button.parentElement.appendChild(document.createElement("br"));
                button.parentElement.appendChild(a);
            }
        } else {
            var a = document.createElement("a");
            a.target = "_blank";
            a.href = constructM3U8ToolBoxURL(m3u8Url, filename);
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    }

    function constructM3U8ToolBoxURL(m3u8Url, filename) {
        var url =
            "https://tools.thatwind.com/tool/m3u8downloader#" +
            "m3u8=" +
            encodeURIComponent(m3u8Url) +
            "&referer=" +
            encodeURIComponent(window.location.href) +
            "&filename=" +
            filename;
        moDownloaderDebug(url);
        return url;
    }

    // ======================
    // =    Naming Utils    =
    // ======================

    function getPrefixFromArticle(article) {
        var candidate =
            article.querySelector(".article__head") ||
            article.querySelector(".article__header");
        if (candidate) {
            return sanitizeFileName(
                candidate.textContent
                    .split(/\s/g)
                    .filter((s) => s)
                    .join("_") + "_"
            );
        }
        return "";
    }

    function getPrefixFromMovieDocument() {
        var candidate = document.querySelector(".movie-title-block");
        if (candidate) {
            return sanitizeFileName(
                candidate.textContent
                    .split(/\s/g)
                    .filter((s) => s)
                    .join("_") + "_"
            );
        }
        return "";
    }

    function getFilenameFromVideoUrl(url) {
        let tempName = url.replace("/root-message-cxf-apache", "");
        tempName = tempName
            .substring(tempName.lastIndexOf("/") + 1)
            .replace(".m3u8", ".ts");
        return tempName;
    }

    function sanitizeFileName(input, replacement = "_") {
        // Thanks to https://github.com/parshap/node-sanitize-filename/blob/master/index.js
        const illegalRe = /[\/\?<>\\:\*\|"]/g;
        const controlRe = /[\x00-\x1f\x80-\x9f]/g;
        const reservedRe = /^\.+$/;
        const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
        const windowsTrailingRe = /[\. ]+$/;
        return input
            .replace(illegalRe, replacement)
            .replace(controlRe, replacement)
            .replace(reservedRe, replacement)
            .replace(windowsReservedRe, replacement)
            .replace(windowsTrailingRe, replacement);
    }

    // =======================
    // =    Logging Utils    =
    // =======================

    function moDownloaderLog(msg) {
        console.log("[mo-downloder] " + msg);
    }

    function moDownloaderDebug(msg) {
        console.debug("[mo-downloder] " + msg);
    }
})();
