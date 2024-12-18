const API_BASE_URL = 'https://backend-notes-app-ufb3.onrender.com/api/notes'; // Cambia esta URL a la de tu backend

// Elementos del DOM
const filterStatus = document.getElementById('filter-status');
const filterBtn = document.getElementById('filter-btn');
const tableBody = document.querySelector('#tabla tbody');
const form = document.getElementById('formulario');
const btnModificar = document.getElementById('btnModificar');
const btnCancel = document.getElementById('btnCancel');
const statusField = document.getElementById('status'); // Campo de estado (archivado)

// Estado para almacenar el ID de la nota que se está editando
let editingNoteId = null;

// Función para obtener las notas desde el backend
async function fetchNotes(status = '') {
    let url = `${API_BASE_URL}/${status}`; // URL de la API según el estado

    // Si no hay filtro de estado, muestra todas las notas
    if (status === '' || status === 'all') {
        url = API_BASE_URL; // Muestra todas las notas
    }

    try {
        const response = await fetch(url);
        const notes = await response.json();
        renderNotes(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
}

// Función para mostrar las notas en la tabla
function renderNotes(notes) {
    tableBody.innerHTML = ''; // Limpia la tabla antes de agregar las nuevas notas
    notes.forEach(note => {
        const row = document.createElement('tr');
        row.dataset.id = note.id;
        row.innerHTML = `
            <td>${note.id}</td>
            <td>${note.title}</td>
            <td>${note.content}</td>
            <td>${note.archived ? 'Archived' : 'Active'}</td>
            <td>${new Date(note.createdAt).toLocaleString()}</td>
            <td>
                <button class="button button--primary" onclick="editNote(${note.id})">Edit</button>
                <button class="button button--danger" onclick="deleteNote(${note.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para aplicar los filtros (solo por estado)
function applyFilters() {
    const status = filterStatus.value;

    // Filtrar por estado (active, archived, or all)
    fetchNotes(status === 'all' ? '' : status); // Si es 'all', no pasa parámetro de estado
}

// Función para editar una nota
function editNote(id) {
    editingNoteId = id; // Guarda el ID de la nota que se está editando

    // Obtén los datos de la nota desde el backend
    fetch(`${API_BASE_URL}/${id}`)
        .then(response => response.json())
        .then(note => {
            // Rellenar los campos del formulario con los datos de la nota
            document.getElementById('titulo').value = note.title;
            document.getElementById('content').value = note.content;
            document.getElementById('status').value = note.archived ? 'archived' : 'active';

            // Mostrar el formulario de edición
            form.style.display = 'block';
        })
        .catch(error => console.error('Error fetching note:', error));
}

// Función para guardar las modificaciones de la nota
async function saveNote() {
    const title = document.getElementById('titulo').value;
    const content = document.getElementById('content').value;
    const status = document.getElementById('status').value;

    const updatedNote = {
        title,
        content,
        archived: status === 'archived', // Actualiza el estado (archivado)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/${editingNoteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedNote),
        });

        if (response.ok) {
            alert('Note updated successfully!');
            fetchNotes(); // Refrescar la lista de notas
            form.style.display = 'none'; // Ocultar el formulario
        } else {
            alert('Failed to update note');
        }
    } catch (error) {
        console.error('Error updating note:', error);
    }
}

// Función para eliminar una nota
async function deleteNote(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        alert(`Note with ID ${id} deleted`);
        fetchNotes(); // Refresca la lista de notas
    } else {
        console.error('Failed to delete note');
    }
}

// Event listener para aplicar filtros
filterBtn.addEventListener('click', applyFilters);

// Event listener para guardar las modificaciones
btnModificar.addEventListener('click', saveNote);

// Event listener para cancelar la edición
btnCancel.addEventListener('click', () => {
    form.style.display = 'none'; // Ocultar el formulario
});

// Obtener las notas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    fetchNotes(); // Cargar todas las notas
});
