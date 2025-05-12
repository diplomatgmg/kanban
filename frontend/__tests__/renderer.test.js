document.body.innerHTML = `
  <div class="tasks-list" data-status="todo"></div>
  <div class="tasks-list" data-status="in_progress"></div>
  <div class="tasks-list" data-status="done"></div>
  <input id="taskName" />
  <input id="taskDescription" />
  <button id="addBtn"></button>
  <button id="deleteAllBtn"></button>
`;

const { ipcRenderer } = require('electron');

jest.mock('electron', () => ({
  ipcRenderer: {
    invoke: jest.fn(),
  },
}));

const { getTasks } = require('../src/api/tasks/getTasks.js');
const { deleteTask } = require('../src/api/tasks/deleteTasks.js');

jest.mock('../src/api/tasks/getTasks.js');
jest.mock('../src/api/tasks/deleteTasks.js');

const {
  renderTasks,
  deleteAllTasks,
  deleteTaskHandler,
} = require('../src/renderer.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('renderTasks', () => {
  test('отрисовывает задачи по статусам', async () => {
    getTasks.mockResolvedValue([
      {
        id: 1, title: 'Задача 1', description: 'Описание 1', status: 'todo',
      },
      {
        id: 2, title: 'Задача 2', description: 'Описание 2', status: 'done',
      },
    ]);

    await renderTasks();

    const todoColumn = document.querySelector('[data-status="todo"]');
    const doneColumn = document.querySelector('[data-status="done"]');

    expect(todoColumn.textContent).toContain('Задача 1');
    expect(doneColumn.textContent).toContain('Задача 2');
  });

  test('ошибка загрузки задач', async () => {
    getTasks.mockRejectedValue(new Error('задачи не загружены'));

    global.alert = jest.fn();

    await renderTasks();

    expect(alert).toHaveBeenCalledWith('Не удалось загрузить задачи');
  });
});

describe('deleteAllTasks', () => {
  test('удаляет все задачи после подтверждения', async () => {
    ipcRenderer.invoke.mockResolvedValue(true);

    const tasksForDeleting = [
      {
        id: 1, title: 'Задача 1', description: 'Описание 1', status: 'todo',
      },
      {
        id: 2, title: 'Задача 2', description: 'Описание 2', status: 'done',
      },
    ];

    getTasks.mockResolvedValue(tasksForDeleting);
    deleteTask.mockResolvedValue();

    const result = await deleteAllTasks();

    expect(deleteTask).toHaveBeenCalledTimes(2);
    expect(deleteTask).toHaveBeenCalledWith(1);
    expect(deleteTask).toHaveBeenCalledWith(2);
    expect(result).toBe(true);
  });

  test('отмена удаления — задачи не удаляются', async () => {
    ipcRenderer.invoke.mockResolvedValue(false);

    const result = await deleteAllTasks();

    expect(deleteTask).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  test('ошибка при получении задач', async () => {
    ipcRenderer.invoke.mockResolvedValue(true);
    getTasks.mockRejectedValue(new Error('Ошибка'));

    const result = await deleteAllTasks();

    expect(result).toBe(false);
  });
});

describe('deleteTaskHandler', () => {
  test('удаляет задачу при подтверждении', async () => {
    ipcRenderer.invoke.mockResolvedValue(true);
    deleteTask.mockResolvedValue();

    await deleteTaskHandler(2);

    expect(deleteTask).toHaveBeenCalledWith(2);
    expect(deleteTask).toHaveBeenCalledTimes(1);
  });

  test('отмена удаления задачи', async () => {
    ipcRenderer.invoke.mockResolvedValue(false);

    await deleteTaskHandler(2);

    expect(deleteTask).not.toHaveBeenCalled();
  });

  test('ошибка при удалении задачи', async () => {
    ipcRenderer.invoke.mockResolvedValue(true);
    deleteTask.mockRejectedValue(new Error('Удаление не удалось'));

    await deleteTaskHandler(1);

    expect(deleteTask).toHaveBeenCalledWith(1);
  });
});
