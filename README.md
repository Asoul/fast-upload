# fast-upload

## Spec
Page is extradinary simple, so very fast

## Usage
should change the function in multer/index.js

line 101:
var proceed = options.onFileUploadStart(file);
to
var proceed = options.onFileUploadStart(file, res);