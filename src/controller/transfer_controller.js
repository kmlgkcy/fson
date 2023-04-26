import { uploadFile, downloadFile, readTransferDir } from '../utils/file_manager.js';

export const download = (req, res) => {
  try {
    downloadFile(req, res);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something Went Wrong');
  }
};

export const upload = (req, res) => {
  try {
    uploadFile(req, res);
  } catch (error) {
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
