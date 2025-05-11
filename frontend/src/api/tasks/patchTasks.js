const axios = require('axios');
const { BASE_URL } = require('../../constants.js');

async function patchTask({
  id, name, description, status,
}) {
  if (!id || !name || !description) {
    throw new Error('id, name и description обязательны');
  }

  try {
    const response = await axios.patch(`${BASE_URL}/api/kanban/tasks/${id}/`, {
      title: name,
      description,
      status,
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении задачи:', error);
    throw error;
  }
}

module.exports = { patchTask };
