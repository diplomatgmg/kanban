const axios = require('axios');
const { BASE_URL } = require('../../constants.js');

async function createTask({ name, description }) {
  try {
    const response = await axios.post(`${BASE_URL}/api/kanban/tasks`, {
      name,
      description,
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании задачи:', error);
    throw error;
  }
}

module.exports = {createTask}