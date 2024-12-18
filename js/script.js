// URL base de la API (ajusta según tu configuración)
const API_BASE_URL = 'https://backend-notes-app-ufb3.onrender.com'; // Cambia con tu URL de backend

// Elementos del DOM
const createButton = document.getElementById('create-note-btn');
const titleInput = document.getElementById('note-title');
const descriptionInput = document.getElementById('note-description');

// Función para crear una nueva nota
async function createNote(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const content = descriptionInput.value.trim();

    if (title && content) {
        const note = {
            title: title,
            content: content,
            archived: false // Establecer archived a false
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(note),
            });

            if (response.ok) {
                const createdNote = await response.json();
                // Redirigir a la página agenda.html
                alert("Nota registrada exitosamente");
                window.location.href = 'agenda.html'; // Redirigir a la página donde se muestran las notas
            } else {
                console.error('Failed to create note');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        alert('Por favor, complete tanto el título como la descripción');
    }
}

// Event listener para el botón de creación de nota
createButton.addEventListener('click', createNote);
