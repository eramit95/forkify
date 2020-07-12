export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResultList: document.querySelector('.results__list'),
    results: document.querySelector('.results')

}

const elementStrings = {
    loader: 'loader'
}

export const loader = (parent) => {
    const markup = `
    <div class="${elementStrings.loader}">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>
    `;

    parent.insertAdjacentHTML('afterbegin', markup);
}

export const removeLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    loader && loader.parentNode.removeChild(loader);
}

export const ELLIPSIS_CHARS = 17