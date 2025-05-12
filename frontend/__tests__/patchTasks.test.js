const axios = require('axios');
const { patchTask } = require('../src/api/tasks/patchTasks.js');

jest.mock('axios');

describe('patchTask', () => {
  const validTask = {
    id: 1,
    name: 'Задача 1',
    description: 'Описание 1',
    status: 'in_progress',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('успешно отправляет PATCH-запрос и возвращает данные', async () => {
    const mockResponse = { data: { success: true } };
    axios.patch.mockResolvedValue(mockResponse);

    const result = await patchTask(validTask);

    expect(axios.patch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/kanban/tasks/${validTask.id}/`),
      {
        title: validTask.name,
        description: validTask.description,
        status: validTask.status,
      },
    );
    expect(result).toEqual(mockResponse.data);
  });

  test('бросает ошибку, если отсутствует id', async () => {
    const task = { ...validTask, id: null };
    await expect(patchTask(task)).rejects.toThrow('id, name и description обязательны');
  });

  test('бросает ошибку, если отсутствует name', async () => {
    const task = { ...validTask, name: '' };
    await expect(patchTask(task)).rejects.toThrow('id, name и description обязательны');
  });

  test('бросает ошибку, если отсутствует description', async () => {
    const task = { ...validTask, description: '' };
    await expect(patchTask(task)).rejects.toThrow('id, name и description обязательны');
  });

  test('логирует и пробрасывает ошибку при сбое запроса', async () => {
    const error = new Error('Ошибка сети');
    axios.patch.mockRejectedValue(error);
    console.error = jest.fn();

    await expect(patchTask(validTask)).rejects.toThrow('Ошибка сети');
    expect(console.error).toHaveBeenCalledWith('Ошибка при обновлении задачи:', error);
  });
});
