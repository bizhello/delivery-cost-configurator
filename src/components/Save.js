export class Save {
    constructor(handelClick) {
        this.button = document.querySelector('.save');
        this.handelClick = handelClick;
    }

    onEventClick() {
        this.button.addEventListener('click', this.handelClick)
    }
}