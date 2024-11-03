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
divPriceAdd.style.backgroundColor = 'lightGray'

const upgradeAutoButton = document.getElementById('upgradeAuto')
const divPriceAuto = document.getElementById('divPriceAuto')
const upgradeAutoValue = document.getElementById('upgradeAutoAdd')
const upgradeAutoPrice = document.getElementById('upgradeAutoPrice')
upgradeAutoButton.onclick = getClickUpgradeAuto
divPriceAuto.style.backgroundColor = 'lightGray'

let money = 0n
let add = 1n
let auto = 0n

let addStep = 1n
let autoStep = 1n
let addPrice = 2n
let autoPrice = 2n

let priceRate = 2n

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
    checkButtons()
}

function checkButtons() {
    divPriceAdd.style.backgroundColor = (money < addPrice) ? 'lightGray' : 'lime'
    divPriceAuto.style.backgroundColor = (money < autoPrice) ? 'lightGray' : 'lime'
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
}

function getClickUpgradeAuto() {
    if (money < autoPrice) return

    auto += autoStep
    spanAuto.innerText = auto.toFormat()

    addMoney(-autoPrice)
    autoPrice *= priceRate
    upgradeAutoPrice.innerText = autoPrice.toFormat()
}