// Inisialisasi variabel
const body = document.body;
const sunMoon = document.getElementById('sun-moon');
const starsContainer = document.getElementById('stars');
const shootingStar = document.getElementById('shooting-star');
const clouds = document.querySelectorAll('.cloud');
const trees = document.getElementById('trees');

// Status mode siang/malam
let isDayMode = false;

// Membuat bintang-bintang (hanya untuk mode malam)
function createStars() {
    starsContainer.innerHTML = ''; // Clear existing stars
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Ukuran bintang bervariasi
        const size = Math.random() * 2.5 + 0.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Posisi acak
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Animasi dengan delay berbeda
        star.style.animationDelay = `${Math.random() * 5}s`;
        star.style.animationDuration = `${Math.random() * 2 + 2}s`;
        
        starsContainer.appendChild(star);
    }
}

// Panggil fungsi untuk membuat bintang pertama kali
createStars();

// Fungsi untuk membuat bintang jatuh MIRING yang lebih natural
function createShootingStar() {
    if (isDayMode) return; // Jangan buat bintang jatuh di siang hari
    
    // Reset dan atur posisi awal bintang jatuh
    shootingStar.style.left = `${Math.random() * 20}%`; // Mulai dari kiri atas
    shootingStar.style.top = `${Math.random() * 20}%`; // Mulai dari atas
    shootingStar.style.opacity = '1';
    
    // Atur sudut yang lebih miring untuk lintasan diagonal
    const angle = -60; // Sudut miring ke bawah
    
    // Panjang lintasan berdasarkan ukuran layar
    const travelDistanceX = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.2;
    const travelDistanceY = Math.random() * window.innerHeight * 0.6 + window.innerHeight * 0.4;
    
    // Hitung posisi akhir berdasarkan sudut dan jarak
    const radians = angle * (Math.PI / 180);
    const endX = Math.cos(radians) * travelDistanceX;
    const endY = Math.sin(radians) * travelDistanceY;
    
    // Animasi bintang jatuh dengan lintasan diagonal
    const animation = shootingStar.animate([
        { 
            transform: `translate(0, 0) rotate(${angle}deg)`,
            opacity: 0 
        },
        { 
            transform: `translate(${endX}px, ${endY}px) rotate(${angle}deg)`,
            opacity: 1 
        },
        { 
            transform: `translate(${endX * 1.2}px, ${endY * 1.2}px) rotate(${angle}deg)`,
            opacity: 0 
        }
    ], {
        duration: 1200 + Math.random() * 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });
    
    animation.onfinish = () => {
        shootingStar.style.opacity = '0';
        // Jadwalkan bintang jatuh berikutnya hanya jika masih malam
        if (!isDayMode) {
            setTimeout(createShootingStar, Math.random() * 3000 + 2000);
        }
    };
}

// Mulai bintang jatuh pertama
setTimeout(createShootingStar, 1000);

