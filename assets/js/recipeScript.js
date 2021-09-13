const API_KEY = "66f53e7e0ca942c9806998c27a0847af"

//loads previous searches saved in localStorage
function loadSavedRecipes() {
    document.getElementById("recentSearches").innerHTML = JSON.parse(window.localStorage.getItem("SavedRecipes")) ?? "";
}

//saves the passed recipe to localStorage
function saveRecipe(title, id) {
    var savedRecipes = JSON.parse(window.localStorage.getItem("SavedRecipes")) ?? "";
    savedRecipes = `<button onclick="getRecipeSaved(${id})">${title}</button><br>`+savedRecipes;
    window.localStorage.setItem("SavedRecipes", JSON.stringify(savedRecipes));
}

//clears the saved recipes in localStorage
function clearSavedRecipes() {
    window.localStorage.setItem("SavedRecipes", JSON.stringify(""));
    loadSavedRecipes();
}

//sets the displayed recipe to the recipe with the passed id as well as saves it in localStorage
function setSaveRecipe(id) {
    $.ajax({
        url:`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`,
        success: function(res) {
            document.getElementById("title").innerHTML=`<h1>${res.title}</h1>`

            if (res.servings == 1) {
                document.getElementById("servings").innerHTML = `${res.servings} Serving`
            }
            else {
                document.getElementById("servings").innerHTML = "1 Serving"
            }

            var ingredients = res.extendedIngredients
            var ingredientsString = ""
            for (i=0; i<ingredients.length; i++) {
                ingredientsString = `${ingredientsString}<a href="./ingredients.html?ingredient_name=${ingredients[i].name}">${ingredients[i].original}</a><br>`
            }
            document.getElementById("ingredients").innerHTML = ingredientsString

            document.getElementById("sourceLink").innerHTML=res.sourceUrl
            document.getElementById("sourceLink").href=res.sourceUrl

            loadSavedRecipes();

            saveRecipe(res.title, id);
        }
    });
}

//sets ElementById("instructions") to the recipe's instructions separated by <br>s
function setInstructions(id) {
    $.ajax({
        url:`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${API_KEY}`,
        success: function(res) {
            var instructions = res
            var instructionsString = ""
            for (i=0; i<instructions.length; i++) {
                if (instructions.length > 1) {
                    instructionsString = instructionsString + "Part " + (i+1) + "<br>"
                }
                for (j=0; j<instructions[i].steps.length; j++) {
                    instructionsString = instructionsString  + instructions[i].steps[j].step + "<br>"
                }
            }
            document.getElementById("instructions").innerHTML = instructionsString
        }
    });
}

//is called by the button to search for one recipe and call other functions to display it
function getRecipeNameSearch() {
    var searchText = document.getElementById("searchText").value
    $.ajax({
        url: `https://api.spoonacular.com/recipes/complexSearch?number=1&query=${searchText}&apiKey=${API_KEY}`,
        success: function(res){
            setSaveRecipe(res.results[0].id);
            setInstructions(res.results[0].id);
        }
    });
}

//is called by the button to search for one recipe by ingredient and call other functions to display it
function getRecipeIngredientSearch() {
    var searchText = document.getElementById("searchText").value
    $.ajax({
        url: `https://api.spoonacular.com/recipes/findByIngredients?number=1&ingredients=${searchText}&apiKey=${API_KEY}`,
        success: function(res){
            setSaveRecipe(res[0].id);
            setInstructions(res[0].id);
        }
    });
}


//is called on load to search for one recipe by ingredient using what comes after # in the url and call other functions to display it
function getRecipeIngredientURL() {
    $.ajax({
        url: `https://api.spoonacular.com/recipes/findByIngredients?number=1&ingredients=${window.location.hash.substr(1)}&apiKey=${API_KEY}`,
        success: function(res){
            setSaveRecipe(res[0].id);
            setInstructions(res[0].id);
        }
    });
}

//is called using to display a recipe from a previous search
function getRecipeSaved(id) {
    setSaveRecipe(id);
    setInstructions(id);
}

//loads button functions and check if a recipe needs to be found based on url
window.onload = function() {
    document.getElementById("nameSearch").addEventListener("click", getRecipeNameSearch);
    document.getElementById("ingredientSearch").addEventListener("click", getRecipeIngredientSearch);
    document.getElementById("searchClear").addEventListener("click", clearSavedRecipes);

    if (location.hash != "") {
        getRecipeIngredientURL();
    }
}