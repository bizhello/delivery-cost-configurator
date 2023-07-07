export class TariffZone {
    constructor(id, name, handleButton) {
        this.id = id;
        this.name = name;
        this.handleButton = handleButton;
    }

    _buttonClick() {
        this.handleButton(this.id, this.name);
    }

    _setListener() {
        this.view.querySelector('.search-tariff-zone__button').addEventListener('click', this._buttonClick.bind(this));
    }

    createZone() {
        const li = document.createElement('li');
        const p = document.createElement('p');
        const button = document.createElement('button');

        li.setAttribute('class', 'li flex search-tariff-zone__list');
        p.setAttribute('class', 'p search-tariff-zone__text');
        button.setAttribute('class', 'button search-tariff-zone__button');
        button.id = `search-tariff-zone__button-${this.id}`

        p.textContent = this.name;
        button.textContent = 'Добавить';

        li.appendChild(p);
        li.appendChild(button);

        this.view = li;

        this._setListener();

        return li;
    }
}