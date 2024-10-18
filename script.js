// Örnek proje verileri
const projects = [
    { 
        name: "Defect Tracker Portfolio", 
        description: "A comprehensive bug tracking portfolio showcasing defects identified across various applications.",
        image: "images/defect-logos.png"
    },
    { 
        name: "Robot Framework Web Automation", 
        description: "Developed test automation for amazon.com.tr using Robot Framework.",
        image: "images/robot-framework.png"
    },
    { 
        name: "API Testing Project", 
        description: "Created test scenarios for RESTful APIs using Postman",
        image: "images/postman.png"
    },
    { 
        name: "Test Automation Bootcamp Pair 3 Final Project", 
        description: "An end-to-end test automation project for a web application, demonstrating skills and frameworks learned during the bootcamp.",
        image: "images/istanbul-kodluyor.png"
    }
];

// Proje kartlarını oluştur ve DOM'a ekle
const projectList = document.getElementById('project-list');
projects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.innerHTML = `
        <img src="${project.image}" alt="${project.name}" class="project-image">
        <div class="project-info">
            <h3>${project.name}</h3>
            <p>${project.description}</p>
        </div>
    `;
    projectList.appendChild(projectCard);
});

// Smooth scroll için
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const headerOffset = 80; // Üst menünün yüksekliği + ekstra boşluk
            let elementPosition = targetElement.getBoundingClientRect().top;
            
            // Hedef bölüme göre özel offset ayarları
            if (targetId === 'home') {
                elementPosition = document.querySelector('.left-content h2').getBoundingClientRect().top;
            } else if (targetId === 'skills') {
                elementPosition = document.querySelector('#skills h2').getBoundingClientRect().top;
            } else if (targetId === 'projects') {
                elementPosition = document.querySelector('#projects h2').getBoundingClientRect().top;
            }
            
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Aktif bölümü belirleme ve menüyü güncelleme
function updateActiveSection() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Üst menü yüksekliğini hesaba katıyoruz
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveSection);
window.addEventListener('load', updateActiveSection);

// Bu kısmı kaldırabilirsiniz, çünkü yukarıdaki smooth scroll fonksiyonu ile çakışabilir
// document.addEventListener('DOMContentLoaded', function() {
//     const navLinks = document.querySelectorAll('nav a');
//     // ... (kaldırılan kod)
// });