import { getTasks } from './api/tasks/getTasks.js';

async function renderTasks() {
    const ul = document.getElementById('tasksList');
    try {
      const tasks = await getTasks();
      ul.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.id} | ${task.title}`;
        ul.appendChild(li);
      });
    } catch (error) {
      ul.innerHTML = '<li>Не удалось загрузить задачи</li>';
    }
  }
  
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});
