import { batchCompress } from './main';

async function run() {
    try {
        await batchCompress({
            inputArr: ['./images/**/*.png'],
            format: 'png', // 'jpeg' | 'jp2' | 'png' | 'webp' | 'gif' | 'avif' | 'heif' | 'tiff'
            outputPath: './outputImg',
            outputConfig: {
                // docs: https://sharp.pixelplumbing.com/api-output#webp
                quality: 60,
            },
            maintainRelativePath: true,
        });
    } catch (error) {
        console.error('Error executing batchCompress:', error);
    }
}

run();
