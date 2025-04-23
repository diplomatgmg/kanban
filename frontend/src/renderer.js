document.addEventListener('DOMContentLoaded', () => {
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
