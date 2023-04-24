import { join } from 'path';
import fs from 'fs';
import prettyBytes from 'pretty-bytes';

export const download = (req, res) => {
  try {
    res.status(200).download(req.query.file);
  } catch (error) {
    // console.log(error);
    res.status(500).send('Something Went Wrong');
  }
};

export const upload = (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    if (!fs.existsSync(process.env.TRANSFER_DIR)) {
      fs.mkdirSync(process.env.TRANSFER_DIR);
    }
    if (!fs.existsSync(process.env.TRANSFER_DIR_UPLOAD)) {
      fs.mkdirSync(process.env.TRANSFER_DIR_UPLOAD);
    }
    if (typeof req.files['files'] === 'object' && req.files['files']['name']) {
      req.files['files'].mv(join(process.env.TRANSFER_DIR_UPLOAD, req.files['files']['name']));
    } else {
      req.files['files'].forEach((file, index) => {
        if (file['name']) {
          file.mv(join(process.env.TRANSFER_DIR_UPLOAD, file['name']));
        }
      });
    }
    res.status(200).send('File Uploaded');
  } catch (error) {
    // console.log(error);
    res.status(500).send('Something Went Wrong');
  }
};

export const getFileNames = (req, res) => {
  const files = readTransferDir();
  if (!files) {
    res.status(200).send('Host not provided any file');
  } else {
    res.status(200).send(files);
  }
};

const readTransferDir = () => {
  if (fs.existsSync(process.env.TRANSFER_DIR)) {
    return readDir('transfer', process.env.TRANSFER_DIR);
  } else {
    fs.mkdirSync(process.env.TRANSFER_DIR);
    return false;
  }
};

const readDir = (dirName, dirPath) => {
  let directory = {
    name: dirName,
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
          size: prettyBytes(fs.statSync(join(dirPath, item.name)).size),
          path: join(dirPath, item.name),
        });
      }
    }
  });
  return directory;
};
