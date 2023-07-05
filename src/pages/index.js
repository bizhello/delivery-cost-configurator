import './index.css';

import rateAreas from '../utils/rateAreas.js';

import { FindZone } from '../components/FindZone'
import { MountElement } from '../components/mountElement';
import { TarifZone } from '../components/TarifZone';
import { ConfigureTarifZone } from '../components/ConfigureTarifZone'
import { SaveButton } from '../components/SaveButton'

const searchTariffZoneInput = document.querySelector('.search-tariff-zone__input');
const searchTariffZoneLists = document.querySelector('.search-tariff-zone__lists');
const searchTariffZoneTriangle = document.querySelector('.search-tariff-zone__triangle');
const configuredTariffZones = document.querySelector('.configured-tariff-zones');
const sectionSaveButton = document.querySelector('.section-save__button');
const sectionSave = document.querySelector('.section-save');

//Список Тарифный Зон
const tarifZonesArr = [];
let formZonesArr = []

// создаем и монтируем в дом список городов
function initialZones() {
    rateAreas.forEach(({ id, name }) => {
        const tarifZone = new TarifZone(id, name, handleButtonZone).createZone();
        tarifZonesArr.push(tarifZone);
        const mountTarifZone = new MountElement(tarifZone, searchTariffZoneLists);
        mountTarifZone.mount();
    })
}

//Добавляем логику поиска
const findZone = new FindZone(searchTariffZoneInput, searchTariffZoneTriangle, handleButtonSearch, tarifZonesArr, openTarifZones);
//Создание кнопки сохранения форм
const saveButton = new SaveButton(sectionSaveButton, OnClickSaveButton)

//нажатие на Кнопку добавить/удалить у Тарифной Зоны
function handleButtonZone(id, name) {
    //сделать изменение кнопки по ID
    const button = document.getElementById(`search-tariff-zone__button-${id}`);
    if (button.textContent === 'Добавить') {
        button.textContent = 'Удалить';
        addForm(id, name);
    } else {
        removeForm(id)
    }
}

//Cоздание формы
function createForm(id, name) {
    const configureTarifZone = new ConfigureTarifZone(id, name, removeForm).createElement();

    return configureTarifZone;
}

//Монтирование Формы
function mountForm(form) {
    const mountElement = new MountElement(form, configuredTariffZones);
    mountElement.mount();
}

//Добавление формы в ноду
function addForm(id, name) {
    const form = createForm(id, name);
    mountForm(form);
    hideOrshowElDependenciesOfForm(openElement)

    formZonesArr.push({ id, form })
}
//Удаление формы из ноды
function removeForm(id) {
    const element = document.getElementById(`template__article-${id}`);
    const button = document.getElementById(`search-tariff-zone__button-${id}`);

    element.remove();
    button.textContent = 'Добавить'
    formZonesArr = formZonesArr.filter(item => item.id !== id);

    hideOrshowElDependenciesOfForm(hideElement)
}

//Открыть элемент
function openElement(element) {
    element.style.display = 'block'
    element.classList.remove('display-none');
    element.classList.add('display-block');
}
//Cкрыть элемент
function hideElement(element) {
    element.style.display = 'none'
    element.classList.remove('display-block');
    element.classList.add('display-none');
}

//Скрыть или открыть элемент
function hideOrshowEl(element) {
    if (element.classList.contains('display-block')) {
        hideElement(element)
    } else {
        openElement(element)
    }
}

//Скрыть или открыть элементы в зависимости если ли в масиве Формы
function hideOrshowElDependenciesOfForm(fnc) {
    if (formZonesArr.length === 0) {
        fnc(configuredTariffZones);
        fnc(sectionSave);
    }
}

// Переключение списка Тарифной Зоны (открытие и закрытие)
function handleButtonSearch() {
    hideOrshowEl(searchTariffZoneLists)
}
// Отобразить список Тарифной Зоны
function openTarifZones() {
    openElement(searchTariffZoneLists)
}

//Нажатие на сохранени кнопки: 'Сохранить изменения'
function OnClickSaveButton() {
    console.log('click button SAVE-BUTTON')
}

//Выполнение функционала: 

//Cоздаем и монтируем в дом список городов
initialZones();
//Добавляем логику поиска
findZone.setListener();
//Слушаем кнопку сохранения форм
saveButton.setListener();