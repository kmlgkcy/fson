import fs from 'fs';
import { join, basename } from 'path';
import prettyBytes from 'pretty-bytes';
import mime from 'mime-types';

export const downloadFile = (req, res) => {
  const filePath = req.query.file;
  const file = fs.createReadStream(filePath);
  const stat = fs.statSync(filePath);

  const fileSize = stat.size;
  res.setHeader('Content-Length', fileSize);
  res.setHeader('Content-Type', getContentType(filePath));
  res.setHeader('Content-Disposition', `attachment; filename=${basename(filePath)}`);
  file.pipe(res);
};

export const uploadFile = (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  checkMainDirectories();
  if (typeof req.files['file'] === 'object' && req.files['file']['name']) {
    const filePath = join(process.env.TRANSFER_DIR_UPLOAD, req.files['file']['name']);
    //   req.files['files'].mv(filePath);
    const ws = fs.createWriteStream(filePath);
    ws.write(req.files['file'].data);
  }
  res.status(200).send('File Uploaded');
  // console.log(error);
};

export const readTransferDir = () => {
  if (fs.existsSync(process.env.TRANSFER_DIR)) {
    return readDir('transfer', process.env.TRANSFER_DIR);
  } else {
    fs.mkdirSync(process.env.TRANSFER_DIR);
    return false;
  }
};

function readDir(dirName, dirPath) {
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
}

function getContentType(filePath) {
  const fileExt = filePath.split('.').pop();
  const contentType = mime.lookup(fileExt);
  return contentType || 'application/octet-stream';
}

function checkMainDirectories() {
  if (!fs.existsSync(process.env.TRANSFER_DIR)) {
    fs.mkdirSync(process.env.TRANSFER_DIR);
  }
  if (!fs.existsSync(process.env.TRANSFER_DIR_UPLOAD)) {
    fs.mkdirSync(process.env.TRANSFER_DIR_UPLOAD);
  }
}
