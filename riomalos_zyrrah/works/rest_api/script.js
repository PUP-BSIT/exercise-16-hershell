

document.getElementById('idol_form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const group_name = document.getElementById('group_name').value;
    const age = document.getElementById('age').value;
    const debut_year = document.getElementById('debut_year').value;

    if (!document.getElementById('update_button')
        .classList.contains('hidden')) {
        const id = document.getElementById('idol_form').dataset.id;
        const updatedIdol = { id, name, group_name, age, debut_year };

        fetch('https://restapi.hershive.com/riomalos/riomalos_endpoint.php', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedIdol)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadIdols();
            clearForm();
        });
    } else {
        fetch('https://restapi.hershive.com/riomalos/riomalos_endpoint.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, group_name, age, debut_year })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadIdols();
            clearForm();
        });
    }
});

function loadIdols() {
    fetch('https://restapi.hershive.com/riomalos/riomalos_endpoint.php')
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('idol_table')
            .querySelector('tbody');
        tbody.innerHTML = '';
        data.forEach((idol, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${idol.name}</td>
                <td>${idol.group_name}</td>
                <td>${idol.age}</td>
                <td>${idol.debut_year}</td>
                <td>
                    <button onclick="editIdol(${idol.id})">Edit</button>
                    <button onclick="deleteIdol(${idol.id})">Delete</button>
                </td>`;
            tbody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error loading idols:', error);
    });
}

function editIdol(id) {
    fetch
        (`https://restapi.hershive.com/riomalos/riomalos_endpoint.php?id=${id}`)
    .then(response => response.json())
    .then(idol => {
        document.getElementById('name').value = idol.name || '';
        document.getElementById('group_name').value = idol.group_name || '';
        document.getElementById('age').value = idol.age;
        document.getElementById('debut_year').value = idol.debut_year;

        document.getElementById('idol_form').dataset.id = id;
        document.getElementById('update_button').classList.remove('hidden');
        document.getElementById('label_button').classList.remove('hidden');
        document.getElementById('add_button').classList.add('hidden');
    });
}

function deleteIdol(id) {
    fetch('https://restapi.hershive.com/riomalos/riomalos_endpoint.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ id })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadIdols();
    })
    .catch(error => {
        console.error('Error deleting idol:', error);
    });
}

function clearForm() {
    document.getElementById('idol_form').reset();
    delete document.getElementById('idol_form').dataset.id;
    document.getElementById('update_button').classList.add('hidden');
    document.getElementById('add_button').classList.remove('hidden');
}

loadIdols();