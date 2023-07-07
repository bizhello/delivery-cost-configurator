export class ConfigureTariffZone {
    constructor(id, title, removeForm, checkRangeIntersection, formIsValid) {
        this.buttonSave = document.querySelector('.section-save__button');
        this.template = document.querySelector('.template');
        this.templateMarkup = document.querySelector('.template-markup');

        this.id = id;
        this.title = title;
        this.removeForm = removeForm;
        this.checkRangeIntersection = checkRangeIntersection;
        this.formIsValid = formIsValid;

        this.currencyReg = /^[-+]?[0-9]+(\.[0-9]{2})?$/;
        this.weightReg = /^[0-9]+(\.[0-9]{3})?$/;

        this.removeElement = this._removeElement.bind(this);
        this.formatWeightInput = this._formatWeightInput.bind(this);
        this.formatCurrencyInput = this._formatCurrencyInput.bind(this);
        this.addMarkup = this._addMarkup.bind(this);
        this.removeMarkup = this._removeMarkup.bind(this);
        this.onChangeInputMarkupCost = this._onChangeInputMarkupCost.bind(this);
    }

    _checkInputOnValidBaseCostAndWeightCrossing() {
        const errorBaseCost = this.view.querySelector('.error__base-cost');
        const inputBaseCostValue = this.view.querySelector('.configured-tariff-zones__input-base-cost').value;
        const errorWeightCrossing = this.view.querySelector('.configured-tariff-zones__error-weight-crossing');
        const countsInput = this.view.querySelectorAll('.count-input');
        const countsInputIsValid = this.checkRangeIntersection(countsInput);

        if (!inputBaseCostValue) {
            errorBaseCost.classList.add('display-inline');
            errorBaseCost.classList.remove('display-none');
        } else {
            errorBaseCost.classList.remove('display-inline');
            errorBaseCost.classList.add('display-none');
        }

        if (countsInputIsValid) {
            errorWeightCrossing.classList.add('display-inline');
            errorWeightCrossing.classList.remove('display-none');
        } else {
            errorWeightCrossing.classList.remove('display-inline');
            errorWeightCrossing.classList.add('display-none');
        }
    }

    _showPopup() {
        this._popup = document.querySelector('.section-popup');

        this._popup.style.display = 'flex';
        setTimeout(() => {
            this._popup.style.display = 'none';
        }, 800)
    }

    async _onClickButtonSave() {
        this._checkInputOnValidBaseCostAndWeightCrossing()
        const formValid = await this.formIsValid()
        if (formValid) {
            const res = this._createResObj()
            this._showPopup();
            console.log(res);
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

        this.buttonSave.addEventListener('click', async () => this._onClickButtonSave())
    }

    _createResObj() {
        const inputWeightFrom = this.view.querySelectorAll('.configured-tariff-zones__input-weight-from');
        const inputWeightTo = this.view.querySelectorAll('.configured-tariff-zones__input-weight-to');
        const inputMarkupCost = this.view.querySelectorAll('.input-markup-cost');
        const extraCharges = [];

        for (let i = 0; i < inputMarkupCost.length; i++) {
            extraCharges.push({
                "min_weight": inputWeightFrom[i].value,
                "max_weight": inputWeightTo[i].value,
                "charge_value": inputMarkupCost[i].value
            })
        }

        return {
            'rate_area_id': this.id,
            'base_charge_value': this.view.querySelector('.configured-tariff-zones__input').value,
            'extra_charges': extraCharges
        }
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

    _checkInputOnValidMarkup(markup) {
        const inputWeightFromValue = markup.querySelector('.configured-tariff-zones__input-weight-from').value;
        const inputWeightToValue = markup.querySelector('.configured-tariff-zones__input-weight-to').value;
        const inputCostValue = markup.querySelector('.configured-tariff-zones__input-cost').value;

        const errorWeightFrom = markup.querySelector('.error__weight-from');
        const errorWeightTo = markup.querySelector('.error__weight-to');
        const errorMarkupCost = markup.querySelector('.error__markup-cost');

        if (!inputWeightFromValue) {
            errorWeightFrom.classList.add('display-inline')
            errorWeightFrom.classList.remove('display-none');
        } else {
            errorWeightFrom.classList.add('display-none')
            errorWeightFrom.classList.remove('display-inline');
        }
        if (!inputWeightToValue) {
            errorWeightTo.classList.add('display-inline')
            errorWeightTo.classList.remove('display-none');
        } else {
            errorWeightTo.classList.add('display-none')
            errorWeightTo.classList.remove('display-inline');
        }
        if (!inputCostValue) {
            errorMarkupCost.classList.add('display-inline')
            errorMarkupCost.classList.remove('display-none');
        } else {
            errorMarkupCost.classList.add('display-none')
            errorMarkupCost.classList.remove('display-inline');
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

        this.buttonSave.addEventListener('click', () => this._checkInputOnValidMarkup(markup))
    }
}
