import './index.css';

import rateAreas from '../utils/rateAreas.js';
import { FindZone } from '../components/FindZone';
import { FindZoneLi } from '../components/FindZoneLi'
import { ConfiguredTariffZone } from '../components/ConfiguredTariffZone';
import { InputValidator } from '../components/InputValidator';

const searchTariffZoneTriangle = document.querySelector('.search-tariff-zone__triangle');
const searchTariffZoneInput = document.querySelector('.search-tariff-zone__input')
const searchTariffZoneLists = document.querySelector('.search-tariff-zone__lists');
const template = document.querySelector('.template');
const configuredTariffZones = document.querySelector('.configured-tariff-zones');
const saveSection = document.querySelector('.section-save');

let tariffZones = []
let arr = []

function arrNull() {
    setTimeout(() => {
        arr = []
    }, 1500);
}

rateAreas.forEach((item) => {
    const configuredTariffZone = new ConfiguredTariffZone(template, item.name, item.id, () => {
        configuredTariffZone.removeElement();
        tariffZones = tariffZones.filter(area => area.id !== item.id)
        li.querySelector('.search-tariff-zone__button').textContent = 'Добавить';
        checkSectionOnEmpty()
    }, () => {
        configuredTariffZone.addMarkup();
    }, () => {
        configuredTariffZone.removeMarkup();
    }, () => {
        arr.push(configuredTariffZone.createResObj())
        arrNull()

        return arr
    })
    const findZoneLi = new FindZoneLi(item.id, item.name, () => {
        let findEl = tariffZones.some(area => area.id === item.id)
        if (findEl) {
            configuredTariffZone.removeElement()
            tariffZones = tariffZones.filter(area => area.id !== item.id)
        } else {
            const el = configuredTariffZone.createElement();
            addValidatorForEl(el);
            configuredTariffZones.append(el);
            tariffZones.push(item);
        }
        checkSectionOnEmpty();
    })
    const li = findZoneLi.createLi()
    searchTariffZoneLists.append(li)
})

const findZone = new FindZone(searchTariffZoneInput, searchTariffZoneTriangle, searchTariffZoneLists)
findZone.setEventListeners()


function checkSectionOnEmpty() {
    if (tariffZones.length === 0) {
        configuredTariffZones.style.display = 'none';
        saveSection.style.display = 'none'
    } else {
        configuredTariffZones.style.display = 'block';
        saveSection.style.display = 'inline-block'
    }
}

function addValidatorForEl(el) {
    const costInput = el.querySelectorAll('.cost-input');
    const countInput = el.querySelectorAll('.count-input');

    for (let i = 0; i < 2; i++) {
        new InputValidator(costInput[i], true)
        new InputValidator(countInput[i])
    }
}

// // Создаем экземпляр InputValidator для поля ввода количества кг
// const kgInputField = document.querySelector('.test-one');
// const kgValidator = new InputValidator(kgInputField);

// // Создаем экземпляр InputValidator для поля ввода валюты
// const currencyInputField = document.querySelector('.test-two');
// const currencyValidator = new InputValidator(currencyInputField, true);
