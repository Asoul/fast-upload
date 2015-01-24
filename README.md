# fast-upload

這是一個極簡的檔案上傳網站，用 nodejs 寫的，前端頁面超簡單，所以載入速度超快。

## 安裝使用方法

1. <code>git clone https://github.com/Asoul/fast-upload.git</code>
2. <code>npm install</code>
3. 把原本 `multer/index.js` 裡面的 code 改一下：

	>line 101:<br/>
	<code>
	var proceed = options.onFileUploadStart(file);
	</code>
	<br/>變成<br/>
	<code>
	var proceed = options.onFileUploadStart(file, res);
	</code>
	>

4. 記得要開 `redis-server`
5. 最後就可以打開囉 `node app.js`

## 更新進度

#### 2015/01/24 (v1.2.0)
1. 使用 morgan，可以輸出 log
2. 可以與 1.0.0 相容

#### 2015/01/23 (v1.1.0)
1. 檔案上傳後會自動改檔名，下載後再改回來
2. 用 redis 當 Database，所以 server 重開舊的紀錄都在
3. 新增 404 not found 頁面
4. server log 統一格式

#### v1.0.0
1. 基本上傳功能


## TODO
1. 上傳進度條
2. 上次砍檔時間
3. 歷史上傳資料
4. favicon 讓它顯示出來