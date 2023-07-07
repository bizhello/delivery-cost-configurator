import './index.css';

import rateAreas from '../utils/rateAreas.js';

import { FindZone } from '../components/FindZone'
import { MountElement } from '../components/mountElement';
import { TariffZone } from '../components/TariffZone';
import { ConfigureTariffZone } from '../components/ConfigureTariffZone'
import { SaveButton } from '../components/SaveButton'

const searchTariffZoneInput = document.querySelector('.search-tariff-zone__input');
const searchTariffZoneLists = document.querySelector('.search-tariff-zone__lists');
const searchTariffZoneTriangle = document.querySelector('.search-tariff-zone__triangle');
const configuredTariffZones = document.querySelector('.configured-tariff-zones');
const sectionSaveButton = document.querySelector('.section-save__button');
const sectionSave = document.querySelector('.section-save');

//Список Тарифный Зон
const tariffZonesArr = [];
let formZonesArr = []

// создаем и монтируем в дом список городов
function initialZones() {
    rateAreas.forEach(({ id, name }) => {
        const tariffZone = new TariffZone(id, name, handleButtonZone).createZone();
        tariffZonesArr.push(tariffZone);
        const mountTariffZone = new MountElement(tariffZone, searchTariffZoneLists);
        mountTariffZone.mount();
    })
}

//Добавляем логику поиска
const findZone = new FindZone(searchTariffZoneInput, searchTariffZoneTriangle, handleButtonSearch, tariffZonesArr, openTariffZones);
//Создание кнопки сохранения форм
const saveButton = new SaveButton(sectionSaveButton, onClickSaveButton)

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
    const configureTariffZone = new ConfigureTariffZone(id, name, removeForm, onClickSaveButton).createElement();

    return configureTariffZone;
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
    hideOrShowElDependenciesOfForm(openElement)

    formZonesArr.push({ id, form })
}
//Удаление формы из ноды
function removeForm(id) {
    const element = document.getElementById(`template__article-${id}`);
    const button = document.getElementById(`search-tariff-zone__button-${id}`);

    element.remove();
    button.textContent = 'Добавить'
    formZonesArr = formZonesArr.filter(item => item.id !== id);

    hideOrShowElDependenciesOfForm(hideElement)
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
function hideOrShowElDependenciesOfForm(fnc) {
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
function openTariffZones() {
    openElement(searchTariffZoneLists)
}

//Нажатие на сохранени кнопки: 'Сохранить изменения'
function onClickSaveButton() {
    console.log('click button SAVE-BUTTON')
}

//Выполнение функционала: 

//Cоздаем и монтируем в дом список городов
initialZones();
//Добавляем логику поиска
findZone.setListener();
//Слушаем кнопку сохранения форм
saveButton.setListener();