// Function to load HTML from a URL and insert it into the DOM
async function loadHTML(elementId, filePath) {
    try {
        const response = await fetch(filePath);  // Fetch the HTML content from the partial
        if (response.ok) {
            const html = await response.text();  // Convert the response to text
            document.getElementById(elementId).innerHTML = html;  // Inject the HTML into the specified element
        } else {
            console.error('Failed to load HTML:', response.status);
        }
    } catch (error) {
        console.error('Error loading HTML:', error);
    }
}

// Load the header and footer dynamically
loadHTML('header-container', 'partials/header.html');
loadHTML('footer-container', 'partials/footer.html');
