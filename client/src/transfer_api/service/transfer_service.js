import mime from 'mime-types';
import { join, basename } from 'path';
import { TEMP_DIR, TRANSFER_DIR, TRANSFER_DIR_UPLOAD } from '../../../config.js';
import {
  deliver,
  receive,
  fileExists,
  extractDir,
  makeDirSafe,
  getFileType,
  extractStats,
  renameFile,
  extractFileInfo,
} from '../../utils/file_manager.js';

import { get as getTask, update as updateTask } from '../../utils/task_manager.js';
import { getAll } from '../../utils/config_manager.js';

export const download = async (req, res) => {
  const filePath = req.query.file;
  const fmResponse = await extractStats(filePath);
  if (fmResponse.success) {
    const fileSize = fmResponse.stats.size;

    res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Type', getContentType(filePath));
    res.setHeader('Content-Disposition', `attachment; filename=${basename(filePath)}`);

    deliver(filePath, res);
  } else {
    res.status(500).send(fmResponse);
  }
};

export const upload = async (req, res) => {
  const task = getTask(req.params.id);
  const chunk = req.query.chunk;
  const filePath = task.path;
  // console.log(`Receieved chunk ${chunk} / ${task.totalChunk} for task ${task.id}`);
  checkDirectories();
  const fmResponse = await receive(filePath, req.files['file'].data);
  if (fmResponse.success) {
    task.lastChunk = chunk;
    updateTask(task.id, task);
    if (chunk == task.totalChunk) {
      if (fileExists(join(TRANSFER_DIR_UPLOAD, task.name))) {
        task.name = task.name + '__' + task.id;
      }
      const fmRenameResponse = renameFile(filePath, join(TRANSFER_DIR_UPLOAD, task.name));
      if (!fmRenameResponse.success) {
        res.status(500).send(fmRenameResponse);
      }

      console.log(`File ${task.name} transfer complete`);
      // console.log('File Uploaded');
      res.status(201).send('File Uploaded');
    } else {
      res.status(200).send('Chunk Uploaded');
    }
  } else {
    res.status(500).send(fmResponse);
  }
};

export const readDir = async (req, res) => {
  makeDirSafe(TRANSFER_DIR);
  let shared = { name: '/', files: [], subdirs: [] };
  shared.subdirs.push(await extractDir(TRANSFER_DIR));
  const configResponse = await getAll();
  if (configResponse != null) {
    for (const dir of configResponse) {
      if (fileExists(dir)) {
        const statResponse = await extractStats(dir);
        if (statResponse.success) {
          if (statResponse.stats.isDirectory()) {
            shared.subdirs.push(await extractDir(dir));
          } else {
            shared.files.push(extractFileInfo(dir, statResponse.stats.size));
          }
        }
      }
    }
  }
  res.status(200).json(shared);
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
