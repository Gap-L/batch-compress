# batch-compress

## Install
```
npm i @gaplin/batch-compress -D
```

## Usage
``` ts
const { batchCompress } = require('@gaplin/batch-compress');
batchCompress({
    // 需要压缩的图片路径
    inputArr: ['./images/**/*.png'],
    format: 'png', // 'jpeg' | 'jp2' | 'png' | 'webp' | 'gif' | 'avif' | 'heif' | 'tiff'
    // 压缩后的图片输出路径
    outputPath: `./outputImg`,
    outputConfig: {
        // docs: https://sharp.pixelplumbing.com/api-output#webp
        quality: 60,
    },
    maintainRelativePath: true,
})
```
