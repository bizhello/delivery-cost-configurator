export class ConfiguredTariffZone {
    constructor(template, elementTitle, id, handleDeleteClick, handleBaseCostButton, handleRemoveMarkup) {
        this._template = template;
        this._elementTitle = elementTitle;
        this._id = id;
        this._handleDeleteClick = handleDeleteClick;
        this._handleBaseCostButton = handleBaseCostButton;
        this._handleRemoveMarkup = handleRemoveMarkup;

        // this._baseShippingCost = 
        // this._elementPhoto = elementPhoto;
        // this._handleCardClick = handleCardClick;
        // this._numberLikes = numberLikes;
        // this._likes = likes;
        // this._handleLikeCard = handleLikeCard;
        // this._profileId = profileId
        this._count = 0
    }

    removeElement = () => {
        this.view.remove();
        this.view = null;
    }

    addMarkup = () => {
        this.newSegment = this._template.content.cloneNode(true).querySelector('.segment');
        this.paragraph = document.createElement("p");
        this.view.append(this.newSegment)
        this.view.append(this.paragraph)
        this.newSegment.querySelector('.remove-markup').addEventListener('click', () => {
            console.log('newSegment: ', this.newSegment)
            // this.paragraph.remove()
            // this.newSegment.remove()
        })
    }

    removeMarkup = () => {
        this.view.querySelector('.segment').remove()
        this.view.querySelector('.configured-tariff-zones__result').remove()
    }

    _setListener = () => {
        this.view.querySelector('.remove-markup').addEventListener('click', this._handleRemoveMarkup)
        this.view.querySelector('.base-cost-input').addEventListener('click', this._handleBaseCostButton);
        this.view.querySelector('.configured-tariff-zones__del').addEventListener('click', this._handleDeleteClick);
    }

    createElement() {
        this.view = this._template.content.cloneNode(true).querySelector('.element');
        this.view.querySelector('.configured-tariff-zones__name').textContent = this._elementTitle;
        this._setListener();

        return this.view;
    }
}