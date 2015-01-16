# fast-upload

note: should change the function in multer/index.js

line 101:
var proceed = options.onFileUploadStart(file);
to
var proceed = options.onFileUploadStart(file, res);
