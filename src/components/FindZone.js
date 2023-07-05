export class FindZone {
    constructor(input, button, handleButton, tarifZones, openTarifZones) {
        this.input = input;
        this.button = button;
        this.handleButton = handleButton;
        this.tarifZones = tarifZones;
        this.openTarifZones = openTarifZones;
        
        this.timeoutId = null;
    }

    setListener() {
        this.button.addEventListener('click', this.handleButton);
        this.input.addEventListener('input', this.searchAreas.bind(this));
    }

    searchAreas() {
        this.openTarifZones();
        clearTimeout(this.timeoutId);

        this.timeoutId = setTimeout(() => {
            const searchValue = this.input.value.toLowerCase();
            this.tarifZones.forEach(tarifZone => {
                const nameTarifZone = tarifZone.textContent.toLowerCase();
                tarifZone.style.display = nameTarifZone.includes(searchValue) ? 'flex' : 'none';
            });
        }, 1000);
    }
}