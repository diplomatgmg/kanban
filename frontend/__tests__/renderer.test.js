const { renderTasks, deleteAllTasks, deleteTaskHandler } = require('../src/renderer.js');

const { getTasks } = require('../src/api/tasks/getTasks.js');
const { deleteTask } = require('../src/api/tasks/deleteTasks.js');

jest.mock('../src/api/tasks/getTasks.js');
jest.mock('../src/api/tasks/deleteTasks.js');

beforeEach(() => {
  document.body.innerHTML = `
    <ul id="tasksList"></ul>
    <input id="taskName" />
    <input id="taskDescription" />
    <button id="addBtn"></button>
    <button id="deleteAllBtn"></button>
  `;
  jest.resetModules();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('renderTasks', () => {
  test('отрисовываем полученные задачи в DOM', async () => {
    getTasks.mockResolvedValue([
      { id: 1, title: 'Задача 1', description: 'Описание 1' },
      { id: 2, title: 'Задача 2', description: 'Описание 2' },
    ]);

    await renderTasks();

    const tasks = document.querySelectorAll('.task-item');
    expect(tasks).toHaveLength(2);
    expect(tasks[0].textContent).toContain('Задача 1');
    expect(tasks[1].textContent).toContain('Описание 2');
  });

  test('ошибка загрузки задач', async () => {
    getTasks.mockRejectedValue(new Error('задачи не загружены'));

    await renderTasks();

    const ul = document.getElementById('tasksList');
    expect(ul.innerHTML).toContain('Не удалось загрузить задачи');
  });
});

describe('deleteAllTasks', () => {
  test('удаляем все задачи из списка в DOM', async () => {
    const tasksForDeleting = [
      { id: 1, title: 'Задача 1', description: 'Описание 1' },
      { id: 2, title: 'Задача 2', description: 'Описание 2' },
    ];

    getTasks.mockResolvedValue(tasksForDeleting);
    deleteTask.mockResolvedValue();

    const result = await deleteAllTasks();
    expect(deleteTask).toHaveBeenCalledTimes(2);
    expect(deleteTask).toHaveBeenCalledWith(1);
    expect(deleteTask).toHaveBeenCalledWith(2);
    expect(result).toBe(true);
  });

  test('ошика удаления', async () => {
    getTasks.mockRejectedValue(new Error('Не удалось удалить'));

    const result = await deleteAllTasks();

    expect(result).toBe(false);
  });
});

describe('deleteTaskHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock('../src/renderer.js', () => ({
      renderTasks: jest.fn(),
      deleteAllTasks: jest.fn(),
      deleteTaskHandler: jest.fn(),
    }));
  });

  test('удаляем одну задачу по id', async () => {
    const tasksForOneDelete = [
      { id: 1, title: 'Задача 1', description: 'Описание 1' },
      { id: 2, title: 'Задача 2', description: 'Описание 2' },
    ];

    getTasks.mockResolvedValue(tasksForOneDelete);
    deleteTask.mockResolvedValue();

    await deleteTaskHandler(2);

    expect(deleteTask).toHaveBeenCalledWith(2);
    expect(deleteTask).toHaveBeenCalledTimes(1);
  });

  test('ошибка удаления', async () => {
    deleteTask.mockRejectedValue(new Error('Не удалось удалить'));

    global.alert = jest.fn();
    await deleteTaskHandler(1);

    expect(deleteTask).toHaveBeenCalledWith(1);
    expect(global.alert).toHaveBeenCalledWith('Ошибка при удалении задачи');
  });
});
