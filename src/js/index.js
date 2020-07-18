// Global app controller
import { elements, loader, removeLoader } from "./views/base";

import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";

import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  const query = searchView.getSearchInput() || "pizza";

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
};

elements.searchForm.addEventListener("submit", (_event) => {
  _event.preventDefault();
  controlSearch();
});

elements.pagination.addEventListener("click", (_event) => {
  const button = _event.target.closest(".btn-inline");
  if (!button) {
    return;
  }

  const gotoPage = +button.dataset.goto;
  searchView.renderResults(state.search.result, gotoPage);
});

/**
 * Recipe Controller
 */
const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");

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
  recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
};

/**
 * List Controller
 */
const controlList = () => {
  // Create a new list, if there is none yet
  if (!state.list) {
    state.list = new List();
  }

  // Add new ingredient to the list
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

// Handle delete and update list item events
elements.shoppingList.addEventListener('click', el =>{
    const id = el.target.closest('.shopping__item').dataset.itemid;

    // Handle delete
    if (el.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (el.target.matches('.shopping__count-value')) {
        const val = parseFloat(el.target.value);
        state.list.updateCount(id, val);
    }
});


["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

window.addEventListener('load', () => {
  state.likes = new Likes();
  state.likes.readStorage();
  likesView.toggleLikeMenu(state.likes.likes.length);
  if (state.likes.likes) {
    state.likes.likes.forEach(like => likesView.renderLike(like));
  }
});

/**
 * Likes Controller
 */
 const controlLike = () => {
  if(!state.likes) {
    state.likes = new Likes();
  }

  const currentId = state.recipe.id;

  // User has not liked current recipe
  if (!state.likes.isLiked(currentId)) {
    const like = state.likes.addLike(currentId, state.recipe.title, state.recipe.author, state.recipe.img)
    likesView.toggleLikeBtn(true);
    likesView.renderLike(like);
  } else {
    // User already liked current recipe
    state.likes.deleteLike(currentId);
    likesView.toggleLikeBtn(false);
    likesView.deleteLike(currentId);
  }

  likesView.toggleLikeMenu(state.likes.likes.length);
 }

// Handling recipe button clicks
elements.recipe.addEventListener("click", (element) => {
  if (element.target.matches(".btn-decrease, .btn-decrease *")) {
    if (state.recipe.servings < 1) {
      return;
    }
    state.recipe.updateServings("dec");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (element.target.matches(".btn-increase, .btn-increase *")) {
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (
    element.target.matches(".recipe__button-add, .recipe__button-add *")
  ) {
    controlList();
  } else if (element.target.matches('.recipe__love, .recipe__love *')) {
    controlLike();
  }
});