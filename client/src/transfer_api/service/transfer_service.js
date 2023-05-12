import mime from 'mime-types';
import { join, basename } from 'path';
import { TEMP_DIR, TRANSFER_DIR, TRANSFER_DIR_UPLOAD } from '../../../config.js';
import { deliver, receive, fileExists, extractDir, makeDirSafe, getFileType } from '../../utils/file_manager.js';

import { get as getTask } from '../../utils/task_manager.js';

export const download = (req, res) => {
  const fmResponse = deliver(req.query.file);
  const fileSize = fmResponse.stats.size;

  res.setHeader('Content-Length', fileSize);
  res.setHeader('Content-Type', getContentType(filePath));
  res.setHeader('Content-Disposition', `attachment; filename=${basename(filePath)}`);

  if (fmResponse.success) {
    fmResponse.pipe(res);
  } else {
    res.status(500).send(fmResponse);
  }
};

export const upload = (req, res) => {
  const task = getTask(req.params.id);
  const chunk = req.query.chunk;
  const filePath = task.path;
  // console.log(`Receieved chunk ${chunk} / ${task.totalChunk} for task ${task.id}`);
  checkDirectories();
  const fmResponse = receive(filePath, req.files['file'].data);
  if (fmResponse.success) {
    task.lastChunk = chunk;
    updateTask(task.id, task);
    if (chunk == task.totalChunk) {
      // console.log('transfer complete');
      if (fileExists(join(TRANSFER_DIR_UPLOAD, task.name))) {
        task.name = task.name + '__' + task.id;
      }
      const fmRenameResponse = renameFile(filePath, join(TRANSFER_DIR_UPLOAD, task.name));
      if (!fmRenameResponse.success) {
        res.status(500).send(fmRenameResponse);
      }

      // console.log('File Uploaded');
      res.status(201).send('File Uploaded');
    } else {
      res.status(200).send('Chunk Uploaded');
    }
  } else {
    res.status(500).send(fmResponse);
  }
};

export const readDir = (req, res) => {
  makeDirSafe(TRANSFER_DIR);
  res.status(200).send(extractDir(TRANSFER_DIR));
};

function getContentType(path) {
  const contentType = mime.lookup(getFileType(path));
  return contentType || 'application/octet-stream';
}

function checkDirectories() {
  makeDirSafe(TRANSFER_DIR);
  makeDirSafe(TRANSFER_DIR_UPLOAD);
  makeDirSafe(TEMP_DIR);
}
