document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Starea inițială e definită în HTML (left, center, right)
    let positions = ['left', 'center', 'right'];

    function updateSlides() {
        slides.forEach((slide, index) => {
            // Ștergem clasele vechi
            slide.classList.remove('left', 'center', 'right');
            // Adăugăm poziția nouă
            slide.classList.add(positions[index]);
            
            // Dacă un video iese din centru, îi punem pauză automat
            if (positions[index] !== 'center') {
                const video = slide.querySelector('video');
                if(video) video.pause();
            }
        });
    }

    nextBtn.addEventListener('click', () => {
        // Mutăm prima poziție la finalul array-ului
        positions.push(positions.shift());
        updateSlides();
    });

    prevBtn.addEventListener('click', () => {
        // Mutăm ultima poziție la începutul array-ului
        positions.unshift(positions.pop());
        updateSlides();
    });
});