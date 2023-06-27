export class FindZoneLi {
    constructor(id, name, handleButtonLi) {
        this.name = name;
        this._handleButtonLi = handleButtonLi;
    }

    _setListener = () => {
        this.view.querySelector('.search-tariff-zone__button').addEventListener('click', this.onHandleButtonLi);
    }

    createLi = () => {
        const li = document.createElement('li');
        const p = document.createElement('p');
        const button = document.createElement('button');

        li.setAttribute('class', 'li flex search-tariff-zone__list');
        p.setAttribute('class', 'p search-tariff-zone__text');
        button.setAttribute('class', 'button search-tariff-zone__button');

        p.textContent = this.name;
        button.textContent = 'Добавить';

        li.appendChild(p);
        li.appendChild(button);

        this.view = li;

        this._setListener();

        return li;
    }

    onHandleButtonLi = () => {
        const textButton = this.view.querySelector('.search-tariff-zone__button');

        if (textButton.textContent === 'Добавить') {
            textButton.textContent = 'Удалить';
        } else {
            textButton.textContent = 'Добавить';
        }
        this._handleButtonLi();
    }
}
