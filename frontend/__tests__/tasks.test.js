const axios = require('axios');
const { BASE_URL } = require('../src/constants.js');
const { getTasks } = require('../src/api/tasks/getTasks.js');
const { deleteTask } = require('../src/api/tasks/deleteTasks.js');
const { createTask } = require('../src/api/tasks/postTasks.js');

jest.mock('axios');

describe('getTasks', () => {
  test('успешно возвращаем данные о задачах', async () => {
    const mockTask = [{ id: 1, title: 'Задача 1', description: 'Описание 1' }];
    axios.get.mockResolvedValue({ data: mockTask });

    const tasks = await getTasks();

    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/api/kanban/tasks/`);
    expect(tasks).toEqual(mockTask);
  });

  test('ловим ошибку при проблемах с сетью', async () => {
    const mockError = new Error('Сетевая ошибка');
    axios.get.mockRejectedValue(mockError);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(getTasks()).rejects.toThrow(mockError);
    expect(consoleSpy).toHaveBeenCalledWith('Ошибка при получении задач:', mockError);
    consoleSpy.mockRestore();
  });
});

describe('deleteTask', () => {
  test('успешно удаляем задачу', async () => {
    const id = 2;
    axios.delete.mockResolvedValue({});

    await deleteTask(id);

    expect(axios.delete).toHaveBeenCalledWith(`${BASE_URL}/api/kanban/tasks/${id}/`);
  });

  test('ловим ошибку при удалении', async () => {
    const id = 3;
    const mockError = new Error('Сетевая ошибка');
    axios.delete.mockRejectedValue(mockError);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(deleteTask(id)).rejects.toThrow(mockError);
    expect(consoleSpy).toHaveBeenCalledWith('Error deleting task:', mockError);
    consoleSpy.mockRestore();
  });
});

describe('postTask', () => {
  test('пытаемся создать задачу с пустыми именем и описанием', async () => {
    const name = '';
    const description = '';

    await expect(createTask({ name, description })).rejects.toThrow('name и description обязательны');
  });

  test('успешно создаём новую задачу', async () => {
    const name = 'Задача 1';
    const description = 'Описание 1';

    axios.post.mockResolvedValue({
      data: { id: 1, title: name, description },
    });

    const result = await createTask({ name, description });

    expect(axios.post).toHaveBeenCalledWith(`${BASE_URL}/api/kanban/tasks/`, {
      title: name,
      description,
    });
    expect(result).toEqual({ id: 1, title: name, description });
  });

  test('ловим ошибку при создании задачи', async () => {
    const name = '!#%&';
    const description = '!#%&';

    const mockError = new Error('Ошибка создания задачи');
    axios.post.mockRejectedValue(mockError);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(createTask({ name, description })).rejects.toThrow(mockError);
    expect(consoleSpy).toHaveBeenCalledWith('Ошибка при создании задачи:', mockError);
    consoleSpy.mockRestore();
  });
});
