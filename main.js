'use strict';

const spanMoney = document.getElementById('money')
const spanAdd = document.getElementById('addPerClick')
const spanAuto = document.getElementById('addPerSecond')

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

let addStep = 1n
let autoStep = 1n
let addPrice = 200n
let autoPrice = 100n

let priceRate = 2n

let counterUpgradeAdd = 2
let counterUpgradeAuto = 3

function getUpgradeValue(value, counter) {
    const stringNumber = value.toString()
    const range = stringNumber.length - 1
    switch (stringNumber[0]) {
        case '1' :
            counter = 3
            return BigInt(2 * (10**range))
        case '2' :
            counter = 1
            return BigInt(5 * (10**range))
        case '5' :
            counter = 1
            return BigInt(10 * (10**range))
    }
}

BigInt.prototype.toFormat = function() {
    return this.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')
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
    }
    requestAnimationFrame(addPerSecond)
}

function addMoney( number ) {
    money += number
    spanMoney.innerText = money.toFormat()
    
    setTimeout(updateUpgradeButtons, 32)
}

function updateUpgradeButtons() {
    upgradeClickButton.classList.toggle('active', money >= addPrice)
    upgradeAutoButton.classList.toggle('active', money >= autoPrice)
}

function getClick() {
    addMoney(add)
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
        addStep = getUpgradeValue(addStep, counterUpgradeAdd)
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
        autoStep = getUpgradeValue(autoStep, counterUpgradeStart)
        upgradeAutoValue.innerText = autoStep.toFormat()
    }
}
