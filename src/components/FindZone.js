export class FindZone {
    constructor(input, button, ul) {
        this.input = input;
        this.button = button;
        this.ul = ul;
        this.lis = ul.querySelectorAll('.search-tariff-zone__list');

        this._timeoutId = null;

        this.toggleDisplayUl = this.toggleDisplayUl.bind(this);
        this.filterAreas = this.filterAreas.bind(this)
    }

    _openDiplayUl() {
        this.ul.style.display = 'block';
    }
    _closeDiplayUl() {
        this.ul.style.display = 'none';
    }

    toggleDisplayUl() {
        if (this.ul.style.display === 'none') {
            this._openDiplayUl()
        } else {
            this._closeDiplayUl()
        }
    }

    filterAreas() {
        this._openDiplayUl()
        clearTimeout(this._timeoutId)
        this._timeoutId = setTimeout(() => {
            for (let i = 0; i < this.lis.length; i++) {
                const li = this.lis[i];
                const text = li.textContent.toLowerCase();
                if (text.includes(this.input.value.toLowerCase())) {
                    li.style.display = 'flex';
                } else {
                    li.style.display = 'none';
                }
            }
        }, 1000)
    }

    setEventListeners() {
        this._closeDiplayUl()
        this.input.addEventListener('input', this.filterAreas)
        this.button.addEventListener('click', this.toggleDisplayUl)
    }
}