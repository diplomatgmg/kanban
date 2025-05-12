const axios = require('axios');
const { BASE_URL } = require('../../constants.js');

async function createTask({ name, description }) {
  if (!name && !description) {
    throw new Error('name и description обязательны');
  }

  try {
    const response = await axios.post(`${BASE_URL}/api/kanban/tasks/`, {
      title: name,
      description,
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании задачи:', error);
    throw error;
  }
}

module.exports = { createTask };
