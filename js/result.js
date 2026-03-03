document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById("loadingScreen");
    const resultScreen = document.getElementById("resultScreen");

    const iconEl = document.getElementById("animalIcon");
    const nameEl = document.getElementById("animalName");
    const descEl = document.getElementById("animalDescription");
    const percentEl = document.getElementById("similarityPercent");
    const fillEl = document.getElementById("similarityFill");

    const data = JSON.parse(localStorage.getItem("diagnosisResult"));

    if (!data) {
        nameEl.textContent = "データがありません";
        descEl.textContent = "もう一度診断してください。";
        loadingScreen.style.display = "none";
        resultScreen.style.display = "block";
        return;
    }

    // ローディング演出
    setTimeout(() => {
        iconEl.textContent = data.icon;
        nameEl.textContent = data.name;
        descEl.textContent = data.description;
        percentEl.textContent = data.similarity;
        fillEl.style.width = data.similarity + "%";

        loadingScreen.style.display = "none";
        resultScreen.style.display = "block";
    }, 1200);
});
