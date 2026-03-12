let planetsData = [];
let currentOptions = 'overview'
let imageGeology = null
let lastPlanet = ''

const planetNameElement = document.getElementById('planet-name');
const planetImageElement = document.getElementById('planet-image');
const planetImageContainer = document.querySelector('.planet-image-container')
const navLinks = document.querySelectorAll('.nav-link');
const buttons = document.querySelectorAll('.btn')

const descriptionElement = document.getElementById('planet-description')
const sourceWikipedia = document.getElementById('source-link')
const rotationElement = document.getElementById('rotation')
const revolutionElement = document.getElementById('revolution')
const radiusElement = document.getElementById('radius')
const temperatureElement = document.getElementById('temperature')

async function init() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error('Failed to load data');

        planetsData = await response.json();

        if (!location.hash) {
            location.hash = 'Mercury';
        }
        window.addEventListener('hashchange', renderCurrentPlanet);

        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentOptions = e.currentTarget.dataset.view;
                renderCurrentPlanet();
            });
        });

        renderCurrentPlanet();

    } catch (error) {
        console.error('Error loading planets:', error);
    }
}

function renderCurrentPlanet() {

    let planetName = window.location.hash.substring(1) || 'Mercury';
    if (planetName !== lastPlanet) {
        currentOptions = 'overview'
        lastPlanet = planetName
    }

    const planet = planetsData.find(p => p.name.toLowerCase() === planetName.toLowerCase());

    if (planet) {
        updateDOM(planet);
        updateActiveLink(planetName);
    } else {
        console.error('Planet not found:', planetName);
    }
}

function updateDOM(planet) {
    planetNameElement.textContent = planet.name;

    planetImageElement.src = planet.images.planet;
    rotationElement.textContent = planet.rotation;
    revolutionElement.textContent = planet.revolution;
    radiusElement.textContent = planet.radius;
    temperatureElement.textContent = planet.temperature;

    if (currentOptions === 'structure') {

        if (imageGeology) {
            imageGeology.remove();
            imageGeology = null;
        }

        planetImageElement.src = planet.images.internal;
        descriptionElement.textContent = planet.structure.content;
        sourceWikipedia.href = planet.structure.source;

    } else if (currentOptions === 'geology') {

        planetImageElement.src = planet.images.planet;

        if (!imageGeology) {
            imageGeology = document.createElement('img');
            imageGeology.classList.add('image-geology');

            planetImageContainer.appendChild(imageGeology);
        }
        imageGeology.src = planet.images.geology;
        descriptionElement.textContent = planet.geology.content;
        sourceWikipedia.href = planet.geology.source;

    } else {

        if (imageGeology) {
            imageGeology.remove();
            imageGeology = null;
        }

        planetImageElement.src = planet.images.planet;
        descriptionElement.textContent = planet.overview.content;
        sourceWikipedia.href = planet.overview.source;
    }
}

function updateActiveLink(activePlanetName) {

    buttons.forEach(btn => {
        btn.classList.forEach(className => {
            if (className.startsWith('active-')) {
                btn.classList.remove(className)
            }
        })
    })
    const btnActive = document.querySelector(`[data-view="${currentOptions}"]`)

    if (btnActive) {
        btnActive.classList.add(`active-${activePlanetName.toLowerCase()}`)
    }
    navLinks.forEach(link => {
        link.classList.forEach(className => {
            if (className.startsWith('active-')) {
                link.classList.remove(className)
            }
        })
        if (link.dataset.planet.toLowerCase() === activePlanetName.toLowerCase()) {
            link.classList.add(`active-${activePlanetName.toLowerCase()}`)
        }
    })
}
init();