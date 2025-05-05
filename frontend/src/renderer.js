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
    fetch('http://localhost:8000/api/kanban/test')
        .then(response => {
            return response.json();
        })
        .then(data => {
            document.getElementById('backend-response').textContent = data.data;
        })
        .catch(() => {
            document.getElementById('backend-response').textContent = 'Error!';
        });
});
