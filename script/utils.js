// Function loads html from url
async function loadHTML(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            const html = await response.text();
            document.getElementById(elementId).innerHTML = html;
        } else {
            console.error('Failed to load HTML:', response.status);
        }
    } catch (error) {
        console.error('Error loading HTML:', error);
    }
}

// Function navigates to the favorites page
function navigateToFavorites() {
    window.location.href = 'favorites.html';
}

// Function to make home page link
function navigateToHome() {
    window.location.href = 'index.html';
}

// Having problems with loading headr, this ensures header loads first
loadHTML('header-container', 'partials/header.html')
    .then(() => {
        const indexButton = document.getElementById('indexButton');
        if (indexButton) {
            indexButton.addEventListener('click', navigateToHome);
        } else {
            console.error("Home button not found!");
        }
    })
    .catch((error) => {
        console.error('Error loading header:', error);
    });

// Event listeners index and detail pages
const viewFavoritesButton = document.getElementById('viewFavoritesbutton');
if (viewFavoritesButton) {
    viewFavoritesButton.addEventListener('click', navigateToFavorites);
}

// Function for clicking dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');

    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
}

// Checks for theme in local storage
function loadTheme() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// Event listener for dark mode
const darkModeButton = document.getElementById('darkModeButton');
if (darkModeButton) {
    darkModeButton.addEventListener('click', toggleDarkMode);
}

loadTheme();
loadHTML('footer-container', 'partials/footer.html');
