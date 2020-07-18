// Global app controller
import { elements, loader, removeLoader } from './views/base';

import Search from './models/Search';
import Recipe from './models/Recipe';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {

}

/** 
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    const query = searchView.getSearchInput() || 'pizza';

    if (query) {

        loader(elements.results);
        // Updating search object
        const search = new Search(query);

        state.search = search;
  
        searchView.clearSearchInput();
        searchView.clearResult();

        await search.getResults();

        removeLoader();

        searchView.renderResults(search.result);
    }
}

elements.searchForm.addEventListener('submit', _event => {
    _event.preventDefault();
    controlSearch();
});

elements.pagination.addEventListener('click', _event => {
    const button = _event.target.closest('.btn-inline');
    if (!button) {
        return;
    }

    const gotoPage = +button.dataset.goto;
    searchView.renderResults(state.search.result, gotoPage);
})

/**
 * Recipe Controller
 */
 const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    
    if (!id) {
        return;
    }

    searchView.highlightSelected(id);

    recipeView.clearResult();
    loader(elements.recipe);

    const recipe = new Recipe(id);
    state.recipe = recipe;

    await recipe.getRecipe();
    
    recipe.parseIngredients();

    state.recipe.calcTime();
    state.recipe.calcServings();

    removeLoader();
    recipeView.renderRecipe(state.recipe);
 }

 ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

 // Handling recipe button clicks
 elements.recipe.addEventListener('click', element => {
     if (element.target.matches('.btn-decrease, .btn-decrease *')) {
         if (state.recipe.servings < 1) {
             return;
         }
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
     } else if(element.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
     }
 })



