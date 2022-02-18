import Filters from "./filters.js";

export default class PriceRange extends Filters{
    constructor() {
        super();

        this.filterRight = document.getElementById('filter-right')
        this.containerPrice = document.getElementById('container-price');
        this.inputRange = document.querySelectorAll('#range-input input');
        this.inputImport = document.querySelectorAll('.input-import');
        this.progress = document.getElementById('slider-progress');
        this.search = document.getElementById('search');

        this.filterRight.addEventListener('click', this.expandPrice);
        this.search.addEventListener('click', this.searchForPrice);

        this.setRangeMinMax();
        this.selectRangeSlider();
        this.selectPriceInput();
    };

    /*ESPANDO PREZZI:
    quando clicco su prezzo mostro/nascondo sottomenù */
    expandPrice = (e) => {
        if (e.target.textContent === 'PREZZO' || e.target.classList.contains('fa-angle-down')) {
            if (this.containerPrice.classList.contains('hide')) {
                this.containerPrice.classList.remove('hide');
            } else {
                this.containerPrice.classList.add('hide');
            };
        };
        this.containerCategories.classList.add('hide');
    };

    /*FUNZIONE SORT:
    mi permette di riordinare il database in base al parametro price */
    sortProduct = (a, b) => {
        if (a.price < b.price) {
            return -1;
        } else if (a.price > b.price) {
            return 1;
        } else {
            return 0;
        };
    };

    /*SETTO VALORI:
    setto value, max e min degli input in base ai prezzi presenti nel database */
    setRangeMinMax = () => {
        this.getToDb(this.dataBase).then(ris => {
            let arrayProductSort = ris.sort(this.sortProduct);
            let minPrice = arrayProductSort[0].price;
            let maxPrice = arrayProductSort[arrayProductSort.length - 1].price;

            this.inputRange[0].min = Math.floor(minPrice);
            this.inputRange[0].max = Math.ceil(maxPrice);
            this.inputRange[0].value = minPrice;

            this.inputRange[1].min = Math.floor(minPrice);
            this.inputRange[1].max = Math.ceil(maxPrice);
            this.inputRange[1].value = maxPrice;

            this.inputImport[0].value = Math.floor(minPrice);
            this.inputImport[1].value = Math.ceil(maxPrice);
        });
    };

    /*SELEZIONO PREZZI DA SLIDER:
    // in base alla posizione dello slider stabilisco il range di prezzi e lo mostro nell input */
    selectRangeSlider = () => {
        let minVal, maxVal, priceGap = 50;
        this.inputRange.forEach(element => {
            element.addEventListener('input', e => {
                minVal = Number(this.inputRange[0].value);
                maxVal = Number(this.inputRange[1].value);
                if (maxVal - minVal < priceGap) {
                    if (e.target.className === 'range-min') {
                        this.inputRange[0].value = maxVal - priceGap;
                    } else {
                        this.inputRange[1].value = minVal + priceGap;
                    };
                } else {
                    this.inputImport[0].value = minVal;
                    this.inputImport[1].value = maxVal;
                    this.progress.style.left = (minVal / this.inputRange[0].max) * 100 + '%';
                    this.progress.style.right = 100 - (maxVal / this.inputRange[1].max) * 100 + '%';
                };
            });
        });
    };

    /*SELEZIONO PREZZI DA INPUT:
    in base ai prezzi definiti negli input setto la posizione dello slider */
    selectPriceInput = () => {
        let minVal, maxVal, priceGap = 50;
        this.inputImport.forEach(element => {
            element.addEventListener('input', e => {
                minVal = Number(this.inputImport[0].value);
                maxVal = Number(this.inputImport[1].value);
                if (maxVal - minVal >= priceGap) {
                    if (e.target.classList.contains('input-import-min')) {
                        this.inputRange[0].value = minVal;
                        this.progress.style.left = (minVal / this.inputRange[0].max) * 100 + '%';
                    } else {
                        this.inputRange[1].value = maxVal;
                        this.progress.style.right = 100 - (maxVal / this.inputRange[1].max) * 100 + '%';
                    };
                };
            });
        });
    };

    /*RICERCA PER PREZZO:
    in base al range prezzi stabilito e alle categorie richieste filtro il database e ritorno gli elementi richiesti */
    searchForPrice = e => {
        this.containerPrice.classList.add('hide');
        this.minPrice = Number(this.inputImport[0].value);
        this.maxPrice = Number(this.inputImport[1].value);
        Math.floor(this.inputRange[0].min) == this.minPrice && Math.ceil(this.inputRange[0].max) == this.maxPrice ?
            this.price = false :
            this.price = true;
        this.currentPage = 1;
        let newDatabase;
        this.getToDb(this.dataBase).then(ris => {
            if (!this.filter) {
                newDatabase = ris.filter(element => {
                    return element.price >= this.minPrice && element.price <= this.maxPrice;
                });
            };
            if (this.filter) {
                newDatabase = ris.filter(element => {
                    if (element.type === this.chooseCategorie) {
                        return element.price >= this.minPrice && element.price <= this.maxPrice;
                    };
                });
            };
            this.cardList.innerHTML = '';
            this.addButtonPage(newDatabase);
            this.innerProduct(this.currentPage, newDatabase);
            this.changeColorButtonNextPrev(newDatabase);
            this.changeButtonPage(newDatabase);
        });
    };
};