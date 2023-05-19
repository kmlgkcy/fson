import { startServer, closeServer } from '../../transfer_api/api.js';
import { HOST, TASK_DIR, TEMP_DIR } from '../../../config.js';
import { getAll, add, remove } from '../../utils/config_manager.js';
import { removeDir, removeFile } from '../../utils/file_manager.js';

export const openRoom = async (req, res) => {
  await startServer(HOST());
  res.sendStatus(200);
};

export const closeRoom = (req, res) => {
  closeServer();
  res.sendStatus(200);
};

export const getAllDirectories = (req, res) => {
  try {
    res.status(200).json(getAll());
  } catch (error) {}
};

export const addNewDirectory = (req, res) => {
  try {
    const response = add(req.body['path']);
    if (response.success) {
      res.sendStatus(201);
    } else {
      res.status(400).send(response.error);
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteDirectory = (req, res) => {
  try {
    const response = remove(req.body['path']);
    if (response.success) {
      res.sendStatus(200);
    } else {
      res.status(400).send(response.error);
    }
  } catch (error) {
    console.log(error);
  }
};

export const clearTemps = async (req, res) => {
  try {
    await removeDir(TEMP_DIR);
    await removeFile(TASK_DIR);
    console.log('Temporary files removed from host any not completed upload task has failed now');

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
};
