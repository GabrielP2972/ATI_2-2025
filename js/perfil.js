// Variable global para manejar el perfil
let currentConfig = {};
let currentPerfil = {};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initPerfilApp();
});

function initPerfilApp() {
    // Las variables 'config' y 'perfil' ya están cargadas síncronamente desde el HTML
    if (typeof config !== 'undefined') {
        currentConfig = config;
    } else {
        console.error('Configuración no cargada');
        // Configuración por defecto
        currentConfig = {
            email: "Si necesitan comunicarse conmigo me pueden escribir a [email]"
        };
    }
    
    if (typeof perfil !== 'undefined') {
        currentPerfil = perfil;
    } else {
        console.error('Perfil no cargado');
        showError('Error cargando el perfil');
        return;
    }
    
    renderPerfil();
}

function renderPerfil() {
    // Foto de perfil
    const fotoPequena = document.getElementById('foto-pequena');
    const fotoGrande = document.getElementById('foto-grande');
    
    if (currentPerfil.ci) {
        const imgPath = `${currentPerfil.ci}/${currentPerfil.ci}.jpg`;
        if (fotoPequena) fotoPequena.src = imgPath;
        if (fotoGrande) fotoGrande.srcset = imgPath;
        
        // Manejo de error en imagen
        if (fotoPequena) {
            fotoPequena.onerror = function() {
                this.src = 'default.jpg';
            };
        }
    }
    
    // Nombre
    const nombreTitulo = document.getElementById('nombre-titulo');
    if (nombreTitulo && currentPerfil.nombre) {
        nombreTitulo.textContent = currentPerfil.nombre;
    }
    
    // Descripción
    const descripcion = document.getElementById('descripcion');
    if (descripcion && currentPerfil.descripcion) {
        descripcion.textContent = currentPerfil.descripcion;
    }
    
    // Lista de datos
    renderListData();
    
    // Email - SOLO el email es enlace
    renderEmailCorrected();
}

function renderListData() {
    // Color
    const color = document.getElementById('color');
    if (color && currentPerfil.color) {
        color.textContent = currentPerfil.color;
    }
    
    // Libro
    const libro = document.getElementById('libro');
    if (libro && currentPerfil.libro) {
        const libros = Array.isArray(currentPerfil.libro) ? currentPerfil.libro.join(', ') : currentPerfil.libro;
        libro.textContent = libros;
    }
    
    // Música
    const musica = document.getElementById('musica');
    if (musica && currentPerfil.musica) {
        const musicas = Array.isArray(currentPerfil.musica) ? currentPerfil.musica.join(', ') : currentPerfil.musica;
        musica.textContent = musicas;
    }
    
    // Videojuegos
    const videoJuego = document.getElementById('video-juego');
    if (videoJuego && currentPerfil.video_juego) {
        const videoJuegos = Array.isArray(currentPerfil.video_juego) ? currentPerfil.video_juego.join(', ') : currentPerfil.video_juego;
        videoJuego.textContent = videoJuegos;
    }
    
    // Lenguajes
    const lenguajes = document.getElementById('lenguajes');
    if (lenguajes && currentPerfil.lenguajes) {
        const lenguajesLista = Array.isArray(currentPerfil.lenguajes) ? currentPerfil.lenguajes.join(', ') : currentPerfil.lenguajes;
        lenguajes.textContent = lenguajesLista;
    }
}

function renderEmailCorrected() {
    const emailContainer = document.getElementById('email-container');
    if (!emailContainer || !currentPerfil.email) return;
    
    // Limpiar el contenedor
    emailContainer.innerHTML = '';
    
    if (currentConfig.email) {
        const emailText = currentConfig.email;
        const emailParts = emailText.split('[email]');
        
        // Parte 1: Texto antes del email
        if (emailParts[0] && emailParts[0].trim()) {
            const textSpan = document.createElement('span');
            textSpan.textContent = emailParts[0];
            emailContainer.appendChild(textSpan);
        }
        
        // Parte 2: El email como enlace
        const emailLink = document.createElement('a');
        emailLink.href = `mailto:${currentPerfil.email}`;
        emailLink.className = 'email-link';
        emailLink.textContent = currentPerfil.email;
        emailContainer.appendChild(emailLink);
        
        // Parte 3: Texto después del email (si existe)
        if (emailParts[1] && emailParts[1].trim()) {
            const afterSpan = document.createElement('span');
            afterSpan.textContent = emailParts[1];
            emailContainer.appendChild(afterSpan);
        }
    } else {
        // Fallback si no hay configuración
        const emailLink = document.createElement('a');
        emailLink.href = `mailto:${currentPerfil.email}`;
        emailLink.className = 'email-link';
        emailLink.textContent = currentPerfil.email;
        emailContainer.appendChild(emailLink);
    }
}

function showError(message) {
    const container = document.querySelector('.perfil-container');
    if (container) {
        container.innerHTML = `<p style="color: red; text-align: center; padding: 20px;">${message}</p>`;
    }
}