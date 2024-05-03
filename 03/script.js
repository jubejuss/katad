// Seemnete andmed
const seeds = [
  { name: "Carrot", cost: 10, growthTime: 5, profit: 20, icon: "img/porgand.png" },
  { name: "Tomato", cost: 15, growthTime: 7, profit: 30, icon: "img/tomat.png" },
  { name: "Potato", cost: 20, growthTime: 9, profit: 40, icon: "img/kartul.png" }
];

// Algse raha määratlemine
let money = 100;

// Funktsioon seemne külvamiseks
function plantSeed(squareId, seedIndex) {
  const square = document.getElementById(squareId);
  const seed = seeds[seedIndex];
  if (money < seed.cost) {
    alert("Not enough money to plant this seed!");
    return;
  }
  if (square.classList.contains("planted")) {
    alert("This square is already planted!");
    return;
  }
  square.innerHTML = `${renderIcon(seed, 1)}<span class="timer">${seed.growthTime}</span>`;
  square.dataset.growthTime = seed.growthTime;
  square.dataset.profit = seed.profit;
  square.dataset.plantedAt = Date.now();
  square.classList.add("planted");
  money -= seed.cost;
  document.getElementById("money").textContent = money;
  startGrowthTimer(square, seed);
}

// Pildi renderdamise funktsioon
function renderIcon(seed, scale = 1) {
  return `<img src="${seed.icon}" alt="${seed.name}" style="width: ${30 * scale}px; height: ${30 * scale}px;">`;
}

// Ajastatud taimeri käivitamine
function startGrowthTimer(square, seed) {
  const timerId = setInterval(() => {
    const elapsedTime = Math.floor((Date.now() - parseInt(square.dataset.plantedAt)) / 1000);
    const remainingTime = Math.max(0, seed.growthTime - elapsedTime);
    const scale = 1 + (elapsedTime / seed.growthTime) * 1;  // Suuruse skaleerimise loogika
let img = square.querySelector('img');
img.style.width = `${30 * scale}px`;
img.style.height = `${30 * scale}px`;
img.style.transformOrigin = '100% 100%';  // Määrab skaleerimise päritolu
img.style.transform = `scale(${scale})`;  // Rakendab skaleerimist
square.querySelector('.timer').textContent = remainingTime;
    if (remainingTime <= 0) {
      clearInterval(timerId);
      finalizeGrowth(square, seed);
    }
  }, 1000);
}

// Taimede valmimine
function finalizeGrowth(square, seed) {
  square.innerHTML = `<img src="${seed.icon}" alt="${seed.name}" style="width: 100px; height: 100px;">`; // Suurendame valmimisel pildi suurust
  square.classList.add("harvestable");
}

// Funktsioon saagi koristamiseks
function harvest(square) {
  if (square.classList.contains("harvestable")) {
    const profit = parseInt(square.dataset.profit);
    alert(`Harvested ${square.textContent}! Profit: $${profit}`);
    money += profit;
    document.getElementById("money").textContent = money;
    clearSquare(square);
  } else {
    alert("This square is still growing!");
  }
}

// Ruudu tühjendamine
function clearSquare(square) {
  square.textContent = "";
  square.classList.remove("harvestable", "planted");
}

// Klikkide kuulajate lisamine ruutudele
document.querySelectorAll('.square').forEach(square => {
  square.addEventListener("click", () => {
    if (!square.classList.contains("planted") && !square.classList.contains("harvestable")) {
      const seedIndex = prompt("Choose seed: \n1. Carrot (Cost: $10) \n2. Tomato (Cost: $15) \n3. Potato (Cost: $20)");
      if (seedIndex && seedIndex >= 1 && seedIndex <= 3) {
        plantSeed(square.id, seedIndex - 1);
      }
    } else if (square.classList.contains("harvestable")) {
      harvest(square);
    }
  });
});

// Algse raha kuvamine
document.getElementById("money").textContent
