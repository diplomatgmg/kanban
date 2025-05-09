const { getTasks } = require('./api/tasks/getTasks.js');

document.addEventListener('DOMContentLoaded', async () => {
    const ul = document.getElementById('tasksList');
    try {
        const tasks = await getTasks();
        ul.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = `${task.id} | ${task.title} | ${task.description}`;
            ul.appendChild(li);
        });
    } catch (error) {
        ul.innerHTML = '<li>Не удалось загрузить задачи</li>';
    }
});
