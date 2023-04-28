import fs from 'fs';
import { join, basename } from 'path';
import prettyBytes from 'pretty-bytes';
import mime from 'mime-types';
import { TEMP_DIR, TRANSFER_DIR, TRANSFER_DIR_UPLOAD } from '../../config.js';
import { get as getTask, update as updateTask } from './task_manager.js';

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
    const filePath = join(TRANSFER_DIR_UPLOAD, req.files['file']['name']);
    //   req.files['files'].mv(filePath);
    const ws = fs.createWriteStream(filePath);
    ws.write(req.files['file'].data);
  }
  res.status(200).send('File Uploaded');
  // console.log(error);
};

export const uploadLargeFile = (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    checkMainDirectories();
    if (typeof req.files['file'] === 'object' && req.files['file']['name']) {
      const task = getTask(req.params.id);
      const chunk = req.query.chunk;
      const filePath = task.path;
      // console.log(`Receieved chunk ${chunk} / ${task.totalChunk} for task ${task.id}`);
      if (!fs.existsSync(filePath)) {
        res.status(500).send('Host deleted or removed file');
        return;
      }
      const ws = fs.createWriteStream(filePath, { flags: 'a' });
      ws.write(req.files['file'].data, (err) => {
        if (err) {
          // console.log(err);
          res.status(500).send('Host Error');
        } else {
          task.lastChunk = chunk;
          updateTask(task.id, task);
          if (chunk == task.totalChunk) {
            // console.log('transfer complete');
            if (fs.existsSync(join(TRANSFER_DIR_UPLOAD, task.name))) {
              task.name = task.id + '__' + task.name;
            }
            renameFile(filePath, join(TRANSFER_DIR_UPLOAD, task.name));
            // console.log('File Uploaded');
            res.status(201).send('File Uploaded');
          } else {
            res.status(200).send('Chunk Uploaded');
          }
        }
      });
    }
  } catch (error) {
    // console.log(error);
    res.status(500).send('Something Went Wrong');
  }
};

export const readTransferDir = () => {
  if (fs.existsSync(TRANSFER_DIR)) {
    return readDir('transfer', TRANSFER_DIR);
  } else {
    fs.mkdirSync(TRANSFER_DIR);
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
  if (!fs.existsSync(TRANSFER_DIR)) {
    fs.mkdirSync(TRANSFER_DIR);
  }
  if (!fs.existsSync(TRANSFER_DIR_UPLOAD)) {
    fs.mkdirSync(TRANSFER_DIR_UPLOAD);
  }
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
  }
}

function renameFile(oldPath, newPath) {
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      // console.log(err);
      return false;
    }
    return true;
  });
}
