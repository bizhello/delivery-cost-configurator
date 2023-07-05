export class ConfigureTarifZone {
    constructor(id, title, removeForm) {
        this.template = document.querySelector('.template');
        this.templateMarkup = document.querySelector('.template-markup');

        this.id = id;
        this.title = title;
        this.removeForm = removeForm;

        this._currencyReg = /^[-+]?[0-9]+(\.[0-9]{2})?$/;
        this._weightReg = /^[0-9]+(\.[0-9]{3})?$/;

        this._removeElement = this._removeElement.bind(this);
        this._formatWeightInput = this._formatWeightInput.bind(this);
        this._formatCurrencyInput = this._formatCurrencyInput.bind(this);
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
        inputValue = inputValue.replace(/[-+]/g, (match, offset) => (offset === 0 ? match : ''));
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

    _setListener() {
        this.view.querySelector('.configured-tariff-zones__del').addEventListener('click', this._removeElement);
        const weightInputs = this.view.querySelectorAll('.weight-input');
        const costInputs = this.view.querySelectorAll('.cost-input');
        weightInputs.forEach(input => {
            input.addEventListener('input', this._formatWeightInput);
            input.addEventListener('input', (event) => {
                const isValid = this._validateInput(event.target.value, this._weightReg);
                if (!isValid) {
                    event.target.classList.add('invalid');
                } else {
                    event.target.classList.remove('invalid');
                }
            });
        });
        costInputs.forEach(input => {
            input.addEventListener('input', this._formatCurrencyInput);
            input.addEventListener('input', (event) => {
                const isValid = this._validateInput(event.target.value, this._currencyReg);
                if (!isValid) {
                    event.target.classList.add('invalid');
                } else {
                    event.target.classList.remove('invalid');
                }
            });
        });
    }

    createElement() {
        this.view = this.template.content.cloneNode(true).querySelector('.template__article');
        this.view.id = `template__article-${this.id}`
        this.view.querySelector('.configured-tariff-zones__name').textContent = this.title;

        this._setListener();

        return this.view;
    }

    _addMarkup() {
        this.view = this.template.content.cloneNode(true).querySelector('.segment');
        this.view.id = `template__article-${this.id}`
        this.view.querySelector('.configured-tariff-zones__name').textContent = this.title;

        this._setListener();

        return this.view;
    }

    _removeMarkup() {

    }
}
