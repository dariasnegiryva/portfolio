let hunger = 50
let happiness = 50
let energy = 50

let currentAction = 0
let currentMood = "idle"      // idle, happy, sad, sleep

const actions = ["feed", "play", "sleep"]
const actionNames = ["FEED", "PLAY", "SLEEP"]

const pet = document.getElementById("pet")

const hungerSpan = document.getElementById("hunger")
const happinessSpan = document.getElementById("happiness")
const energySpan = document.getElementById("energy")

const leftBtn = document.getElementById("left")
const rightBtn = document.getElementById("right")
const selectBtn = document.getElementById("select")

const actionLabel = document.getElementById("action")

// ВСЕ АНИМАЦИИ
const animations = {
    // Постоянные состояния
    idle: ["images/cat_idle_1.png", "images/cat_idle_2.png", "images/cat_idle_3.png", "images/cat_idle_4.png"],
    happy: ["images/cat_happy_1.png", "images/cat_happy_2.png"],
    sad: ["images/cat_sad.png"],
    sleep: ["images/cat_sleep_1.png", "images/cat_sleep_2.png"],
    
    // Временные анимации (действия)
    eat: ["images/cat_eat_1.png", "images/cat_eat_2.png", "images/cat_eat_3.png"],
    play: ["images/cat_play_1.png", "images/cat_play_2.png", "images/cat_play_3.png"]
}

let frameIndex = 0
let animationInterval = null
let isTemporaryAnimation = false

// Запуск анимации
function startAnimation(animationName, onComplete = null) {
    // Останавливаем текущую анимацию
    if (animationInterval) {
        clearInterval(animationInterval)
        animationInterval = null
    }
    
    const frames = animations[animationName]
    if (!frames || frames.length === 0) return
    
    frameIndex = 0
    pet.src = frames[0]
    
    isTemporaryAnimation = (onComplete !== null)
    
    animationInterval = setInterval(() => {
        frameIndex++
        
        if (frameIndex >= frames.length) {
            if (isTemporaryAnimation) {
                // Временная анимация закончилась
                clearInterval(animationInterval)
                animationInterval = null
                if (onComplete) onComplete()
            } else {
                // Постоянная анимация — зацикливаем
                frameIndex = 0
                pet.src = frames[0]
            }
        } else {
            pet.src = frames[frameIndex]
        }
    }, 200) // 200ms на кадр
}

// Определяем текущее настроение по статистике
function determineMood() {
    if (hunger > 80) return "sad"
    if (energy < 20) return "sleep"
    if (happiness > 70) return "happy"
    return "idle"
}

// Обновить внешний вид питомца
function updatePetMood() {
    // Если сейчас идёт временная анимация — не прерываем её
    if (isTemporaryAnimation) return
    
    const newMood = determineMood()
    if (currentMood !== newMood) {
        currentMood = newMood
        startAnimation(currentMood)
    }
}

function updateStats() {
    hunger = Math.min(Math.max(hunger, 0), 100)
    happiness = Math.min(Math.max(happiness, 0), 100)
    energy = Math.min(Math.max(energy, 0), 100)
    
    hungerSpan.innerText = Math.floor(hunger)
    happinessSpan.innerText = Math.floor(happiness)
    energySpan.innerText = Math.floor(energy)
}

function updateAction() {
    actionLabel.innerText = actionNames[currentAction]
}

// ДЕЙСТВИЯ С АНИМАЦИЯМИ
function feed() {
    startAnimation("eat", () => {
        hunger = Math.max(0, hunger - 20)
        happiness = Math.min(100, happiness + 5)
        updateStats()
        isTemporaryAnimation = false
        currentMood = determineMood()
        startAnimation(currentMood)
    })
}

function playAction() {
    startAnimation("play", () => {
        happiness = Math.min(100, happiness + 15)
        energy = Math.max(0, energy - 10)
        hunger = Math.min(100, hunger + 5)
        updateStats()
        isTemporaryAnimation = false
        currentMood = determineMood()
        startAnimation(currentMood)
    })
}

function sleepAction() {
    startAnimation("sleep", () => {
        energy = Math.min(100, energy + 25)
        updateStats()
        isTemporaryAnimation = false
        currentMood = determineMood()
        startAnimation(currentMood)
    })
}

function performAction() {
    const action = actions[currentAction]
    if (action === "feed") feed()
    if (action === "play") playAction()
    if (action === "sleep") sleepAction()
}

// КНОПКИ
leftBtn.addEventListener("click", () => {
    currentAction = (currentAction - 1 + actions.length) % actions.length
    updateAction()
})

rightBtn.addEventListener("click", () => {
    currentAction = (currentAction + 1) % actions.length
    updateAction()
})

selectBtn.addEventListener("click", performAction)

// Фоновое уменьшение шкал
setInterval(() => {
    if (isTemporaryAnimation) return
    
    hunger = Math.min(100, hunger + 1)
    energy = Math.max(0, energy - 1)
    
    if (hunger > 70) {
        happiness = Math.max(0, happiness - 1)
    }
    
    updateStats()
    updatePetMood()
}, 10000)

function updateStatColors() {
    const fullnessVal = Math.floor(fullness)
    const happinessVal = Math.floor(happiness)
    const energyVal = Math.floor(energy)
    
    // Сытость
    if (fullnessVal >= 70) fullnessSpan.className = "stat-good"
    else if (fullnessVal >= 30) fullnessSpan.className = "stat-warning"
    else fullnessSpan.className = "stat-bad"
    
    // Счастье
    if (happinessVal >= 70) happinessSpan.className = "stat-good"
    else if (happinessVal >= 30) happinessSpan.className = "stat-warning"
    else happinessSpan.className = "stat-bad"
    
    // Энергия
    if (energyVal >= 70) energySpan.className = "stat-good"
    else if (energyVal >= 30) energySpan.className = "stat-warning"
    else energySpan.className = "stat-bad"
}
function updateStats() {
    // ... ваш существующий код (fullness, happiness, energy) ...
    
    // ВЫЧИСЛЯЕМ ОБЩЕЕ ЗДОРОВЬЕ
    const totalHealth = Math.floor((fullness + happiness + energy) / 3)
    
    // ОБНОВЛЯЕМ ПОЛОСКУ
    const healthFill = document.getElementById("healthFill")
    if (healthFill) {
        healthFill.style.width = totalHealth + "%"
        
        // Меняем цвет полоски в зависимости от здоровья
        if (totalHealth >= 70) {
            healthFill.style.background = "#00ff88"
        } else if (totalHealth >= 30) {
            healthFill.style.background = "#ffcc00"
        } else {
            healthFill.style.background = "#ff4444"
        }
    }
    
 // Запуск
updateStats()
updateAction()
currentMood = determineMood()
startAnimation(currentMood)   
}
