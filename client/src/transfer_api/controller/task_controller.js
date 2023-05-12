import * as taskMan from '../../utils/task_manager.js';

export const createTask = (req, res) => {
  try {
    const task = req.body;
    res.status(201).json(taskMan.add(task));
  } catch (error) {
    // console.log(error);
    res.status(500).send('Unexpected Error');
  }
};

export const readTask = (req, res) => {
  try {
    const id = req.params.id;
    const task = taskMan.get(id);
    if (task) {
      res.status(200).json(task);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    // console.log(error);
    res.status(500).send('Unexpected Error');
  }
};

export const updateTask = (req, res) => {
  try {
    const id = req.params.id;
    const task = req.body;
    taskMan.update(id, task);
    res.status(200);
  } catch (error) {
    // console.log(error);
    res.status(500).send('Unexpected Error');
  }
};

export const removeTask = (req, res) => {
  try {
    const id = req.params.id;
    taskMan.remove(id);
    res.status(200);
  } catch (error) {
    // console.log(error);
    res.status(500).send('Unexpected Error');
  }
};
