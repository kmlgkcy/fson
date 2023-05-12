import fs from 'fs';
import { basename, join } from 'path';

import prettyBytes from 'pretty-bytes';

export const deliver = (path) => {
  if (!fileExists(path)) {
    return {
      kind: FMErrorCodes.NOT_EXISTS,
      message: 'Relevant file deleted or moved',
    };
  }
  const file = fs.createReadStream(path);
  const stats = fs.statSync(path);
  return {
    success: true,
    pipe: file.pipe,
    stats: stats,
  };
};

export const receive = (path, data) => {
  if (!fileExists(path)) {
    return {
      kind: FMErrorCodes.NOT_EXISTS,
      message: 'Relevant file deleted or moved',
    };
  }
  const ws = fs.createWriteStream(path, { flags: 'a' });
  ws.write(data, (err) => {
    if (err) {
      console.log(err);
      return {
        kind: FMErrorCodes.UNKNOWN,
        message: 'Something went wrong while receiving file',
      };
    } else {
      return {
        success: true,
      };
    }
  });
};

export const fileExists = (path) => {
  return fs.existsSync(path);
};

export const extractDir = (dirPath) => {
  let directory = {
    name: basename(dirPath),
    files: [],
    subdirs: [],
  };

  fs.readdirSync(dirPath, { withFileTypes: true }).map((item) => {
    if (item.isDirectory()) {
      directory.subdirs.push(readDir(item.name, join(dirPath, item.name)));
    } else {
      if (item.isFile) {
        return directory.files.push({
          name: item.name,
          type: getFileType(item.name),
          size: prettyBytes(fs.statSync(join(dirPath, item.name)).size),
          path: join(dirPath, item.name),
        });
      }
    }
  });
  return directory;
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

export const getFileType = (file) => {
  return file.split('.').pop();
};

export const FMErrorCodes = {
  NOT_EXISTS: 'FM_NOT_EXISTS',
  UNKNOWN: 'FM_UNKNOWN',
};
