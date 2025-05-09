const { getTasks } = require('./api/tasks/getTasks.js');

document.addEventListener('DOMContentLoaded', async () => {
    const ul = document.getElementById('tasksList');
    try {
        const {data} = await getTasks();
        ul.innerHTML = '';
        data.forEach(task => {
            const li = document.createElement('li');
            li.textContent = `${task.id} | ${task.title}`;
            ul.appendChild(li);
        });
    } catch (error) {
        ul.innerHTML = '<li>Не удалось загрузить задачи</li>';
    }
});
