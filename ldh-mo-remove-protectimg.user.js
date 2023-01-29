// ==UserScript==
// @name                mo (LDH) Images Limitation Remover
// @name:zh-CN          mo (LDH) 图片解锁器
// @namespace           https://1mether.me/
// @version             0.3
// @description         Remove "protectimg" from the page
// @description:zh-CN   移除页面中的"protectimg"元素
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
    // 移除右键限制
    document.oncontextmenu = function () {
        return true;
    };
    // 移除protectimg限制
    document
        .querySelectorAll(".protectimg")
        .forEach((node) => node.classList.remove("protectimg"));
})();
