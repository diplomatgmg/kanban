import axios from 'axios';

export async function getTasks() {
    try {
      const response = await axios.get('http://localhost:8000/api/kanban/tasks');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении задач:', error);
      throw error;
    }
  }
  