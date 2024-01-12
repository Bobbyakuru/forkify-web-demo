import { async } from 'regenerator-runtime';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import reciepeView from './views/reciepeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if(module.hot) {
//   module.hot.accept();
// }

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

/////////////////////////////////////////////////////////////////////////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    reciepeView.renderSpinner();

    // (0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // (1) Loading recipe 
    await model.loadRecipe(id);

    // (2) Rendering recipe
    reciepeView.render(model.state.recipe);
  } catch (err) {
    reciepeView.renderError();

  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // (1)  Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // (2) Load search results
    await model.loadSearchReasults(query);

    //(3) Render results
    // resultView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // (4) Render the initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlpagination = function (goToPage) {
  //(1) Render New results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // (2) Render New pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  reciepeView.update(model.state.recipe)

};

const controlAddBookmark = function () {
  //(1) Add / remove bookmark
  if (!model.state.recipe.bookmarked)
    model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);

  // (2) Update recipe view
  reciepeView.update(model.state.recipe);

  //(3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the newRecipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe 
    reciepeView.render(model.state.recipe);

    // Success message 
    addRecipeView.renderMessage();


    // Render bookmark view 
    bookmarksView.render(model.state.bookmarks);

    // change ID in URL
    // the pushState allows us change d URL without reloading the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

  } catch (err) {
    console.log('🔥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  reciepeView.addHandlerRender(controlRecipes);
  reciepeView.addHandlerUpdateServings(controlServings);
  reciepeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHanderClick(controlpagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init(); 
