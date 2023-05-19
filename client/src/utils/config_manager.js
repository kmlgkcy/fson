import fs from 'fs';
import { normalize } from 'path';
import { CONFIG_DIR } from '../../config.js';

export function getAll() {
  checkDataExists();
  const data = getData();

  return data;
}

export function add(newData) {
  try {
    const path = newData;
    // console.log(normalize(path));
    const data = getData();

    if (fs.existsSync(path)) {
      const index = getItemIndex(data, path);
      if (index === -1) {
        data.push(normalize(path));
        save(data);
      }
      return {
        success: true,
        data: data,
      };
    }
    return {
      success: false,
      error: 'Path Invalid or Not Exists',
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Path Not Valid',
    };
  }
}

export function remove(item) {
  try {
    const data = getData();
    const index = getItemIndex(data, item);
    if (index !== -1) {
      data.splice(index, 1);
      save(data);
      return {
        success: true,
      };
    }
    return {
      success: false,
      error: 'Path Invalid or Not Exists',
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Path Not Valid',
    };
  }
}

function getData() {
  checkDataExists();
  const data = JSON.parse(fs.readFileSync(CONFIG_DIR));
  return data;
}

function getItemIndex(data, path) {
  return data.findIndex((item) => item === path);
}

function save(data) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(CONFIG_DIR, jsonData);
}

function checkDataExists() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.writeFileSync(CONFIG_DIR, JSON.stringify([]));
  }
}
