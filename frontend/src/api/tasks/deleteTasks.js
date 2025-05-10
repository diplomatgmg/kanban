const axios = require('axios');
const { BASE_URL } = require('../../constants.js');

async function deleteTask(id) {
    try {
      await axios.delete(`${BASE_URL}/api/kanban/tasks/${id}/`);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

module.exports = { deleteTask };