import fs from 'fs';
import { v4 as uuid } from 'uuid';
import { join } from 'path';
import { TEMP_DIR, TASK_DIR } from '../../config.js';

export function get(id) {
  checkDataExists();
  const data = getData();
  const index = getItemIndex(data, id);
  return data[index];
}

export function add(newData) {
  const data = getData();

  const id = uuid();

  const newTask = {
    id: id,
    name: newData.name,
    status: 'notImplementedYet',
    path: join(TEMP_DIR, id) + '.fson',
    size: newData.size,
    totalChunk: newData.totalChunk,
    lastChunk: 0,
  };
  data.push(newTask);
  fs.writeFile(newTask.path, '', (error) => {
    if (error) {
      console.error(error);
    } else {
    }
  });
  save(Object.assign(data, newData));
  return newTask;
}

export function update(id, newData) {
  const data = getData();
  const index = getItemIndex(data, id);
  if (index !== -1) {
    newData.id = id;
    data[index] = newData;
    save(data);
  }
}

export function remove(id) {
  const data = getData();
  const index = getItemIndex(data, id);
  if (index !== -1) {
    data.splice(index, 1);
    save(data);
  }
}

function getData() {
  checkDataExists();
  const data = JSON.parse(fs.readFileSync(TASK_DIR));
  return data;
}

function getItemIndex(data, id) {
  return data.findIndex((item) => item.id === id);
}

function save(data) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(TASK_DIR, jsonData);
}

function checkDataExists() {
  if (!fs.existsSync(TASK_DIR)) {
    fs.writeFileSync(TASK_DIR, JSON.stringify([]));
  }
}
