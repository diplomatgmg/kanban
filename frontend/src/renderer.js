import { getTasks } from './api/tasks/getTasks.js';
import createTask from './api/tasks/postTasks.js';

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

  const popup = document.getElementById('popup');
  const createBtn = document.getElementById('createTaskBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const saveBtn = document.getElementById('saveBtn');

  createBtn.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  cancelBtn.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  saveBtn.addEventListener('click', async () => {
    const name = document.getElementById('taskName').value;
    const description = document.getElementById('taskDescription').value;

    try {
      await createTask(name, description); // используем импортированную функцию
      popup.style.display = 'none';
      document.getElementById('taskName').value = '';
      document.getElementById('taskDescription').value = '';
      renderTasks();
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
    }
  });
});

