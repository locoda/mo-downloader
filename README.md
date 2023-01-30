# mo (LDH) 图片下载脚本/图片解锁脚本

【[GitHub主页](https://github.com/locoda/mo-downloader)】【[作者微博](https://weibo.com/locoda)⬅️反馈】

## 功能

解锁mo页面右键限制、解锁图片下载保存限制

在Blog内容页等添加可以下载mo页面所有图片/视频的按钮，对每个视频添加下载按钮

## 快捷链接

如果你知道什么是用户脚本（油猴脚本）应该就不用看下面的教学了……（下面都是安装方式选一个就行哦！）

### 图片下载器 

【[GreasyFork](https://greasyfork.org/scripts/459051)】【[GitHub](https://github.com/locoda/mo-downloader/raw/main/mo-downloder.user.js)（🪜）】
包括所有功能（解锁图片、下载图片、下载视频）

### 图片解锁器 

【[GreasyFork](https://greasyfork.org/scripts/459052)】【[GitHub](https://github.com/locoda/mo-downloader/raw/main/mo-img-unlock.user.js) （🪜）】
仅包括解锁图片功能

## 电脑端使用方法

1. 安装一个用户脚本管理器
   - 我使用的是Tampermonkey（油猴）（[官网](https://www.tampermonkey.net/)）（[Chrome商店](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)）
2. 前往【[GreasyFork](https://greasyfork.org/scripts/459051)】安装最新版的图片下载器用户脚本（脚本管理器自动识别）
   - 如果你只需要解锁图片右键功能，请前往【[GreasyFork](https://greasyfork.org/scripts/459052)】安装轻量版图片解锁器
3. 在mo的页面中点击【下载所有图片】或【下载所有视频】按钮即可
   - ![Chrome Download Demo](https://cdn.statically.io/gh/locoda/mo-downloader/main/demos/chrome-download.png)

## （测试中）iOS端使用方法

1. 安装一个用户脚本管理器
   - （Safari用户）我使用的是Stay（[AppStore](https://apps.apple.com/cn/app/stay-%E7%BD%91%E9%A1%B5%E7%BA%AF%E6%B5%8F%E8%A7%88/id1591620171)）（[GitHub](https://github.com/shenruisi/Stay)）
     - 安装后请打开Stay按照软件内提示设置
   - （Alook用户）请下载【[这个文件](https://cdn.statically.io/gh/locoda/mo-downloader/main/mo-downloader.alook)】，在下载管理中点击文件【添加扩展】后，直接前往3
     - 请注意，Alook扩展无法自动更新，重新安装前请在【设置-自定义设置-JavaScript扩展】中删除原本的【mo下载器】文件
2. 前往【[GreasyFork](https://greasyfork.org/scripts/459051)】安装最新版的用户脚本
   - 如图所示：点击下方安装、点击右上角创建或保存、确认脚本存在
   - ![Install User Script on iOS](https://cdn.statically.io/gh/locoda/mo-downloader/main/demos/iOS-user-script-install.png)
   - 如果你只需要解锁图片功能，请前往【[GreasyFork](https://greasyfork.org/scripts/459052)】安装轻量版图片解锁器
3. 【[点击这里](https://www.icloud.com/shortcuts/bbd0e1dc58ed416f912ebb060beea996)】安装配套的iOS快捷指令
4. 在mo的页面中点击【生成图片链接】按钮，将生成的文本分享至iOS快捷指令中，图片将直接保存到相册
   - （这里应该有一张动图，没有的话点[此处](https://cdn.statically.io/gh/locoda/mo-downloader/main/demos/iOS-download.gif))
   ![iOS Download Demo](https://cdn.statically.io/gh/locoda/mo-downloader/main/demos/iOS-download.gif)

## 安卓端使用方法

由于我没有安卓手机……😭

## 我可能想增加……（Todo/Wishlist）

- [ ] Timeline界面的下载功能
