import axios from 'axios';
import { BASE_URL } from '../../constants.js';

export default async function createTask({ name, description }) {
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