'use strict'

BigInt.prototype.toFormat = function() {
    return this.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')
}

const spanMoney = document.getElementById('money')
const spanAdd = document.getElementById('addPerClick')
const spanAuto = document.getElementById('addPerSecond')

const divProgress = document.getElementById('progress')
const spanLevel = document.getElementById('levelProgress')
const spanLevelProgress = document.getElementById('currentProgress')
const spanTargetProgress = document.getElementById('targetProgress')

const turboButton = document.getElementById('start-turbo')
const divTurboTimer = document.getElementById('turboCounter')
const divTurboRate = document.getElementById('turboRate')
const divTurboPrice = document.getElementById('divPriceTurbo')
const spanTurboPrice = document.getElementById('turboPrice')
turboButton.onclick = getTurboClick

const button = document.getElementById('clickButton')
button.onclick = getClick

const upgradeClickButton = document.getElementById('upgradeClick')
const divPriceAdd = document.getElementById('divPriceAdd')
const upgradeClickValue = document.getElementById('upgradeClickAdd')
const upgradeClickPrice = document.getElementById('upgradeClickPrice')
upgradeClickButton.onclick = getClickUpgradeAdd

const upgradeAutoButton = document.getElementById('upgradeAuto')
const divPriceAuto = document.getElementById('divPriceAuto')
const upgradeAutoValue = document.getElementById('upgradeAutoAdd')
const upgradeAutoPrice = document.getElementById('upgradeAutoPrice')
upgradeAutoButton.onclick = getClickUpgradeAuto

let level = 1n
let levelProgress = 0n
let nextLevelPrice = 1000n
const nextLevelPriceRate = 2n
const progressBarMaxWidth = document.getElementById('progressBar').offsetWidth
let progressWidthStep = progressBarMaxWidth / Number(nextLevelPrice)
divProgress.style.width = 0;
spanLevel.innerText = level.toFormat()
spanLevelProgress.innerText = levelProgress.toFormat()
spanTargetProgress.innerText = nextLevelPrice.toFormat()

let money = 0n
let add = 1n
let auto = 0n
const timeRate = 13
const timeStamp = Math.round(1000 / timeRate)
let autoPerTimeStamp = Number(auto) / timeRate
let autoCurrent = 0

spanMoney.innerText = money
spanAdd.innerText = add
spanAuto.innerText = auto

let turboMoneyRate = 1n
let turboPrice = 200n
const turboPriceRate = 2n
let isTurbo = false
let turboTimer = 10 // seconds
let turboCount = turboTimer * timeRate

divTurboTimer.innerText = turboTimer.toFixed(1)
divTurboRate.innerText = turboMoneyRate
spanTurboPrice.innerText = turboPrice.toFormat()

let addStep = 1n
let autoStep = 1n
let addPrice = 100n
let autoPrice = 50n

let priceRate = 2n

let counterUpgradeAdd = 2
let counterUpgradeAuto = 3

upgradeClickValue.innerText = addStep.toFormat()
upgradeClickPrice.innerText = addPrice.toFormat()
upgradeAutoValue.innerText = autoStep.toFormat()
upgradeAutoPrice.innerText = autoPrice.toFormat()

function updateCounter(counter, value) {
    switch (counter) {
        case 'add' :
            counterUpgradeAdd = value
            break;
        case 'auto' :
            counterUpgradeAuto = value
            break;
    }
}

function getUpgradeValue(value, counter) {
    const stringNumber = value.toString()
    const range = stringNumber.length - 1
    switch (stringNumber[0]) {
        case '1' :
            updateCounter(counter, 1)
            return BigInt(2 * (10**range))
        case '2' :
            updateCounter(counter, 1)
            return BigInt(5 * (10**range))
        case '5' :
            updateCounter(counter, 2)
            return BigInt(10 * (10**range))
    }
}

let time = 0
requestAnimationFrame(addPerSecond)
function addPerSecond(data) {
    if ((data - time) >= timeStamp) {
        time = data

        autoCurrent += autoPerTimeStamp
        if (autoCurrent >= 1) {
            let bonus = Math.floor(autoCurrent)
            autoCurrent -= bonus
            addMoney( BigInt(bonus) )
        }        

        if (isTurbo) {
            if (turboCount > 0) {
                turboCount--
            } else {
                isTurbo = false
                turboCount = turboTimer * timeRate
                button.classList.remove('turbo')
                turboButton.classList.remove('turbo')
            }
            divTurboTimer.innerText = (turboCount / timeRate).toFixed(1)
        }
    }
    requestAnimationFrame(addPerSecond)
}

function addMoney( number ) {
    money += isTurbo ? number * turboMoneyRate : number
    spanMoney.innerText = money.toFormat()

    if (number > 0) updateLevelProgress(number)
    
    setTimeout(updateUpgradeButtons, 32)
}

function updateLevelProgress(number) {
    levelProgress += number
    if (levelProgress >= nextLevelPrice) {
        level += 1n
        spanLevel.innerText = level.toFormat()

        levelProgress = levelProgress - nextLevelPrice

        nextLevelPrice *= nextLevelPriceRate
        spanTargetProgress.innerText = nextLevelPrice.toFormat()
        progressWidthStep = progressBarMaxWidth / Number(nextLevelPrice)

        turboMoneyRate++
        divTurboRate.innerText = turboMoneyRate
    }

    divProgress.style.width = progressWidthStep * Number(levelProgress) + 'px'
    spanLevelProgress.innerText = levelProgress.toFormat()
}

function updateUpgradeButtons() {
    turboButton.classList.toggle('active', money >= turboPrice)

    upgradeClickButton.classList.toggle('active', money >= addPrice)
    upgradeAutoButton.classList.toggle('active', money >= autoPrice)
}

function getClick() {
    addMoney(add)
}

function getTurboClick() {
    if (priceRate < 2 || money < turboPrice || isTurbo) return

    addMoney(-turboPrice)

    isTurbo = true
    turboPrice *= turboPriceRate
    spanTurboPrice.innerText = turboPrice.toFormat()

    button.classList.add('turbo')
    turboButton.classList.add('turbo')
}

function getClickUpgradeAdd() {
    if (money < addPrice) return

    add += addStep
    spanAdd.innerText = add.toFormat()

    addMoney(-addPrice)
    addPrice *= priceRate
    upgradeClickPrice.innerText = addPrice.toFormat()

    counterUpgradeAdd--
    if (counterUpgradeAdd === 0) {
        addStep = getUpgradeValue(addStep,'add')
        upgradeClickValue.innerText = addStep.toFormat()
    }
}

function getClickUpgradeAuto() {
    if (money < autoPrice) return

    auto += autoStep
    spanAuto.innerText = auto.toFormat()
    autoPerTimeStamp = Number(auto) / timeRate

    addMoney(-autoPrice)
    autoPrice *= priceRate
    upgradeAutoPrice.innerText = autoPrice.toFormat()

    counterUpgradeAuto--
    if (counterUpgradeAuto === 0) {
        autoStep = getUpgradeValue(autoStep, 'auto')
        upgradeAutoValue.innerText = autoStep.toFormat()
    }
}
