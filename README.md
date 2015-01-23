# fast-upload

這是一個極簡的檔案上傳網站，用 nodejs 寫的，前端頁面超簡單，所以載入速度超快。

## 安裝使用方法

1. <code>git clone https://github.com/Asoul/fast-upload.git</code>

2. 把原本 `multer/index.js` 裡面的 code 改一下：
3. 記得要開 `redis-server`

>line 101:<br/>
<code>
var proceed = options.onFileUploadStart(file);
</code>
<br/>變成<br/>
<code>
var proceed = options.onFileUploadStart(file, res);
</code>

>


## 更新進度

#### 2015/01/23
1. 檔案上傳後會自動改檔名，下載後再改回來
2. 用 redis 當 Database，所以 server 重開舊的紀錄都在
3. 新增 404 not found 頁面
4. 加了 favicon
5. server log 統一格式

## TODO
1. 上傳進度條
2. 上次砍檔時間
3. 歷史上傳資料
4. favicon 要改 url