const { ipcRenderer } = require('electron');
const { getTasks } = require('./api/tasks/getTasks.js');
const { createTask } = require('./api/tasks/postTasks.js');
const { deleteTask } = require('./api/tasks/deleteTasks.js');
const { patchTask } = require('./api/tasks/patchTasks.js');

// Переменные DOM
const addBtn = document.getElementById('addBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const taskName = document.getElementById('taskName');
const taskDescription = document.getElementById('taskDescription');

// Создание задачи
const handleAddTask = async () => {
  if (!taskName.value.trim() || !taskDescription.value.trim()) {
    await showAlert('Пожалуйста, заполните все поля');
    taskName.focus();
    return;
  }

  try {
    await createTask({
      name: taskName.value,
      description: taskDescription.value,
      status: 'todo',
    });

    taskName.value = '';
    taskDescription.value = '';
    await renderTasks();
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Ошибка при создании задачи');
  }
};

// Удаление задачи
async function deleteTaskHandler(taskId) {
  const confirmed = await showConfirm('Вы уверены, что хотите удалить эту задачу?');
  if (!confirmed) return;

  try {
    await deleteTask(taskId);
    await renderTasks();
  } catch (error) {
    console.error('Ошибка при удалении задачи:', error);
  }
}

// Удаление всех задач
async function deleteAllTasks() {
  const confirmed = await showConfirm('Вы уверены, что хотите удалить все задачи?');
  if (!confirmed) return;

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

// alert для electron
async function showAlert(message) {
  return ipcRenderer.invoke('show-alert', message);
}

// confirm для electron
async function showConfirm(message) {
  return ipcRenderer.invoke('show-confirm', message);
}

// Создание DOM-элемента задачи
function createTaskElement(task) {
  if (!task?.id || !task?.title || !task?.status) {
    console.error('Некорректные данные задачи:', task);
    return null;
  }

  const li = document.createElement('li');
  li.classList.add('task-item');
  li.draggable = true;
  li.dataset.taskId = task.id;

  li.innerHTML = `
    <div class="task-header">
      <span class="task-title">${task.title}</span>
      <button class="delete-btn">Удалить</button>
    </div>
    <p class="task-description">${task.description}</p>
  `;

  li.querySelector('.delete-btn').addEventListener('click', () => deleteTaskHandler(task.id));
  li.addEventListener('dragstart', handleDragStart);
  li.addEventListener('dragend', handleDragEnd);

  return li;
}

// Рендер задач
async function renderTasks() {
  try {
    const tasks = await getTasks();
    const columns = {
      todo: document.querySelector('[data-status="todo"]'),
      in_progress: document.querySelector('[data-status="in_progress"]'),
      done: document.querySelector('[data-status="done"]'),
    };

    Object.values(columns).forEach((column) => {
      if (column) column.innerHTML = '';
    });

    tasks.forEach((task) => {
      const li = createTaskElement(task);
      const column = columns[task.status];
      if (li && column) {
        column.appendChild(li);
      } else {
        console.warn(`Задача ${task.id} не добавлена: колонка не найдена`);
      }
    });
  } catch (error) {
    console.error('Ошибка загрузки задач:', error);
    alert('Не удалось загрузить задачи');
  }
}

// Обновление статуса задачи
async function updateTaskStatus(taskId, newStatus) {
  try {
    const response = await patchTask({
      id: taskId,
      name: draggedTask.querySelector('.task-title').textContent,
      description: draggedTask.querySelector('.task-description').textContent,
      status: newStatus,
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка обновления:', error.response?.data || error.message);
    throw error;
  }
}

// Drag & Drop
function handleDragStart(e) {
  draggedTask = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd() {
  draggedTask = null;
  this.classList.remove('dragging');
}

function handleDragOver(e) {
  e.preventDefault();
  this.classList.add('dragover');
  e.dataTransfer.dropEffect = 'move';
}

async function handleDrop(e) {
  e.preventDefault();
  this.classList.remove('dragover');

  if (!draggedTask) return;

  const newStatus = this.dataset.status;
  const { taskId } = draggedTask.dataset;
  const taskElement = draggedTask;

  try {
    await updateTaskStatus(taskId, newStatus);
    this.appendChild(taskElement);
  } catch (error) {
    console.error('Ошибка перемещения задачи:', error);
    alert('Не удалось переместить задачу');
  }
}

// Инициализация
function init() {
  addBtn.addEventListener('click', handleAddTask);

  deleteAllBtn.addEventListener('click', async () => {
    const success = await deleteAllTasks();
    if (success) {
      await renderTasks();
    } else {
      alert('Ошибка при удалении всех задач!');
    }
  });

  document.querySelectorAll('.tasks-list').forEach((column) => {
    column.addEventListener('dragover', handleDragOver);
    column.addEventListener('drop', handleDrop);
  });

  renderTasks();
}

init();

module.exports = {
  renderTasks,
  deleteAllTasks,
  deleteTaskHandler,
};
