export class ConfigureTariffZone {
    constructor(id, title, removeForm, onClickSaveButton) {
        this.template = document.querySelector('.template');
        this.templateMarkup = document.querySelector('.template-markup');

        this.id = id;
        this.title = title;
        this.removeForm = removeForm;

        this.onClickSaveButton = () => {
            console.log('222')
            this._checkInputOnValid();
            onClickSaveButton();
        };

        this.currencyReg = /^[-+]?[0-9]+(\.[0-9]{2})?$/;
        this.weightReg = /^[0-9]+(\.[0-9]{3})?$/;

        this.countMarkup = 1;

        this.removeElement = this._removeElement.bind(this);
        this.formatWeightInput = this._formatWeightInput.bind(this);
        this.formatCurrencyInput = this._formatCurrencyInput.bind(this);
        this.addMarkup = this._addMarkup.bind(this);
        this.removeMarkup = this._removeMarkup.bind(this);
        this.onChangeInputMarkupCost = this._onChangeInputMarkupCost.bind(this);
    }

    _checkInputOnValid() {
        console.log('123')
        const errorBaseCost = this.view.querySelector('.error__base-cost');
        if (this.view.querySelector('.configured-tariff-zones__input-base-cost').value) {
            console.log('check1')
            errorBaseCost.style.display = 'inline'
        } else {
            console.log('check2')
            errorBaseCost.style.display = 'none'
        }
    }

    _validateInput(inputValue, regex) {
        return regex.test(inputValue);
    }

    _formatWeightInput(event) {
        let inputValue = event.target.value;
        inputValue = inputValue.replace(/[^0-9.]/g, '');
        inputValue = inputValue.replace(/\.+/g, '.');
        const decimalIndex = inputValue.indexOf('.');
        if (decimalIndex !== -1) {
            const decimalPart = inputValue.substring(decimalIndex + 1);
            if (decimalPart.length > 3) {
                inputValue = inputValue.substring(0, decimalIndex + 4);
            }
        }
        event.target.value = inputValue;
    }

    _formatCurrencyInput(event) {
        let inputValue = event.target.value;
        inputValue = inputValue.replace(/[^0-9.\-+]/g, '');
        inputValue = inputValue.replace(/\.+/g, '.');
        inputValue = inputValue.replace(/[-+]/g, (match, offset) =>
            offset === 0 ? match : ''
        );
        const decimalIndex = inputValue.indexOf('.');
        if (decimalIndex !== -1) {
            const decimalPart = inputValue.substring(decimalIndex + 1);
            if (decimalPart.length > 2) {
                inputValue = inputValue.substring(0, decimalIndex + 3);
            }
        }
        event.target.value = inputValue;
    }

    _removeElement() {
        this.removeForm(this.id);
    }

    _updateMarkupCostResults() {
        const baseCost = this.view.querySelector('.configured-tariff-zones__input-base-cost').value;
        const markupCostResults = this.view.querySelectorAll('.configured-tariff-zones__result');

        markupCostResults.forEach((result) => {
            const markupCostInput = result.previousElementSibling.querySelector('.configured-tariff-zones__input-cost').value;
            const totalCost = (Number(markupCostInput) + Number(baseCost)).toFixed(2);

            if (baseCost && markupCostInput) {
                result.textContent = `Итоговая стоимость: ${totalCost} Р`;
            } else {
                result.textContent = null;
            }
        });
    }

    _setListener() {
        const delButton = this.view.querySelector('.configured-tariff-zones__del');
        delButton.addEventListener('click', this.removeElement);

        const baseCostInput = this.view.querySelector('.configured-tariff-zones__input-base-cost');
        baseCostInput.addEventListener('input', this.formatCurrencyInput);
        baseCostInput.addEventListener('input', (event) => {
            const isValid = this._validateInput(event.target.value, this.currencyReg);
            if (!isValid) {
                event.target.classList.add('invalid');
            } else {
                event.target.classList.remove('invalid');
            }
        });
        baseCostInput.addEventListener('change', () => this._updateMarkupCostResults());

        const addButton = this.view.querySelector(
            '.configured-tariff-zones__button-base-cost'
        );
        addButton.addEventListener('click', this.addMarkup);
    }

    createElement() {
        this.view = this.template.content.cloneNode(true).querySelector('.template__article');
        this.view.id = `template__article-${this.id}`;
        this.view.querySelector('.configured-tariff-zones__name').textContent = this.title;

        this._setListener();
        this._updateMarkupCostResults();

        return this.view;
    }

    _addMarkup() {
        const markup = this.templateMarkup.content.cloneNode(true).querySelector('.segment');
        const markupCostResult = document.createElement('p');
        markupCostResult.classList.add('p', 'configured-tariff-zones__result');

        this.view.append(markup);
        this.view.append(markupCostResult);

        this._setListenerMarkup(markup, markupCostResult);

        this.countMarkup++;
    }

    _removeMarkup(markup) {
        markup.remove();
    }

    _onChangeInputMarkupCost(e, markupCostResult) {
        const baseCost = this.view.querySelector('.configured-tariff-zones__input-base-cost');
        if (e.target.value && baseCost.value) {
            markupCostResult.textContent = `Итоговая стоимость: ${(Number(e.target.value) + Number(baseCost.value)).toFixed(2)
                } Р`;
        } else {
            markupCostResult.textContent = null;
        }
    }

    _setListenerMarkup(markup, markupCostResult) {
        markup.querySelector('.remove-markup').addEventListener('click', () =>
            this.removeMarkup(markup)
        );

        const weightFromInput = markup.querySelector('.configured-tariff-zones__input-weight-from');
        weightFromInput.addEventListener('input', this.formatWeightInput);
        weightFromInput.addEventListener('input', (event) => {
            const isValid = this._validateInput(event.target.value, this.weightReg);
            if (!isValid) {
                event.target.classList.add('invalid');
            } else {
                event.target.classList.remove('invalid');
            }
            this._updateMarkupCostResults();
        });

        const weightToInput = markup.querySelector('.configured-tariff-zones__input-weight-to');
        weightToInput.addEventListener('input', this.formatWeightInput);
        weightToInput.addEventListener('input', (event) => {
            const isValid = this._validateInput(event.target.value, this.weightReg);
            if (!isValid) {
                event.target.classList.add('invalid');
            } else {
                event.target.classList.remove('invalid');
            }
            this._updateMarkupCostResults();
        });

        const costInput = markup.querySelector('.configured-tariff-zones__input-cost');
        costInput.addEventListener('input', this.formatCurrencyInput);
        costInput.addEventListener('input', (event) => {
            const isValid = this._validateInput(event.target.value, this.currencyReg);
            if (!isValid) {
                event.target.classList.add('invalid');
            } else {
                event.target.classList.remove('invalid');
            }
            ;
        });
        costInput.addEventListener('change', (e) =>
            this._onChangeInputMarkupCost(e, markupCostResult)
        );
    }
}
