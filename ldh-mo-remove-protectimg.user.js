// ==UserScript==
// @name                mo (LDH) Images Limitation Remover
// @name:zh-CN          mo (LDH) 图片解锁器
// @namespace           https://1mether.me/
// @version             0.1
// @description         Remove "protectimg" from the page
// @description:zh-CN   移除页面中的"protectimg"元素
// @author              乙醚(@locoda)
// @match               http*://m.tribe-m.jp/diary/detail?id=*
// @match               http*://m.tribe-m.jp/image_diary/detail?id=*
// @match               http*://m.tribe-m.jp/news/detail?news_id=*
// @match               http*://m.ex-m.jp/diary/detail?id=*
// @match               http*://m.ex-m.jp/image_diary/detail?id=*
// @match               http*://m.ex-m.jp/news/detail?news_id=*
// @match               http*://m.ldh-m.jp/diary/detail?id=*
// @match               http*://m.ldh-m.jp/image_diary/detail?id=*
// @match               http*://m.ldh-m.jp/news/detail?news_id=*
// @match               http*://m.ldhgirls-m.jp/diary/detail?id=*
// @match               http*://m.ldhgirls-m.jp/image_diary/detail?id=*
// @match               http*://m.ldhgirls-m.jp/news/detail?news_id=*
// @icon                https://www.google.com/s2/favicons?sz=64&domain=tribe-m.jp
// @source              https://gist.github.com/locoda/460ac9d42b05e75df12ef2f80d66c3d2
// @updateURL           https://gist.github.com/locoda/460ac9d42b05e75df12ef2f80d66c3d2/raw/ldh-mo-remove-protectimg.user.js
// @downloadURL         https://gist.github.com/locoda/460ac9d42b05e75df12ef2f80d66c3d2/raw/ldh-mo-remove-protectimg.user.js
// @grant               none
// @license             MIT
// ==/UserScript==

(function () {
    "use strict";
    var protectImgs = document.querySelectorAll(".protectimg");
    protectImgs.forEach(node => node.classList.remove("protectimg"));
})();
