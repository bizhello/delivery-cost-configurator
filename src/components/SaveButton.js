export class SaveButton {
    constructor(button, handelClick) {
        this.button = button;
        this.handelClick = handelClick;

        this._buttonClick = this._buttonClick.bind(this);
    }

    _buttonClick() {
        this.handelClick()
    }

    setListener() {
        this.button.addEventListener('click', this._buttonClick);
    }
}