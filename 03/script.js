// Seed data
const seeds = [
    {
        name: "Carrot",
        cost: 10,
        growthTime: 15,
        profit: 20,
        icon: "img/porgand.png",
    },
    {
        name: "Tomato",
        cost: 15,
        growthTime: 21,
        profit: 30,
        icon: "img/tomat.png",
    },
    {
        name: "Potato",
        cost: 20,
        growthTime: 29,
        profit: 40,
        icon: "img/kartul.png",
    },
];

// Initial money
let money = 100;

// Update display of money
function updateMoneyDisplay() {
    const moneyDisplay = document.getElementById("money");
    moneyDisplay.textContent = money;

    // Add the bounce class to trigger the animation
    moneyDisplay.classList.add("bounce");

    // Remove the bounce class after the animation ends to reset the state
    moneyDisplay.addEventListener(
        "animationend",
        () => {
            moneyDisplay.classList.remove("bounce");
        },
        { once: true }
    ); // Ensures the listener is removed after it fires
}

// Function to show custom alert
function showAlert(message) {
    const alertBox = document.getElementById("customAlert");
    document.getElementById("alertText").textContent = message;
    alertBox.style.display = "block";
}

// Function to close custom alert
function closeAlert() {
    const alertBox = document.getElementById("customAlert");
    alertBox.style.display = "none";
}

// Function to show modal for seed selection
function showModal(title) {
    const modal = document.getElementById("customModal");
    document.getElementById("modalTitle").textContent = title;
    modal.style.display = "block";
}

// Function to close modal
function closeModal() {
    const modal = document.getElementById("customModal");
    modal.style.display = "none";
}

// Function to render seed icon
function renderIcon(seed, scale = 1) {
    return `<img src="${seed.icon}" alt="${seed.name}" style="width: ${
        30 * scale
    }px; height: ${30 * scale}px;">`;
}

// Function to plant a seed
function plantSeed(squareId, seedIndex) {
    const square = document.getElementById(squareId);
    const seed = seeds[seedIndex];
    if (money < seed.cost) {
        showAlert("Heh, sul pole ju raha nii palju! Oota pisut.");
        return;
    }
    square.innerHTML = `${renderIcon(seed, 1)}<span class="timer">${
        seed.growthTime
    }</span>`;
    square.dataset.growthTime = seed.growthTime;
    square.dataset.profit = seed.profit;
    square.dataset.plantedAt = Date.now();
    square.classList.add("planted");
    money -= seed.cost;
    updateMoneyDisplay();
    startGrowthTimer(square, seed);
}

// Function to start growth timer
function startGrowthTimer(square, seed) {
    const timerId = setInterval(() => {
        const elapsedTime = Math.floor(
            (Date.now() - parseInt(square.dataset.plantedAt)) / 1000
        );
        const remainingTime = seed.growthTime - elapsedTime;
        if (remainingTime <= 0) {
            clearInterval(timerId);
            finalizeGrowth(square, seed);
        } else {
            const scale = 1 + (elapsedTime / seed.growthTime) * 2; // Update scale calculation as needed
            let img = square.querySelector("img");
            const imgWidth = img.offsetWidth; // Get the image width
            const imgHeight = img.offsetHeight; // Get the image height
            const originX = imgWidth - 5; // 5px from the right edge
            const originY = imgHeight - 5; // 5px from the bottom edge
            img.style.transformOrigin = `${originX}px ${originY}px`; // Set transform origin dynamically
            img.style.transform = `scale(${scale})`; // Apply scale transform
            square.querySelector(".timer").textContent = remainingTime;
        }
    }, 1000);
}

// Function to finalize growth
function finalizeGrowth(square, seed) {
    square.innerHTML = `<img src="${seed.icon}" alt="${seed.name}" style="width: 100px; height: 100px;">`;
    square.classList.add("harvestable");
}

// Function to harvest crops
function harvest(square) {
    if (square.classList.contains("harvestable")) {
        const profit = parseInt(square.dataset.profit);
        money += profit;
        updateMoneyDisplay();
        clearSquare(square);
    } else {
        showAlert("This square is still growing!");
    }
}

// Function to clear square
function clearSquare(square) {
    square.innerHTML = "";
    square.classList.remove("harvestable", "planted");
}

// Setup event listeners for squares and modal buttons
function setupEventListeners() {
    document.querySelectorAll(".square").forEach((square) => {
        square.addEventListener("click", function () {
            if (
                !this.classList.contains("planted") &&
                !this.classList.contains("harvestable")
            ) {
                showModal("Vali seeme:");
                currentSquareId = this.id; // Store the current square's id
            } else if (this.classList.contains("harvestable")) {
                harvest(this);
            }
        });
    });

    const buttons = document.querySelectorAll("#modalButtons button");
    buttons.forEach((button) => {
        button.removeEventListener("click", handleSeedSelection); // Remove old listeners
        button.addEventListener("click", handleSeedSelection); // Attach new listener
    });
}

function handleSeedSelection() {
    const seedIndex = parseInt(this.getAttribute("data-seed"));
    closeModal();
    plantSeed(currentSquareId, seedIndex);
}

let currentSquareId = null; // This will hold the ID of the currently active square
document.querySelector(".close-button").addEventListener("click", closeModal);
setupEventListeners();
updateMoneyDisplay();
