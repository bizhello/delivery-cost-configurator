export class InputValidator {
    constructor(inputField, isCurrency = false) {
      this.inputField = inputField;
      this.isCurrency = isCurrency;
      this.allowedCharacters = this.isCurrency ? /^[-+]?[0-9]+(\.[0-9]{2})?$/ : /^[0-9]+(\.[0-9]{3})?$/;
      this.attachEventListeners();
    }
  
    attachEventListeners() {
      this.inputField.addEventListener('input', this.handleInput.bind(this));
    }

    handleInput(e) {
      const inputValue = e.target.value;
      const  newInputValue = this.isCurrency ? this.formatCurrencyInput(inputValue) : this.formatWeightInput(inputValue);
      this.inputField.value = newInputValue;
    }
  
    formatWeightInput(inputValue) {
      // Удаляем все символы, кроме цифр и точки
      inputValue = inputValue.replace(/[^0-9.]/g, '');
      // Удаляем все точки, кроме последней
      inputValue = inputValue.replace(/\.+/g, '.');
      // Ограничиваем количество символов после точки до трех
      const decimalIndex = inputValue.indexOf('.');
      if (decimalIndex !== -1) {
        const decimalPart = inputValue.substring(decimalIndex + 1);
        if (decimalPart.length > 3) {
          inputValue = inputValue.substring(0, decimalIndex + 4);
        }
      }
      return inputValue;
    }
  
    formatCurrencyInput(inputValue) {
      // Удаляем все символы, кроме цифр, точки и знаков "+", "-"
      inputValue = inputValue.replace(/[^0-9.\-+]/g, '');
      // Удаляем все точки, кроме последней
      inputValue = inputValue.replace(/\.+/g, '.');
      // Удаляем все знаки "+", "-" кроме первого
      inputValue = inputValue.replace(/[-+]/g, (match, offset) => (offset === 0 ? match : ''));
      // Ограничиваем количество символов после точки до двух
      const decimalIndex = inputValue.indexOf('.');
      if (decimalIndex !== -1) {
        const decimalPart = inputValue.substring(decimalIndex + 1);
        if (decimalPart.length > 2) {
          inputValue = inputValue.substring(0, decimalIndex + 3);
        }
      }
      return inputValue;
    }
  }
  