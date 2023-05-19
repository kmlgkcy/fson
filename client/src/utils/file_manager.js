import fs from 'fs';
import fse from 'fs-extra';
import { basename, join } from 'path';

import prettyBytes from 'pretty-bytes';
export const deliver = (path, res) => {
  if (!fileExists(path)) {
    throw {
      kind: FMErrorCodes.NOT_EXISTS,
      message: 'Relevant file deleted or moved',
    };
  }
  const file = fs.createReadStream(path);
  file.pipe(res);
};

export const receive = async (path, data) => {
  if (!fileExists(path)) {
    return {
      kind: FMErrorCodes.NOT_EXISTS,
      message: 'Relevant file deleted or moved',
    };
  }
  try {
    await fs.promises.writeFile(path, data, { flag: 'a' });
    return { success: true };
  } catch (err) {
    console.error(err);
    return {
      kind: FMErrorCodes.UNKNOWN,
      message: 'Something went wrong while receiving the file',
    };
  }
};

export const extractStats = async (path) => {
  if (!fileExists(path)) {
    return {
      kind: FMErrorCodes.NOT_EXISTS,
      message: 'Relevant file deleted or moved',
    };
  }
  const stats = await fs.promises.stat(path);
  return {
    success: true,
    stats: stats,
  };
};

export const fileExists = (path) => {
  return fs.existsSync(path);
};

export const extractDir = async (dirPath) => {
  const directory = {
    name: basename(dirPath),
    files: [],
    subdirs: [],
  };

  try {
    const items = await fs.promises.readdir(dirPath, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory()) {
        const subdir = await extractDir(join(dirPath, item.name));
        directory.subdirs.push(subdir);
      } else if (item.isFile()) {
        const filePath = join(dirPath, item.name);
        const stats = await fs.promises.stat(filePath);

        directory.files.push({
          name: item.name,
          type: getFileType(item.name),
          size: prettyBytes(stats.size),
          path: filePath,
        });
      }
    }
  } catch (error) {
    console.error(error);
  }

  return directory;
};

export const extractFileInfo = (path, size) => {
  return {
    name: basename(path),
    type: getFileType(path),
    size: prettyBytes(size),
    path: path,
  };
};

export const makeDirSafe = (path) => {
  if (!fileExists(path)) {
    fs.mkdirSync(path);
  }
};

export const renameFile = (oldPath, newPath) => {
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.log(err);
      return {
        kind: FMErrorCodes.UNKNOWN,
        message: 'Something went wrong while receiving file',
      };
    }
    return {
      success: true,
    };
  });
};
export const removeDir = async (path) => {
  try {
    await fse.emptyDir(path);
  } catch (error) {
    console.log(error);
  }
};

export const removeFile = async (path) => {
  try {
    await fse.remove(path);
  } catch (error) {
    console.log(error);
  }
};

export const getFileType = (file) => {
  return file.split('.').pop();
};

export const FMErrorCodes = {
  NOT_EXISTS: 'FM_NOT_EXISTS',
  UNKNOWN: 'FM_UNKNOWN',
};
