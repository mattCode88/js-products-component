import ciao from "./filters.js";

class MainProducts extends HTMLElement{

    constructor() {
        super()

        this.dataBase = 'src/database/database.json';
        this.currentPage = 1;
        this.recordForPage = 5;
        this.ciao = ciao;

        this.nextButton = document.getElementById('next-btn');
        this.prevButton = document.getElementById('prev-btn');
        this.cardList = document.getElementById('card-list');
        this.contPage = document.getElementById('cont-page');
        this.buttonList = document.getElementsByClassName('button-page');

        this.nextButton.addEventListener('click', this.nextFn);
        this.prevButton.addEventListener('click', this.prevFn);

        this.innerProduct(this.currentPage);
        this.addButtonPage();
        this.expandEvent();
        this.changeButtonPage();
        this.ciao()
        
    }

    /*FUNZIONE ASINCRONA:
    mi permette di prendere i dati dal foglio json in modo asincrono */
    async getToDb(dataBase) {
        let ris = await fetch(dataBase);
        let risToArray = ris.json();
        return risToArray;
    };
    
    /*AVANTI DI UNA PAGINA:
    tramite questa funzione aggiungo 1 al puntatore della pagina corrente e attivo la funzione innerProduct()*/
    nextFn = () => {
        this.getToDb(this.dataBase).then(ris => {
            let datiJson = ris;
            if (this.currentPage < Math.ceil(datiJson.length / this.recordForPage)) {
                this.buttonList[this.currentPage - 1].classList.remove('bg-color-black');
                this.currentPage++;
                this.buttonList[this.currentPage - 1].classList.add('bg-color-black');
            };
            this.innerProduct(this.currentPage);
        });
    };

    /*INDIETRO DI UNA PAGINA:
    tramite questa funzione sottraggo 1 al puntatore della pagina corrente e attivo la funzione innerProduct() */
    prevFn = () => {
        if (this.currentPage > 1) {
            this.buttonList[this.currentPage - 1].classList.remove('bg-color-black');
            this.currentPage--;
        };
        this.innerProduct(this.currentPage);  
        this.buttonList[this.currentPage - 1].classList.add('bg-color-black');
    };

    /*CAMBIO COLORI BOTTONI:
    cambia i colori dei bottoni next e prev, in base al puntatore currentPage, la richiamo in innerProduct()  */
    changeColorButtonNextPrev = (datiJson) => {
        if (this.currentPage === 1) {
            this.prevButton.classList.add('color-crimson');
            this.nextButton.classList.add('color-seagreen');
            this.nextButton.classList.remove('color-crimson');
        } else if (this.currentPage === Math.ceil(datiJson.length / this.recordForPage)) {
            this.prevButton.classList.remove('color-crimson');
            this.nextButton.classList.remove('color-seagreen');
            this.nextButton.classList.add('color-crimson');
            this.prevButton.classList.add('color-seagreen');
        } else {
            this.prevButton.classList.remove('color-crimson');
            this.prevButton.classList.add('color-seagreen');
            this.nextButton.classList.remove('color-crimson');
            this.nextButton.classList.add('color-seagreen');
        };
    };

    /*AGGIUNGO SELETTORI PAGINA:
    creo dei pallini che identificano le varie pagine */
    addButtonPage = () => {
        this.getToDb(this.dataBase).then(ris => {
            let page = Math.ceil(ris.length / this.recordForPage);
            // this.contPage.innerHTML = '';
            for (let i = 0; i < page; i++) {
                let buttonPage = document.createElement('SPAN');
                buttonPage.classList.add('button-page');
                buttonPage.setAttribute('data-count', i + 1);
                this.contPage.appendChild(buttonPage);
            };
            let buttonList = document.getElementsByClassName('button-page');
            buttonList[0].classList.add('bg-color-black');
        });
    };

    /*CAMBIO PUNTATORE PAGINA:
    in base ai bottoni pagine cliccati cambio il colore dei bottoni e attivo innerProduct() per cambiare pagina */
    changeButtonPage = () => {
        this.contPage.addEventListener('click', e => {
            if (e.target.tagName === 'SPAN') {
                this.buttonList[this.currentPage - 1].classList.remove('bg-color-black');
                e.target.classList.add('bg-color-black')
                this.currentPage = Number(e.target.dataset.count);
                this.innerProduct(this.currentPage);
            };
        });
    };

    /*INSERISCO I PRODOTTI IN PAGINA:
    in base alla pagina corrente inserisco i 5 prodotti da visualizzare in pagina */
    innerProduct = (page) => {
        this.cardList.innerHTML = '';
        this.getToDb(this.dataBase).then(ris => {
            let datiJson = ris;
            for (let i = (page - 1) * this.recordForPage;
                i < page * this.recordForPage && i < datiJson.length;
                i++) {
                this.createCard(datiJson[i], i);
            };
            this.changeColorButtonNextPrev(datiJson);
        });
    };

