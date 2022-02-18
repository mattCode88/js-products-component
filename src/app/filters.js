import Data from "./data.js"

export default class Filters extends Data{
    constructor() {
        super();

        this.filterLeft = document.getElementById('filter-left');
        this.containerCategories = document.getElementById('container-categories');

        this.filterLeft.addEventListener('click', this.expandCategories);

        this.innerCategories();
        this.selectCategorie();
    };

    /*ESPANDO CATEGORIE:
    quando clicco su categorie mostro/nascondo sottomenù */
    expandCategories = () => {
        if (this.containerCategories.classList.contains('hide')) {
            this.containerCategories.classList.remove('hide');
        } else {
            this.containerCategories.classList.add('hide');
        };
        this.containerPrice.classList.add('hide');
    };

    /*AGGIUNGO CATEGORIE:
    in base ai type del database, creo un array delle categorie da passare a createElementsCategories() */
    innerCategories = () => {
        this.getToDb(this.dataBase).then(ris => {
            let arrayCategories = [];
            ris.forEach(element => {
                if (!arrayCategories.includes(element.type)) arrayCategories.push(element.type);
            });
            this.createElementsCategories(arrayCategories)
        });
    };

    /*CREO LISTA CATEGORIE:
    funzione da passare a innerCategories per creare lista */
    createElementsCategories = (array) => {
        let elementCategories = document.createElement('LI');
            elementCategories.appendChild(document.createTextNode('All'));
            this.containerCategories.appendChild(elementCategories);
        array.forEach(element => {
            elementCategories = document.createElement('LI');
            elementCategories.appendChild(document.createTextNode(element));
            this.containerCategories.appendChild(elementCategories);
        });
    };

    /*SELEZIONO CATEGORIA:
    in base alla categoria selezionata e al prezzo selezionato creo e mostro relative voci database */
    selectCategorie = () => {
        this.containerCategories.addEventListener('click', e => {
            if (e.target.tagName === 'LI') {
                this.getToDb(this.dataBase).then(ris => {
                    let newDatabase;
                    if (e.target.textContent === 'All' && !this.price) {
                        this.filter = false;
                        newDatabase = ris;
                    } else if (e.target.textContent !== 'All' && !this.price) {
                        this.filter = true;
                        this.chooseCategorie = e.target.textContent;
                        newDatabase = ris.filter(elem => {
                            return elem.type === this.chooseCategorie;
                        });
                    } else if (e.target.textContent !== 'All' && this.price) {
                        this.filter = true;
                        this.chooseCategorie = e.target.textContent;
                        newDatabase = ris.filter(element => {
                            if (element.type === this.chooseCategorie) {
                                return element.price >= this.minPrice && element.price <= this.maxPrice;
                            };
                        });
                    } else {
                        this.filter = false;
                        newDatabase = ris.filter(element => {
                            return element.price >= this.minPrice && element.price <= this.maxPrice;
                        });
                    };
                    this.currentPage = 1;
                    this.cardList.innerHTML = '';
                    this.addButtonPage(newDatabase);
                    this.innerProduct(this.currentPage, newDatabase);
                    this.changeColorButtonNextPrev(newDatabase);
                    this.changeButtonPage(newDatabase);
                });
            };
        });
    };
};

