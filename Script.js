// بما أن الملفات في نفس المجلد، نستخدم الاسم مباشرة
const API_URL = "api.php";

// 1. تشغيل الدالة عند فتح الموقع
document.addEventListener('DOMContentLoaded', loadCourses);

// 2. دالة جلب الكورسات من قاعدة البيانات
async function loadCourses() {
    const container = document.getElementById('courses-grid');
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // تنظيف المكان
        container.innerHTML = "";

        if (data.length === 0) {
            container.innerHTML = "<p>لا توجد دروس حالياً.</p>";
            return;
        }

        // عرض الكورسات
        data.forEach(course => {
            const html = `
                <div class="course-card">
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <button class="btn-primary" onclick="openVideo('${course.title}', '${course.video_url}')">مشاهدة الدرس</button>
                </div>
            `;
            container.innerHTML += html;
        });

    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = "<p style='color:red'>حدث خطأ في الاتصال بقاعدة البيانات</p>";
    }
}

// 3. دالة إضافة كورس جديد
async function addCourse() {
    const title = document.getElementById('c-title').value;
    const desc = document.getElementById('c-desc').value;
    const video = document.getElementById('c-video').value;

    if(!title || !video) {
        alert("يرجى كتابة العنوان ورابط الفيديو");
        return;
    }

    const newCourse = {
        title: title,
        description: desc,
        video_url: video
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCourse)
        });
        
        const result = await response.json();
        
        if(result.message) {
            alert("✅ تم نشر الدرس بنجاح!");
            loadCourses(); // إعادة تحميل القائمة
            // تفريغ الحقول
            document.getElementById('c-title').value = "";
            document.getElementById('c-desc').value = "";
            document.getElementById('c-video').value = "";
        } else {
            alert("❌ خطأ: " + result.error);
        }

    } catch (error) {
        alert("خطأ في الاتصال");
        console.error(error);
    }
}

// 4. التحكم في نافذة الفيديو
const modal = document.getElementById('video-modal');
const frame = document.getElementById('course-frame');

function openVideo(title, url) {
    document.getElementById('modal-title').innerText = title;
    frame.src = url;
    modal.classList.remove('hidden');
}

function closeVideo() {
    modal.classList.add('hidden');
    frame.src = "";
}
