'use strict'

BigInt.prototype.toFormat = function() {
    return this.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')
}

const spanMoney = document.getElementById('money')
const spanAdd = document.getElementById('addPerClick')
const spanAuto = document.getElementById('addPerSecond')

const turboButton = document.getElementById('start-turbo')
const divTurboTimer = document.getElementById('turboCounter')
const divTurboRate = document.getElementById('turboRate')
const divTurboPrice = document.getElementById('divPriceTurbo')
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

let money = 0n
let add = 1n
let auto = 0n

let turboMoneyRate = 5n
let turboPrice = 1000n
const turboPriceRate = 2n
let isTurbo = false
let turboTimer = 30 // seconds
let turboCount = turboTimer

divTurboTimer.innerText = turboTimer
divTurboRate.innerText = turboMoneyRate
divTurboPrice.innerText = turboPrice.toFormat()

let addStep = 1n
let autoStep = 1n
let addPrice = 200n
let autoPrice = 100n

let priceRate = 2n

let counterUpgradeAdd = 2
let counterUpgradeAuto = 3

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

spanMoney.innerText = money
spanAdd.innerText = add
spanAuto.innerText = auto
upgradeClickValue.innerText = addStep.toFormat()
upgradeClickPrice.innerText = addPrice.toFormat()
upgradeAutoValue.innerText = autoStep.toFormat()
upgradeAutoPrice.innerText = autoPrice.toFormat()

let time = 0
requestAnimationFrame(addPerSecond)
function addPerSecond(data) {
    if ((data - time) >= 1000) {
        time = data
        addMoney(auto)

        if (isTurbo) {
            if (turboCount > 0) {
                turboCount--
            } else {
                isTurbo = false
                turboCount = turboTimer
                button.classList.remove('turbo')
                turboButton.classList.remove('turbo')
            }
            divTurboTimer.innerText = turboCount
        }
    }
    requestAnimationFrame(addPerSecond)
}

function addMoney( number ) {
    money += isTurbo ? number * turboMoneyRate : number
    spanMoney.innerText = money.toFormat()
    
    setTimeout(updateUpgradeButtons, 32)
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
    if (money < turboPrice || isTurbo) return

    addMoney(-turboPrice)

    isTurbo = true
    turboPrice *= turboPriceRate
    divTurboPrice.innerText = turboPrice.toFormat()

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

    addMoney(-autoPrice)
    autoPrice *= priceRate
    upgradeAutoPrice.innerText = autoPrice.toFormat()

    counterUpgradeAuto--
    if (counterUpgradeAuto === 0) {
        autoStep = getUpgradeValue(autoStep, 'auto')
        upgradeAutoValue.innerText = autoStep.toFormat()
    }
}
