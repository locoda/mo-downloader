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
    var protectImgs = document.querySelectorAll(".protectimg");
    protectImgs.forEach(node => node.classList.remove("protectimg"));
})();
