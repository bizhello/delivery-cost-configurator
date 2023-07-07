export class FindZone {
    constructor(input, button, handleButton, tariffZones, openTariffZones) {
        this.input = input;
        this.button = button;
        this.handleButton = handleButton;
        this.tariffZones = tariffZones;
        this.openTariffZones = openTariffZones;
        
        this.timeoutId = null;
    }

    setListener() {
        this.button.addEventListener('click', this.handleButton);
        this.input.addEventListener('input', this.searchAreas.bind(this));
    }

    searchAreas() {
        this.openTariffZones();
        clearTimeout(this.timeoutId);

        this.timeoutId = setTimeout(() => {
            const searchValue = this.input.value.toLowerCase();
            this.tariffZones.forEach(tariffZone => {
                const nameTariffZone = tariffZone.textContent.toLowerCase();
                tariffZone.style.display = nameTariffZone.includes(searchValue) ? 'flex' : 'none';
            });
        }, 1000);
    }
}