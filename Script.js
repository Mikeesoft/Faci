// -----------------------------------------------------------
// إعدادات الاتصال بمشروعك (تم التحديث)
// -----------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBmCmcR6OIQ00tQrmaTTnoe4kU6L4fQZ00",
  authDomain: "myeduplatform-fe0eb.firebaseapp.com",
  projectId: "myeduplatform-fe0eb",
  storageBucket: "myeduplatform-fe0eb.firebasestorage.app",
  messagingSenderId: "773570577444",
  appId: "1:773570577444:web:c94cc1c8267ecbadd004b1",
  measurementId: "G-6TFV2M7J1G"
};

// تهيئة Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log("تم الاتصال بسيرفرات جوجل بنجاح ✅");
} catch (e) {
    console.error("خطأ في الاتصال", e);
}

const auth = firebase.auth();
const db = firebase.firestore();

// === إدارة العناصر في الصفحة ===
const authScreen = document.getElementById('auth-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const alertBox = document.getElementById('alert-box');

// === 1. نظام الأمان والمراقبة (Security & State) ===
// هذه الدالة تراقب المستخدم: هل هو مسجل دخول أم لا؟
auth.onAuthStateChanged((user) => {
    if (user) {
        // المستخدم موجود ومسجل دخول
        showDashboard(user);
    } else {
        // لا يوجد مستخدم
        showAuth();
    }
});

function showAuth() {
    authScreen.classList.remove('hidden');
    dashboardScreen.classList.add('hidden');
}

function showDashboard(user) {
    authScreen.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');
    document.getElementById('user-email').innerText = user.email;
    loadCourses(); // استدعاء الكورسات
}

// === 2. وظائف التسجيل والدخول (Auth Logic) ===

function showAlert(msg) {
    alertBox.innerText = msg;
    alertBox.classList.remove('hidden');
    setTimeout(() => alertBox.classList.add('hidden'), 3000);
}

function getCreds() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    return { email, pass };
}

function register() {
    const { email, pass } = getCreds();
    if (pass.length < 6) {
        showAlert("⚠️ كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        return;
    }
    
    auth.createUserWithEmailAndPassword(email, pass)
        .then((cred) => {
            // حفظ بيانات إضافية للمستخدم في قاعدة البيانات
            return db.collection('users').doc(cred.user.uid).set({
                email: email,
                role: 'student', // الصلاحية الافتراضية
                joinedAt: new Date()
            });
        })
        .then(() => showAlert("✅ تم إنشاء الحساب بنجاح!"))
        .catch((err) => showAlert("❌ خطأ: " + err.message));
}

function login() {
    const { email, pass } = getCreds();
    auth.signInWithEmailAndPassword(email, pass)
        .catch((err) => showAlert("❌ البريد أو كلمة المرور خطأ"));
}

function logout() {
    auth.signOut();
}

// === 3. نظام الكورسات (Data Handling) ===

function loadCourses() {
    const container = document.getElementById('courses-grid');
    container.innerHTML = '<p style="text-align:center">جاري جلب الكورسات من السيرفر...</p>';

    // هنا نقرأ البيانات من قاعدة بيانات Firestore
    db.collection("courses").get().then((querySnapshot) => {
        let htmlContent = "";
        
        // إذا كانت قاعدة البيانات فارغة، نعرض كورسات تجريبية (Demo)
        if (querySnapshot.empty) {
            htmlContent = `
                <div class="course-card">
                    <h3>🐍 كورس بايثون الشامل</h3>
                    <p>تعلم الذكاء الاصطناعي من الصفر حتى الاحتراف.</p>
                    <button class="btn-primary" onclick="alert('يجب إضافة محتوى حقيقي')">ابدأ التعلم</button>
                </div>
                <div class="course-card">
                    <h3>🌐 تطوير الويب الكامل</h3>
                    <p>HTML, CSS, JS وكيفية بناء المواقع.</p>
                    <button class="btn-primary">ابدأ التعلم</button>
                </div>
            `;
        } else {
            // عرض الكورسات الحقيقية من الداتابيز
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                htmlContent += `
                    <div class="course-card">
                        <h3>${sanitize(data.title)}</h3>
                        <p>${sanitize(data.description)}</p>
                        <button class="btn-primary">مشاهدة</button>
                    </div>
                `;
            });
        }
        container.innerHTML = htmlContent;
    }).catch(err => {
        container.innerHTML = "<p>حدث خطأ في تحميل الكورسات</p>";
        console.error(err);
    });
}

// دالة حماية بسيطة لمنع حقن الأكواد (Basic XSS Protection)
function sanitize(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}