// Fungsi untuk animasi bulan/matahari bergerak (tanpa efek berkedip)
function animateCelestialBody(toDayMode) {
    const sunMoon = document.getElementById('sun-moon');
    
    if (toDayMode) {
        // Menuju mode siang: bulan keluar, matahari masuk
        sunMoon.classList.remove('moon-mode', 'active');
        sunMoon.classList.add('sun-mode');
        
        // Animasikan bulan keluar ke kanan
        sunMoon.animate([
            { transform: 'translateX(0)', opacity: 1 },
            { transform: 'translateX(100px)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-in'
        }).onfinish = () => {
            // Setelah bulan keluar, posisikan matahari di kiri
            sunMoon.style.left = '30px';
            sunMoon.style.top = '30px';
            sunMoon.style.right = 'auto';
            
            // Animasikan matahari masuk dari kiri
            sunMoon.animate([
                { transform: 'translateX(-100px)', opacity: 0 },
                { transform: 'translateX(0)', opacity: 1 }
            ], {
                duration: 600,
                easing: 'ease-out'
            }).onfinish = () => {
                sunMoon.classList.add('active');
            };
        };
    } else {
        // Menuju mode malam: matahari keluar, bulan masuk
        sunMoon.classList.remove('sun-mode', 'active');
        sunMoon.classList.add('moon-mode');
        
        // Animasikan matahari keluar ke kiri
        sunMoon.animate([
            { transform: 'translateX(0)', opacity: 1 },
            { transform: 'translateX(-100px)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-in'
        }).onfinish = () => {
            // Setelah matahari keluar, posisikan bulan di kanan
            sunMoon.style.right = '30px';
            sunMoon.style.top = '30px';
            sunMoon.style.left = 'auto';
            
            // Animasikan bulan masuk dari kanan
            sunMoon.animate([
                { transform: 'translateX(100px)', opacity: 0 },
                { transform: 'translateX(0)', opacity: 1 }
            ], {
                duration: 600,
                easing: 'ease-out'
            }).onfinish = () => {
                sunMoon.classList.add('active');
            };
        };
    }
}

// Fungsi untuk animasi pohon muncul/hilang
function animateTrees(show) {
    const trees = document.getElementById('trees');
    const treeElements = trees.querySelectorAll('.tree');
    
    if (show) {
        // Tampilkan pohon dengan animasi bertahap
        trees.style.opacity = '1';
        treeElements.forEach((tree, index) => {
            setTimeout(() => {
                tree.style.transform = 'translateY(0)';
                tree.style.opacity = '1';
            }, index * 200);
            
            // Set posisi awal untuk animasi
            tree.style.transform = 'translateY(100px)';
            tree.style.opacity = '0';
            tree.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
        });
    } else {
        // Sembunyikan pohon dengan animasi bertahap
        treeElements.forEach((tree, index) => {
            setTimeout(() => {
                tree.style.transform = 'translateY(100px)';
                tree.style.opacity = '0';
            }, index * 100);
        });
        
        setTimeout(() => {
            trees.style.opacity = '0';
        }, 800);
    }
}

// Fungsi untuk mengubah mode siang/malam
function toggleDayNight() {
    isDayMode = !isDayMode;
    
    if (isDayMode) {
        // Mode Siang
        body.classList.add('day-mode');
        sunMoon.title = "Klik untuk mode malam";
        
        // Animasi bulan/matahari (tanpa efek berkedip)
        animateCelestialBody(true);
        
        // Sembunyikan bintang-bintang
        document.querySelectorAll('.star').forEach(star => {
            star.style.opacity = '0';
        });
        
        // Tampilkan awan dengan jelas
        clouds.forEach(cloud => {
            cloud.style.opacity = '0.95';
        });
        
        // Tampilkan pohon-pohon dengan animasi
        animateTrees(true);
        
        // Hentikan bintang jatuh
        shootingStar.style.opacity = '0';
        
    } else {
        // Mode Malam
        body.classList.remove('day-mode');
        sunMoon.title = "Klik untuk mode siang";
        
        // Animasi bulan/matahari (tanpa efek berkedip)
        animateCelestialBody(false);
        
        // Tampilkan kembali bintang-bintang
        createStars();
        
        // Sembunyikan awan
        clouds.forEach(cloud => {
            cloud.style.opacity = '0';
        });
        
        // Sembunyikan pohon-pohon dengan animasi
        animateTrees(false);
        
        // Mulai bintang jatuh
        setTimeout(createShootingStar, 1000);
    }
}

// Event listener untuk bulan/matahari
sunMoon.addEventListener('click', toggleDayNight);

// Animasi hover untuk countdown boxes
const countdownBoxes = document.querySelectorAll('.countdown-box');
countdownBoxes.forEach(box => {
    box.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    box.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Target tanggal Ramadhan: 18 Februari 2026
const ramadanDate = new Date('February 18, 2026 00:00:00').getTime();

// Update countdown setiap detik
const countdownFunction = setInterval(function() {
    const now = new Date().getTime();
    const timeLeft = ramadanDate - now;
    
    // Perhitungan waktu
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    // Tampilkan hasil dengan efek transisi
    updateCountdownValue('days', days);
    updateCountdownValue('hours', hours);
    updateCountdownValue('minutes', minutes);
    updateCountdownValue('seconds', seconds);
    
    // Jika waktu sudah habis
    if (timeLeft < 0) {
        clearInterval(countdownFunction);
        document.querySelector('.countdown-container').innerHTML = `
            <div style="grid-column: 1 / -1; padding: 40px; background: rgba(255,255,255,0.1); border-radius: 20px; border: 2px solid #FFD700;">
                <h2 style="color: #FFD700; font-size: 2.5rem; margin-bottom: 20px;">🎉 Ramadhan 1447H telah tiba! 🎉</h2>
                <p style="font-size: 1.2rem; color: rgba(255,255,255,0.9);">Selamat menunaikan ibadah puasa! Semoga amal ibadah kita diterima Allah SWT.</p>
            </div>
        `;
        
        // Efek konfetti virtual
        createConfettiEffect();
    }
}, 1000);

// Fungsi untuk update countdown dengan efek
function updateCountdownValue(elementId, value) {
    const element = document.getElementById(elementId);
    const currentValue = parseInt(element.textContent);
    
    if (currentValue !== value) {
        // Efek animasi saat nilai berubah
        element.style.transform = 'scale(1.2)';
        element.style.color = '#FF6B6B';
        
        setTimeout(() => {
            element.textContent = value.toString().padStart(2, '0');
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 200);
    }
}

// Fungsi efek konfetti (untuk saat Ramadhan tiba)
function createConfettiEffect() {
    const confettiColors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#FFA726', '#9C27B0'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = `${Math.random() * 15 + 5}px`;
            confetti.style.height = `${Math.random() * 15 + 5}px`;
            confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = '-20px';
            confetti.style.zIndex = '1000';
            confetti.style.opacity = '0.9';
            document.body.appendChild(confetti);
            
            // Animasi confetti jatuh
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: 2000 + Math.random() * 3000,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });
            
            animation.onfinish = () => {
                confetti.remove();
            };
        }, i * 50);
    }
}

// Efek paralaks sederhana untuk latar belakang
document.addEventListener('mousemove', (e) => {
    if (!isDayMode) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        const gradientBg = document.querySelector('.gradient-bg');
        if (gradientBg) {
            gradientBg.style.transform = `translate(${x}px, ${y}px)`;
        }
    }
});

// Resize listener untuk mengatur ulang bintang jatuh saat ukuran window berubah
window.addEventListener('resize', () => {
    // Reset shooting star position
    shootingStar.style.opacity = '0';
    
    // Schedule new shooting star
    if (!isDayMode) {
        setTimeout(createShootingStar, 1000);
    }
});
