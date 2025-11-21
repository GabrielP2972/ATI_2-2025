// Configuración global
let currentConfig = {};
let allProfiles = [];

// Inicializar la aplicación
function initApp() {
    loadConfiguration();
    loadProfiles();
    setupEventListeners();
}

// Cargar configuración desde JSON
function loadConfiguration() {
    if (typeof config !== 'undefined') {
        currentConfig = config;
        updateUITexts();
    } else {
        console.error('Configuración no cargada');
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
    const searchInput = document.getElementById('search-input');
    if (searchInput && currentConfig.nombre) {
        searchInput.placeholder = currentConfig.nombre;
    }
    
    // Actualizar texto del botón de búsqueda
    const searchButton = document.getElementById('search-button');
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

// Renderizar grid de estudiantes
function renderStudentGrid(profiles) {
    const grid = document.getElementById('estudiantes-grid');
    if (!grid) {
        console.error('No se encontró el elemento estudiantes-grid');
        return;
    }
    
    grid.innerHTML = '';

    if (profiles.length === 0) {
        grid.innerHTML = '<p>No hay estudiantes para mostrar</p>';
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
    link.href = `perfil.html?ci=${profile.ci}`;
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

// Realizar búsqueda
function performSearch(query) {
    if (!query.trim()) {
        renderStudentGrid(allProfiles);
        return;
    }

    const filtered = allProfiles.filter(profile =>
        profile.nombre.toLowerCase().includes(query.toLowerCase())
    );

    renderStudentGrid(filtered);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);