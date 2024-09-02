import fs from "fs";
import path from "path";
import sharp from "sharp";
import fg from "fast-glob";

type OutputConfig = {
  quality?: number; // 根据需要添加更多选项
};

interface batchCompressOptions {
  inputArr: string[];
  format: "png" | "jpeg" | "webp" | "tiff"; // 添加更多支持的格式
  outputPath: string;
  outputConfig?: OutputConfig;
  maintainRelativePath?: boolean;
}

const getFileName = (filePath: string): string => {
  return filePath.replace(/(.*\/)*([^.]+).*/gi, "$2");
};

const getRelativePathName = (filePath: string): [string, string] => {
  const p = filePath.split("/");

  if (p[0] === ".") p.shift();

  const f = p[p.length - 1].split(".");
  if (f.length >= 2) f.pop();

  p[p.length - 1] = f.join(".");
  const pathName = p.join("/");

  p.pop();
  return [pathName, p.join("/")];
};

const batchCompress = async (options: batchCompressOptions): Promise<void> => {
  const {
    inputArr = [],
    format = "png",
    outputPath,
    outputConfig = {},
    maintainRelativePath = true,
  } = options;

  if (!outputPath || !inputArr.length || !format) return;

  const entries = await fg(inputArr, { dot: true });

  console.log("input file list: ", entries);

  const isExist = fs.existsSync(path.normalize(outputPath));
  if (!isExist) fs.mkdirSync(outputPath);

  const res = await Promise.allSettled(
    entries.map(async (filePath) => {
      let targetPathName = "";

      if (maintainRelativePath) {
        const [pathName, pathWithoutName] = getRelativePathName(filePath);
        targetPathName = path.join(outputPath, `${pathName}.${format}`);
        const targetPath = path.join(outputPath, pathWithoutName);

        if (!fs.existsSync(path.normalize(targetPath))) {
          const parentDir = path.dirname(targetPath);
          if (!fs.existsSync(parentDir)) {
            fs.mkdirSync(parentDir, { recursive: true });
          }
          try {
            fs.mkdirSync(targetPath);
            console.log(`Directory created at ${targetPath}`);
          } catch (err) {
            console.error(`Error creating directory: ${err}`);
          }
        }
      } else {
        targetPathName = path.join(
          outputPath,
          `${getFileName(filePath)}.${format}`
        );
      }

      // compress and output
      await sharp(filePath)[format](outputConfig).toFile(targetPathName);
    })
  );

  const errors = res.filter((it) => it.status === "rejected");

  console.log(
    `${
      res.length - errors.length
    } tasks finished! Please check the path ${outputPath}.`
  );
  if (errors.length) console.error(errors.map((e) => (e as any).reason));
};

export { batchCompress };
