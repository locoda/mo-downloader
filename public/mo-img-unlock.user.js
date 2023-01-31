// ==UserScript==
// @name                mo (LDH) 图片解锁器
// @namespace           https://1mether.me/
// @version             0.6
// @description         解锁mo页面图片右键功能
// @author              乙醚(@locoda)
// @match               http*://m.tribe-m.jp/*
// @match               http*://m.ex-m.jp/*
// @match               http*://m.ldh-m.jp/*
// @match               http*://m.ldhgirls-m.jp/*
// @icon                https://www.google.com/s2/favicons?sz=64&domain=ldh.co.jp
// @source              https://github.com/locoda/mo-downloader
// @updateURL           https://github.com/locoda/mo-downloader/raw/main/mo-img-unlock.user.js
// @downloadURL         https://github.com/locoda/mo-downloader/raw/main/mo-img-unlock.user.js
// @grant               none
// @license             MIT
// ==/UserScript==

(function () {
    "use strict";
    // 移除右键限制
    document.oncontextmenu = function () {
        return true;
    };
    // 移除protectimg限制
    document
        .querySelectorAll(".protectimg")
        .forEach((node) => node.classList.remove("protectimg"));
    // 监控 DOM 变化
    var observer = new MutationObserver(function (mutations, observer) {
        console.log(mutations)
        // 如果有变化再移除protectimg限制
        document
            .querySelectorAll(".protectimg")
            .forEach((node) => node.classList.remove("protectimg"));
    });
    observer.observe(document, {
        subtree: true,
        childList: true,
    });
})();
