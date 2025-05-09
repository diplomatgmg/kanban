const axios = require('axios');
const { BASE_URL } = require('../../constants.js');

async function getTasks() {
    try {
        const response = await axios.get(`${BASE_URL}/api/kanban/tasks/`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении задач:', error);
        throw error;
    }
}

module.exports = {getTasks}