    /*CREO CARD PRODOTTI:
    creo gli elementi html con le specifiche dei prodotti da inserire in pagina */
    createCard = (element, index) => {

        let card = document.createElement('LI'),
            visible = document.createElement('DIV'),
            notVisible = document.createElement('DIV'),
            cardName = document.createElement('SPAN'),
            price = document.createElement('SPAN'),
            expandIcon = document.createElement('I'),
            imageProduct = document.createElement('IMG'),
            containerTypeAndDescription = document.createElement('DIV'),
            containerType = document.createElement('DIV'),
            containerDescription = document.createElement('DIV'),
            titleType = document.createElement('SPAN'),
            titleDescription = document.createElement('SPAN'),
            type = document.createElement('SPAN'),
            description = document.createElement('SPAN');

        // VISIBLE----------------------------------------------------------------------------------------------------
        expandIcon.setAttribute('class', 'fa-solid fa-expand');
        expandIcon.setAttribute('data-count', this.setCountElement(index));
        cardName.appendChild(document.createTextNode(element.title));
        price.appendChild(document.createTextNode(`${element.price} Euro`));
        price.classList.add('price');

        visible.setAttribute('class', 'visible');
        visible.appendChild(expandIcon);
        visible.appendChild(cardName);
        if (element.originalPrice != '') {
            let priceOriginal = document.createElement('SPAN'),
                sale = document.createElement('SPAN');
            priceOriginal.appendChild(document.createTextNode(element.originalPrice));
            priceOriginal.classList.add('original-price');
            sale.appendChild(document.createTextNode(`Sale ${this.calculationSale(element)}%`));
            sale.classList.add('sale');
            visible.appendChild(priceOriginal);
            visible.appendChild(sale);
        };
        visible.appendChild(price);

        // NOT VISIBLE----------------------------------------------------------------------------------------------------
        imageProduct.setAttribute('src', element.image);
        imageProduct.setAttribute('class', 'size-image');
        imageProduct.classList.add('class', 'fl');

        titleType.appendChild(document.createTextNode('Tipo: '));
        titleType.classList.add('color-lightgreen');
        titleDescription.appendChild(document.createTextNode('Descrizione: '));
        titleDescription.classList.add('color-lightgreen');

        type.appendChild(document.createTextNode(element.type));
        description.appendChild(document.createTextNode(element.description));
 
        containerType.appendChild(titleType);
        containerType.appendChild(type);

        containerDescription.appendChild(titleDescription);
        containerDescription.appendChild(description);

        containerTypeAndDescription.appendChild(containerType);
        containerTypeAndDescription.appendChild(containerDescription);
        containerTypeAndDescription.setAttribute('class', 'container-ty-des');

        notVisible.setAttribute('class', 'not-visible');
        notVisible.classList.add('class', 'hide');
        notVisible.appendChild(imageProduct);
        notVisible.appendChild(containerTypeAndDescription);
        // ----------------------------------------------------------------------------------------------------------------
         
        card.appendChild(visible);
        card.appendChild(notVisible);

        this.cardList.appendChild(card);
   
    }

    /*ESPANDO LE SPECIFICHE PRODOTTO:
    al click mostro o nascondo le specifiche del prodotto richiesto*/
    expandEvent = () => {
        this.cardList.addEventListener('click', (e) => {
            if (e.target.tagName === 'I') {
                let index = Number(e.target.dataset.count);
                if (this.cardList.children[index].lastChild.classList.contains('hide')) {
                    this.cardList.children[index].lastChild.classList.remove('hide')
                    e.target.classList.remove('fa-expand');
                    e.target.classList.add('fa-xmark');
                } else {
                    this.cardList.children[index].lastChild.classList.add('hide');
                    e.target.classList.remove('fa-xmark');
                    e.target.classList.add('fa-expand');
                };
            };
        });
    };

    /*SETTO INDICI DI DATASET DEI TAG I:
    funzione che richiamo in createCard() per settare il dataset in base alla pagina in cui mi trovo*/
    setCountElement = (index) => {
        if (index < this.recordForPage) {
            return index;
        } else {
            return index - ((this.currentPage - 1) * this.recordForPage);
        };
    };

    /*CALCOLO LA PERCENTUALE DI SCONTO:
    funzione che richiamo in createCard() */
    calculationSale = (element) => {
        return Math.round(100 - (element.price * 100 / element.originalPrice));
    };
};

export default MainProducts;

