// Configuración global
let currentConfig = {};
let allProfiles = [];

// Inicializar la aplicación
function initApp() {
    loadConfiguration().then(() => {
        loadProfiles();
        setupEventListeners();
    }).catch(error => {
        console.error('Error inicializando la aplicación:', error);
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
                updateUITexts();
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
        script.src = 'conf/configES.json';
        script.setAttribute('data-config', 'true');
        
        script.onload = function() {
            if (typeof config !== 'undefined') {
                currentConfig = config;
                updateUITexts();
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

// Actualizar textos de la interfaz
function updateUITexts() {
    // Actualizar el título del sitio
    if (currentConfig.sitio) {
        const titulo = currentConfig.sitio.join(' ');
        document.title = titulo;
        
        const navBrand = document.getElementById('nav-brand');
        if (navBrand) {
            navBrand.textContent = titulo;
        }
    }
    
    // Actualizar placeholder de búsqueda
    const searchInput = document.getElementById('nombre');
    if (searchInput && currentConfig.nombre) {
        searchInput.placeholder = currentConfig.nombre;
    }
    
    // Actualizar texto del botón de búsqueda
    const searchButton = document.getElementById('buscar');
    if (searchButton && currentConfig.buscar) {
        searchButton.textContent = currentConfig.buscar;
    }
    
    // Actualizar copyright
    const copyright = document.getElementById('copyright');
    if (copyright && currentConfig.copyRight) {
        copyright.textContent = currentConfig.copyRight;
    }
    
    // Actualizar saludo
    const saludo = document.getElementById('saludo');
    if (saludo && currentConfig.saludo) {
        saludo.textContent = `${currentConfig.saludo}, Gabriel`;
    }
}

// Cargar perfiles desde JSON
function loadProfiles() {
    if (typeof perfiles !== 'undefined') {
        allProfiles = perfiles;
        renderStudentGrid(allProfiles);
    } else {
        console.error('Perfiles no cargados');
    }
}

// Renderizar grid de estudiantes
function renderStudentGrid(profiles) {
    const grid = document.getElementById('estudiantes-grid');
    if (!grid) {
        console.error('No se encontró el elemento estudiantes-grid');
        return;
    }
    
    grid.innerHTML = '';

    if (profiles.length === 0) {
        const noResultsText = currentConfig.noResultados || 'No hay estudiantes para mostrar';
        grid.innerHTML = `<p>${noResultsText}</p>`;
        return;
    }

    profiles.forEach(profile => {
        const studentCard = createStudentCard(profile);
        grid.appendChild(studentCard);
    });
}

// Crear tarjeta de estudiante
function createStudentCard(profile) {
    const link = document.createElement('a');
    
    // Obtener el idioma actual de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || 'ES';
    
    // Incluir el parámetro de idioma en el enlace al perfil
    link.href = `perfil.html?ci=${profile.ci}&lang=${lang}`;
    link.target = '_blank';
    link.style.textDecoration = 'none';
    link.style.color = 'inherit';

    const card = document.createElement('div');
    card.className = 'estudiante-card';

    const img = document.createElement('img');
    // Corregir rutas de imagen - usar la ruta completa desde la raíz
    let imagenPath = profile.imagen ? profile.imagen.replace(/\\/g, '/') : 'default.jpg';
    
    // Si la ruta no empieza con el directorio, agregarlo
    if (!imagenPath.startsWith(profile.ci)) {
        imagenPath = `${profile.ci}/${imagenPath}`;
    }
    
    img.src = imagenPath;
    img.alt = profile.nombre;
    img.className = 'estudiante-foto';
    img.onerror = function() {
        this.src = 'default.jpg'; // Imagen por defecto si falla la carga
    };

    const name = document.createElement('p');
    name.textContent = profile.nombre;

    card.appendChild(img);
    card.appendChild(name);
    link.appendChild(card);

    return link;
}

// Configurar event listeners
function setupEventListeners() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (searchInput) {
                performSearch(searchInput.value);
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            performSearch(this.value);
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);