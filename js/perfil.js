// Configuración global para perfil
let currentConfig = {};
let currentPerfil = {};

// Inicializar la aplicación
function initApp() {
    loadConfiguration().then(() => {
        loadPerfil();
    }).catch(error => {
        console.error('Error inicializando la aplicación:', error);
        mostrarError('Error cargando la configuración');
    });
}

// Cargar configuración basada en el parámetro de idioma en la URL
function loadConfiguration() {
    return new Promise((resolve, reject) => {
        const urlParams = new URLSearchParams(window.location.search);
        const lang = urlParams.get('lang') || 'ES'; // Por defecto español
        
        const configFile = `conf/config${lang.toUpperCase()}.json`;
        
        // Eliminar configuraciones anteriores si existen
        const existingConfig = document.querySelector('script[data-config]');
        if (existingConfig) {
            existingConfig.remove();
        }
        
        // Cargar la configuración dinámicamente
        const script = document.createElement('script');
        script.src = configFile;
        script.setAttribute('data-config', 'true');
        
        script.onload = function() {
            if (typeof config !== 'undefined') {
                currentConfig = config;
                resolve();
            } else {
                reject(new Error('Configuración no definida'));
            }
        };
        
        script.onerror = function() {
            console.error(`Error cargando configuración: ${configFile}`);
            // Intentar cargar español por defecto si falla
            if (lang !== 'ES') {
                loadDefaultConfiguration().then(resolve).catch(reject);
            } else {
                reject(new Error('No se pudo cargar la configuración'));
            }
        };
        
        document.head.appendChild(script);
    });
}

// Cargar configuración por defecto (español)
function loadDefaultConfiguration() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '../conf/configES.json';
        script.setAttribute('data-config', 'true');
        
        script.onload = function() {
            if (typeof config !== 'undefined') {
                currentConfig = config;
                resolve();
            } else {
                reject(new Error('Configuración por defecto no disponible'));
            }
        };
        
        script.onerror = function() {
            reject(new Error('No se pudo cargar la configuración por defecto'));
        };
        
        document.head.appendChild(script);
    });
}

// Cargar perfil basado en el CI de la URL
function loadPerfil() {
    const urlParams = new URLSearchParams(window.location.search);
    const ci = urlParams.get('ci');
    
    if (!ci) {
        console.error('No se proporcionó CI en la URL');
        mostrarError('No se especificó un perfil');
        return;
    }

    // Cargar el archivo JSON del perfil
    const script = document.createElement('script');
    script.src = `${ci}/perfil.json`;
    script.onload = function() {
        if (typeof perfil !== 'undefined') {
            currentPerfil = perfil;
            renderPerfil();
        } else {
            console.error('Perfil no cargado');
            mostrarError('Error al cargar el perfil');
        }
    };
    script.onerror = function() {
        console.error('Error al cargar el perfil');
        mostrarError('No se pudo cargar el perfil solicitado');
    };
    document.head.appendChild(script);
}

// Mostrar mensaje de error
function mostrarError(mensaje) {
    const container = document.querySelector('.perfil-container');
    container.innerHTML = `<p style="color: red; text-align: center;">${mensaje}</p>`;
}

// Renderizar el perfil en el DOM
function renderPerfil() {
    // Actualizar las fotos
    const fotoGrande = document.getElementById('foto-grande');
    const fotoPequena = document.getElementById('foto-pequena');
    
    if (currentPerfil.ci) {
        // Usar las imágenes del directorio del CI
        fotoGrande.srcset = `${currentPerfil.ci}/${currentPerfil.ci}.jpg`;
        fotoPequena.src = `${currentPerfil.ci}/${currentPerfil.ci}.jpg`;
        
        // Agregar manejo de errores para las imágenes
        fotoPequena.onerror = function() {
            this.src = 'default.jpg';
        };
    }

    // Actualizar el nombre
    const nombreTitulo = document.getElementById('nombre-titulo');
    if (nombreTitulo && currentPerfil.nombre) {
        nombreTitulo.textContent = currentPerfil.nombre;
    }

    // Actualizar la descripción
    const descripcion = document.getElementById('descripcion');
    if (descripcion && currentPerfil.descripcion) {
        descripcion.textContent = currentPerfil.descripcion;
    }

    // Actualizar los datos de la lista usando la configuración para los textos
     const color = document.getElementById('color');
    if (color && currentPerfil.color) {
        color.textContent = currentPerfil.color;
    }

    const libro = document.getElementById('libro');
    if (libro && currentPerfil.libro) {
        const libros = Array.isArray(currentPerfil.libro) ? currentPerfil.libro.join(', ') : currentPerfil.libro;
        libro.textContent = libros;
    }

    const musica = document.getElementById('musica');
    if (musica && currentPerfil.musica) {
        const musicas = Array.isArray(currentPerfil.musica) ? currentPerfil.musica.join(', ') : currentPerfil.musica;
        musica.textContent = musicas;
    }

    const videoJuego = document.getElementById('video-juego');
    if (videoJuego && currentPerfil.video_juego) {
        const videoJuegos = Array.isArray(currentPerfil.video_juego) ? currentPerfil.video_juego.join(', ') : currentPerfil.video_juego;
        videoJuego.textContent = videoJuegos;
    }

    const lenguajes = document.getElementById('lenguajes');
    if (lenguajes && currentPerfil.lenguajes) {
        const lenguajesLista = Array.isArray(currentPerfil.lenguajes) ? currentPerfil.lenguajes.join(', ') : currentPerfil.lenguajes;
        lenguajes.textContent = lenguajesLista;
    }

    // Actualizar el email
    const emailLink = document.getElementById('email-link');
    if (emailLink && currentPerfil.email) {
        emailLink.href = `mailto:${currentPerfil.email}`;
        
        // Formatear el texto del email usando la configuración
        const emailText = currentConfig.email ? 
            currentConfig.email.replace('[email]', currentPerfil.email) : 
            currentPerfil.email;
        emailLink.textContent = emailText;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);