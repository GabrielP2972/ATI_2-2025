// Variables globales
let currentConfig = {};
let allProfiles = [];
let currentSearchTerm = '';

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initIndexApp();
});

function initIndexApp() {
    // Las variables 'config' y 'perfiles' ya están cargadas síncronamente desde el HTML
    
    // Cargar configuración
    if (typeof config !== 'undefined') {
        currentConfig = config;
    } else {
        console.error('Configuración no cargada');
        currentConfig = {
            sitio: ["ATI", "[UCV]", "2025-2"],
            nombre: "Nombre",
            buscar: "Buscar",
            copyRight: "Copyright © 2025 Escuela de computación - ATI. Todos los derechos reservados",
            saludo: "Hola",
            noResultados: "No hay estudiantes para mostrar",
            noCoincidencias: "No hay alumnos que tengan en su nombre: [query]"
        };
    }
    
    // Cargar perfiles
    if (typeof perfiles !== 'undefined') {
        allProfiles = perfiles;
    } else {
        console.error('Perfiles no cargados');
        allProfiles = [];
    }
    
    // Actualizar interfaz
    updateUITexts();
    
    // Renderizar estudiantes
    renderStudentGrid(allProfiles);
    
    // Configurar eventos
    setupEventListeners();
}

function updateUITexts() {
    // Título del sitio
    if (currentConfig.sitio) {
        document.title = currentConfig.sitio.join(' ');
        
        const navBrand = document.getElementById('nav-brand');
        if (navBrand) {
            navBrand.textContent = currentConfig.sitio.join(' ');
        }
    }
    
    // Placeholder de búsqueda
    const searchInput = document.getElementById('nombre');
    if (searchInput && currentConfig.nombre) {
        searchInput.placeholder = currentConfig.nombre;
    }
    
    // Botón de búsqueda
    const searchButton = document.getElementById('buscar');
    if (searchButton && currentConfig.buscar) {
        searchButton.textContent = currentConfig.buscar;
    }
    
    // Copyright
    const copyright = document.querySelector('footer p');
    if (copyright && currentConfig.copyRight) {
        copyright.textContent = currentConfig.copyRight;
    }
    
    // Saludo
    const saludo = document.getElementById('saludo');
    if (saludo && currentConfig.saludo) {
        saludo.textContent = `${currentConfig.saludo}, Gabriel`;
    }
}

function renderStudentGrid(profiles) {
    const grid = document.getElementById('estudiantes-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (profiles.length === 0) {
        const noResultsText = currentConfig.noResultados || 'No hay estudiantes para mostrar';
        grid.innerHTML = `<p style="text-align: center; grid-column: 1 / -1; padding: 20px;">${noResultsText}</p>`;
        return;
    }
    
    profiles.forEach(profile => {
        const studentCard = createStudentCard(profile);
        grid.appendChild(studentCard);
    });
}

function createStudentCard(profile) {
    const link = document.createElement('a');
    
    // Obtener idioma actual de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || 'ES';
    
    // Enlace al perfil SIN abrir nueva pestaña
    link.href = `perfil.html?ci=${profile.ci}&lang=${lang}`;
    link.style.textDecoration = 'none';
    link.style.color = 'inherit';
    
    const card = document.createElement('div');
    card.className = 'estudiante-card';
    
    const img = document.createElement('img');
    let imagenPath = profile.imagen ? profile.imagen.replace(/\\/g, '/') : 'default.jpg';
    
    // Si la ruta no empieza con el directorio, agregarlo
    if (!imagenPath.startsWith(profile.ci)) {
        imagenPath = `${profile.ci}/${imagenPath}`;
    }
    
    img.src = imagenPath;
    img.alt = profile.nombre;
    img.className = 'estudiante-foto';
    
    // Manejo de error en imagen
    img.onerror = function() {
        this.src = 'default.jpg';
    };
    
    const name = document.createElement('p');
    name.textContent = profile.nombre;
    
    card.appendChild(img);
    card.appendChild(name);
    link.appendChild(card);
    
    return link;
}

function performSearch(query) {
    const grid = document.getElementById('estudiantes-grid');
    
    if (!query.trim()) {
        renderStudentGrid(allProfiles);
        return;
    }
    
    const filtered = allProfiles.filter(profile =>
        profile.nombre.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filtered.length === 0) {
        const noMatchText = currentConfig.noCoincidencias || 'No hay alumnos que tengan en su nombre: [query]';
        const searchMessage = noMatchText.replace('[query]', query);
        grid.innerHTML = `<p style="text-align: center; grid-column: 1 / -1; padding: 20px;">${searchMessage}</p>`;
    } else {
        renderStudentGrid(filtered);
    }
}

function setupEventListeners() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('nombre');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (searchInput) {
                performSearch(searchInput.value);
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            performSearch(e.target.value);
        });
    }
    
    // Agregar parámetro lang si no existe
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('lang')) {
        urlParams.set('lang', 'ES');
        const newUrl = `${window.location.pathname}?${urlParams}`;
        window.history.replaceState({}, '', newUrl);
    }
}