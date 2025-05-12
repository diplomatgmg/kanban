const { getTasks } = require('./api/tasks/getTasks.js');
const { createTask } = require('./api/tasks/postTasks.js');
const { deleteTask } = require('./api/tasks/deleteTasks.js');

async function renderTasks() {
  const ul = document.getElementById('tasksList');
  try {
    const tasks = await getTasks();
    ul.innerHTML = '';
    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.classList.add('task-item');
      li.innerHTML = `
              <div class="task-header">
                  <span class="task-title">${task.title}</span>
                  <button class="delete-btn" onclick="deleteTaskHandler(${task.id})">Удалить</button>
              </div>
              <p class="task-description">${task.description}</p>
          `;
      ul.appendChild(li);
    });
  } catch (error) {
    ul.innerHTML = '<li>Не удалось загрузить задачи</li>';
  }
}

async function deleteAllTasks() {
  try {
    const tasks = await getTasks();
    const results = await Promise.allSettled(
      tasks.map((task) => deleteTask(task.id)),
    );

    return true;
  } catch (error) {
    console.error('Ошибка удаления:', error);
    return false;
  }
}

async function deleteTaskHandler(taskId) {
  try {
    await deleteTask(taskId);
    renderTasks();
  } catch (error) {
    alert('Ошибка при удалении задачи');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await renderTasks();

  const addBtn = document.getElementById('addBtn');
  const taskName = document.getElementById('taskName');
  const taskDescription = document.getElementById('taskDescription');
  const DeleteAllBtn = document.getElementById('deleteAllBtn');

  const handleAddTask = async () => {
    if (!taskName.value.trim() || !taskDescription.value.trim()) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    try {
      await createTask({
        name: taskName.value,
        description: taskDescription.value,
      });

      taskName.value = '';
      taskDescription.value = '';
      await renderTasks();
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при создании задачи');
    }
  };

  addBtn.addEventListener('click', handleAddTask);
  DeleteAllBtn.addEventListener('click', async () => {
    const success = await deleteAllTasks();
    if (success) {
      await renderTasks();
    } else {
      alert('Ошибка при удалении!');
    }
  });
});

module.exports = {
  renderTasks,
  deleteAllTasks,
  deleteTaskHandler,
};