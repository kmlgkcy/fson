import { download, upload, readDir } from '../service/transfer_service.js';

//TODO validate service required fields
export const downloadFile = (req, res) => {
  try {
    download(req, res);
  } catch (error) {
    res.status(500).send('Critical Host Error');
  }
};

export const uploadFile = (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).send('No files were uploaded.');
      return;
    }
    if (typeof req.files['file'] === 'object' && req.files['file']['name']) {
      upload(req, res);
    } else {
      res.status(409).send('Files not uploaded in valid way');
    }
  } catch (error) {
    res.status(500).send('Critical Host Error');
  }
};

export const getDirectory = (req, res) => {
  try {
    readDir(req, res);
  } catch (error) {
    res.status(500).send('Critical Host Error');
  }
};
