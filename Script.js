// --- كود الكتابة التلقائية (Terminal Effect) ---
const text = "> System.initialized...\n> Welcome to FCAI Portal.\n> Loading AI Modules... [Done]";
const typingElement = document.getElementById("typing-text");
let index = 0;

function typeWriter() {
    // التأكد أن العنصر موجود قبل الكتابة (عشان ميحصلش خطأ في الصفحات التانية)
    if (typingElement && index < text.length) { 
        if (text.charAt(index) === "\n") {
            typingElement.innerHTML += "<br>";
        } else {
            typingElement.innerHTML += text.charAt(index);
        }
        index++;
        setTimeout(typeWriter, 50);
    }
}

// --- كود القائمة الجانبية للموبايل ---
const menuToggle = document.getElementById('mobile-menu');
const navList = document.querySelector('.nav-list');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
    });
}

// تشغيل الدوال عند تحميل الصفحة
window.onload = function() {
    typeWriter();
};

// دالة التنبيه البسيطة
function showAlert() {
    alert("سيتم توجيهك إلى صفحة التواصل قريباً!");
}
