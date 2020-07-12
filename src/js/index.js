// Global app controller
import { elements } from './views/base';
import Search from './models/Search'
import * as searchView from './views/searchView';

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
    const query = searchView.getSearchInput();

    if (query) {
        // Updating search object
        const search = new Search(query);

        state.search = search;
  
        searchView.clearSearchInput();
        searchView.clearResult();

        await search.getResults();

        searchView.renderResults(search.result);
    }
}

elements.searchForm.addEventListener('submit', _event => {
    _event.preventDefault();
    controlSearch();
});