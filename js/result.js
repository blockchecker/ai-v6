// ===============================
// Result Page Functionality
// ===============================

document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const resultScreen = document.getElementById('resultScreen');
    
    // Show loading screen for 2 seconds
    setTimeout(() => {
        // Get or generate diagnosis result
        let resultData = JSON.parse(localStorage.getItem('diagnosisResult'));
        
        if (!resultData) {
            // Generate new random result if none exists
            const animal = getRandomAnimal();
            resultData = {
                name: animal.name,
                icon: animal.icon,
                description: animal.description,
                similarity: animal.similarity
            };
            localStorage.setItem('diagnosisResult', JSON.stringify(resultData));
        }
        
        // Display result
        displayResult(resultData);
        
        // Hide loading and show result
        loadingScreen.style.display = 'none';
        resultScreen.style.display = 'block';
        
        // Animate similarity bar
        setTimeout(() => {
            animateSimilarityBar(resultData.similarity);
        }, 300);
        
    }, 2000);
});

// ===============================
// Display Result Function
// ===============================
function displayResult(resultData) {
    // Set animal icon
    document.getElementById('animalIcon').textContent = resultData.icon;
    
    // Set animal name
    document.getElementById('animalName').textContent = resultData.name;
    
    // Set description
    document.getElementById('animalDescription').textContent = resultData.description;
    
    // Display uploaded image if exists
    const uploadedImage = localStorage.getItem('uploadedImage');
    const imagePreview = document.getElementById('imagePreview');
    
    if (uploadedImage && imagePreview) {
        const img = document.createElement('img');
        img.src = uploadedImage;
        img.alt = '診断に使用した画像';
        imagePreview.appendChild(img);
    }
}

// ===============================
// Animate Similarity Bar
// ===============================
function animateSimilarityBar(percentage) {
    const similarityFill = document.getElementById('similarityFill');
    const similarityPercent = document.getElementById('similarityPercent');
    
    let current = 0;
    const increment = percentage / 50; // Animate over 50 frames
    
    const interval = setInterval(() => {
        current += increment;
        if (current >= percentage) {
            current = percentage;
            clearInterval(interval);
        }
        
        similarityFill.style.width = current + '%';
        similarityPercent.textContent = Math.round(current);
    }, 20);
}

// ===============================
// Share Buttons
// ===============================
const shareTwitterBtn = document.getElementById('shareTwitter');
const shareLineBtn = document.getElementById('shareLine');

if (shareTwitterBtn) {
    shareTwitterBtn.addEventListener('click', function() {
        const resultData = JSON.parse(localStorage.getItem('diagnosisResult'));
        const text = `私は${resultData.name}に${resultData.similarity}%似ているそうです！ ${resultData.icon}\n\n#似てる動物AI #動物診断`;
        const url = window.location.origin;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank');
    });
}

if (shareLineBtn) {
    shareLineBtn.addEventListener('click', function() {
        const resultData = JSON.parse(localStorage.getItem('diagnosisResult'));
        const text = `私は${resultData.name}に${resultData.similarity}%似ているそうです！ ${resultData.icon}`;
        const url = window.location.origin;
        const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        window.open(lineUrl, '_blank');
    });
}
