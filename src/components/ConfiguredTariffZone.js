export class ConfiguredTariffZone {
    constructor(template, elementTitle, id, handleDeleteClick, handleBaseCostButton, handleRemoveMarkup) {
        this._template = template;
        this._elementTitle = elementTitle;
        this._id = id;
        this._handleDeleteClick = handleDeleteClick;
        this._handleBaseCostButton = handleBaseCostButton;
        this._handleRemoveMarkup = handleRemoveMarkup;

        this._baseCost = null;
        this._markupCost = null;

        this._count = 1
        this._formIsValid = false;
    }

    _checkRangeIntersection(arr) {
        for (let i = 0; i < arr.length; i++) {
            const current = arr[i];
            for (let j = i + 1; j < arr.length; j++) {
                const compare = arr[j];
                if (
                    (current.min >= compare.min && current.min <= compare.max) ||
                    (current.max >= compare.min && current.max <= compare.max)
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    _showPopup() {
        this._popup = document.querySelector('.section-popup');

        this._popup.style.display = 'block';
        setTimeout(() => {
            this._popup.style.display = 'none';
        }, 2000)
    }

    _checkFormValid = () => {
        const textsError = this.view.querySelectorAll('.error');
        const inputsError = this.view.querySelectorAll('.input-error');
        const configuredTariffZonesError = this.view.querySelector('.configured-tariff-zones__error');
        const countsInput = this.view.querySelectorAll('.count-input');
        const inputBaseCost = this.view.querySelector('.configured-tariff-zones__input-base-cost');

        const data = {
            texts: textsError,
            inputs: inputsError
        }

        let range = []
        let isError = false;

        for (let i = 0; i < countsInput.length; i = i + 2) {
            range.push({ min: Number(countsInput[i].value), max: Number(countsInput[i + 1].value) })
        }

        const isErrorRange = this._checkRangeIntersection(range)

        if (isErrorRange) {
            isError = true
            configuredTariffZonesError.style.display = 'inline'
        } else {
            configuredTariffZonesError.style.display = 'none'
        }

        for (let i = 0; i < data.inputs.length; i++) {
            const text = data.texts[i];

            if (!data.inputs[i].value) {
                text.style.display = 'inline'
                isError = true
            } else {
                isError = false
                text.style.display = 'none'
            }
        }

        if (!inputBaseCost.value) {
            isError = true
        }

        if (!isError) {
            this._showPopup();
            this._formIsValid = true;
        } else {
            this._formIsValid = false
        }
    }

    createResObj() {
        if (this._formIsValid) {
            return {
                'rate_area_id': this._id,
                'base_charge_value': this.view.querySelector('.configured-tariff-zones__input').value,
                'extra_charges': [

                ]
            }
        }
        return null
    }

    _changeBaseCost = (e) => {
        this._baseCost = Number(e.target.value)
        this.view.querySelector('.configured-tariff-zones__result').textContent = `Итоговая стоимость: ${this._baseCost + this._markupCost} P`
    }

    _changeMarkupCost = (e) => {
        this._markupCost = Number(e.target.value)
        this.view.querySelector('.configured-tariff-zones__result').textContent = `Итоговая стоимость: ${this._baseCost + this._markupCost} P`
    }

    removeElement = () => {
        this.view.remove();
    }

    addMarkup = () => {
        const segment = this._template.content.cloneNode(true).querySelector('.segment');
        const paragraph = document.createElement("p");
        const button = segment.querySelector('.remove-markup');
        const costMarkup = segment.querySelector('.input-markup-cost');

        costMarkup.classList.add(`segment__id-${this._count}-input`);
        segment.classList.add(`segment__id-${this._count}-div`)
        paragraph.classList.add("p", "configured-tariff-zones__result", `segment__id-${this._count}-p`)
        button.classList.add(`segment__id-${this._count}-button`)

        this.view.append(segment)
        this.view.append(paragraph)

        costMarkup.addEventListener('change', (e) => {
            paragraph.textContent = `Итоговая стоимость: ${this._baseCost + Number(e.target.value)} P`
        })

        this.view.querySelector('.configured-tariff-zones__input-base-cost').addEventListener('change', () => {
            paragraph.textContent = `Итоговая стоимость: ${this._baseCost + Number(costMarkup.value)} P`
        })

        button.addEventListener('click', () => {
            segment.remove()
            paragraph.remove()
        })

        this._count++
    }

    removeMarkup = () => {
        this.view.querySelector('.segment').remove()
        this.view.querySelector('.configured-tariff-zones__result').remove()
    }

    _setListener = () => {
        this.view.querySelector('.remove-markup').addEventListener('click', this._handleRemoveMarkup)
        this.view.querySelector('.base-cost-button').addEventListener('click', this._handleBaseCostButton);
        this.view.querySelector('.configured-tariff-zones__del').addEventListener('click', this._handleDeleteClick);

        this.view.querySelector('.configured-tariff-zones__input-base-cost').addEventListener('change', this._changeBaseCost)
        this.view.querySelector('.input-markup-cost').addEventListener('change', this._changeMarkupCost);

        document.querySelector('.save').addEventListener('click', this._checkFormValid);
    }

    createElement() {
        this.view = this._template.content.cloneNode(true).querySelector('.element');
        this.view.querySelector('.configured-tariff-zones__name').textContent = this._elementTitle;

        this._setListener();

        return this.view;
    }
}