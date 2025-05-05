import axios from 'axios';
import { BASE_URL } from '../../constants.js';

export async function getTasks() {
  try {
    const response = await axios.get(`${BASE_URL}/api/kanban/tasks`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении задач:', error);
    throw error;
  }
}