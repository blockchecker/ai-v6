// ===============================
// Gallery Page Functionality
// ===============================

document.addEventListener('DOMContentLoaded', function() {
    // The gallery is already populated with static sample items in the HTML
    // This script can be extended to add dynamic gallery features
    
    // Optional: Add click handlers to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Could show a modal or more details here
            const animal = this.querySelector('.gallery-animal').textContent;
            console.log(`Clicked on: ${animal}`);
        });
    });
});

// ===============================
// Load More Gallery Items (Optional)
// ===============================
function loadMoreGalleryItems() {
    const galleryGrid = document.getElementById('galleryGrid');
    const animals = ['🐱', '🐶', '🦊', '🐰', '🐻', '🦔', '🐹', '🐼'];
    const animalNames = ['ねこ', 'いぬ', 'きつね', 'うさぎ', 'たぬき', 'ハリネズミ', 'ハムスター', 'パンダ'];
    
    // Add 8 more random items
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * animals.length);
        const galleryItem = createGalleryItem(animals[randomIndex], animalNames[randomIndex]);
        galleryGrid.appendChild(galleryItem);
    }
}

function createGalleryItem(emoji, name) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    item.innerHTML = `
        <div class="gallery-image blurred">
            <span class="animal-emoji">${emoji}</span>
        </div>
        <p class="gallery-animal">${name}</p>
    `;
    
    return item;
}
