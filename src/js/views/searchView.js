import { elements, ELLIPSIS_CHARS } from './base';

export const getSearchInput = () => elements.searchInput.value;

export const clearSearchInput = () => {
    elements.searchInput.value = '';
}

export const clearResult = () => {
    elements.searchResultList.innerHTML = '';
}

// If length is greater than ELLIPSIS_CHARS then show ellipsis 
const ellipsisCreator = (token) => {
    if (token.length <= ELLIPSIS_CHARS) {
        return token;
    }
    const tempArr = [];
    token.split(' ').reduce((acc, element) => {
        debugger;
        if (acc + element.length <= ELLIPSIS_CHARS) {
            tempArr.push(element);
            return acc + element.length;
        }
    }, 0);

    tempArr.push('...')

    return tempArr.join(' ');
};

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

export const renderResults = recipes => {
    recipes.forEach(renderRecipe);
}
