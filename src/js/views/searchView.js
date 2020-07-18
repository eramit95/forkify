import { elements, ELLIPSIS_CHARS } from './base';

export const getSearchInput = () => elements.searchInput.value;

export const clearSearchInput = () => {
    elements.searchInput.value = '';
}

export const clearResult = () => {
    elements.searchResultList.innerHTML = '';
    elements.pagination.innerHTML = '';
}

// If length is greater than ELLIPSIS_CHARS then show ellipsis 
export const ellipsisCreator = (token) => {
    if (token.length <= ELLIPSIS_CHARS) {
        return token;
    }
    const tempArr = [];
    token.split(' ').reduce((acc, element) => {
        if (acc + element.length <= ELLIPSIS_CHARS) {
            tempArr.push(element);
            return acc + element.length;
        }
    }, 0);

    tempArr.push('...')

    return tempArr.join(' ');
};

export const highlightSelected = id => {
    if (!document.querySelector(`.results__link[href*="#${id}"]`)) {
        return
    };
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active')
}

/**
image_url: "http://forkify-api.herokuapp.com/images/best_pizza_dough_recipe1b20.jpg"
publisher: "101 Cookbooks"
publisher_url: "http://www.101cookbooks.com"
recipe_id: "47746"
social_rank: 100
source_url: "http://www.101cookbooks.com/archives/001199.html"
title: "Best Pizza Dough Ever"
**/
const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${ellipsisCreator(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;

    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
}

const createButton = (pageNumber, type) => {
    const goToPage = type === 'prev' ? pageNumber - 1 : pageNumber + 1;
    return `
        <button class="btn-inline results__btn--${type}" data-goto=${goToPage}>
            <span>Page ${goToPage}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
        </button>
    `;
}

const renderButtons = (pageNumber, numberOfPages) => {

    // Pagination is required if number of pages > 1
    if (numberOfPages <= 1) {
        return;
    }

    let button;

    if (pageNumber === 1) {
        button = createButton(pageNumber, 'next');
    } else if (pageNumber == numberOfPages) {
        button = createButton(pageNumber, 'prev');
    } else {
        button = `
            ${createButton(pageNumber, 'prev')}
            ${createButton(pageNumber, 'next')}
        `
    }

    elements.pagination.insertAdjacentHTML('afterbegin', button);
}

export const renderResults = (recipes = [], page = 1, pageSize = 10) => {
    clearResult();
    const pageStart = (page - 1) * pageSize;
    const pageEnd = (page) * pageSize;

    const numberOfPages = Math.ceil(recipes.length / pageSize);
    recipes.slice(pageStart, pageEnd).forEach(renderRecipe);
    renderButtons(page, numberOfPages);
}

