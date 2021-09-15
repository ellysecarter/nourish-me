var nutritionContainerEl = document.querySelector("#ingredient-info-container");
var descriptionEl = document.querySelector("#nutrient-description");
var ingredientNameEl = document.querySelector("#ingredient-name");
var ingredientsArray = [];
var searchOuterEL = document.querySelector("#search-outer-container");
var searchSectionEl = document.querySelector("#ingredients-search");

var searchFormEl = document.querySelector("#search-form");
var ingredientInputEl = document.querySelector("#ingredient");
var recipeLinkEl = document.querySelector("#recipe-link");
var ingredientsButtonsEl = document.querySelector("#recent-searches");
var ingredientName;

var currentTempEl =  document.querySelector("#temp");
var currentWindEl =  document.querySelector("#wind");
var currentHumidityEl =  document.querySelector("#humidity");
var currentUVEl =  document.querySelector("#uv");
var currentCityEl =  document.querySelector("#current-city");
var currentDateEl =  document.querySelector("#current-date");
var currentIconEl =  document.querySelector("#current-weather-icon");

var nutrientsArray  = new Array();

function setIngredientFromURL() {
    var queryString = document.location.search;
    ingredientName = queryString.split("=")[1];

    if (ingredientName){
        getIngredientInfo(ingredientName);
        showSearchSection ();

    }else {
        return;
      }
}


var getIngredientInfo = function(ingredient) {
    var apiUrl = "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=CaaqbdHoAR2KavNuAQFcBRRv7vL4gDF78ENsyxMu&query=" + ingredient + "&dataType=Survey (FNDDS)&pagesize=5";

    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // set the ingredient description text
                descriptionEl.textContent = data.foods[0].description;
                // set the recipe search link for this ingredient

                recipeLinkEl.innerHTML = "<a href='./recipes.html#" + ingredient + "'>" + ingredient.replace("%20", " ") + "</a>";
                //display the nutrients info data
                for (var i = 0; i < data.foods[0].foodNutrients.length; i++){ 
                    //create a new row of nutrient info consisting of nutrient name, amount and unit
                    var nutrientRowEL = document.createElement('div');
                    nutrientRowEL.setAttribute('class', 'row');
                    
                    //create new column for ingredient name
                    var nutrientNameEl = document.createElement('div');
                    nutrientNameEl.setAttribute('class', 'columns medium-6');
                    nutrientNameEl.setAttribute('id', 'nutrient-'+i);
                    nutrientNameEl.setAttribute('style', ' text-align:left')

                    nutrientNameEl.textContent = data.foods[0].foodNutrients[i].nutrientName;

                    //create new column for ingredient amount
                    var nutrientAmountEl = document.createElement('div');

                    nutrientAmountEl.setAttribute('class', 'columns medium-3');
                    nutrientAmountEl.setAttribute('id', 'amount-'+i);
                    nutrientAmountEl.setAttribute('style', ' text-align:left')

                    nutrientAmountEl.textContent = data.foods[0].foodNutrients[i].value;

                    //create new column for unit
                    var nutrientUnitEl = document.createElement('div');

                    nutrientUnitEl.setAttribute('class', 'columns medium-3');
                    nutrientUnitEl.setAttribute('id', 'unit-'+i);
                    nutrientUnitEl.setAttribute('style', ' text-align:left')

                    nutrientUnitEl.textContent = data.foods[0].foodNutrients[i].unitName;

                    //add name, amount and unit columns to the nutrient row element
                    nutrientRowEL.appendChild(nutrientNameEl);
                    nutrientRowEL.appendChild(nutrientAmountEl);
                    nutrientRowEL.appendChild(nutrientUnitEl);


                    //
                    if ((i % 2) == 0){
                        nutrientRowEL.style.backgroundColor = "lightgray";
                    }
                    //add new nutrient row element to nutrient contianer
                    nutritionContainerEl.appendChild(nutrientRowEL);


                }

                //reset the recent searches buttons
                displayRecentSearches();
                window.location.href = "#nutrients-anchor";
           

            });
        }else {
            document.location.replace("./index.html");
        }
      });
};

var formSubmitHandler = function(event){

    event.preventDefault();
    // get value from input element
    ingredientName = ingredientInputEl.value.trim();
    // if the ingredient name exist, get the nutrient information and add ingedrient name to localstorage
    if (ingredientName) {
        getIngredientInfo(ingredientName);
        if (localStorage.getItem("ingredientsArray")){
            ingredientsArray = JSON.parse(localStorage.getItem("ingredientsArray"));

            var idx = ingredientsArray.length;
            ingredientsArray[idx] = ingredientName;
            localStorage.setItem("ingredientsArray", JSON.stringify(ingredientsArray));
        } else {
            ingredientsArray[0] = ingredientName;
            localStorage.setItem("ingredientsArray", JSON.stringify(ingredientsArray));
        }

        // clear the search field 
        ingredientInputEl.value = "";
    // if ingredient name is blank, alert user
    } else {
            alert("Please enter an ingredient username");

    }

};


var displayRecentSearches = function (){
    if (localStorage.getItem("ingredientsArray")){
    ingredientsButtonsEl.innerHTML = '';

    ingredientsArray = JSON.parse(localStorage.getItem("ingredientsArray"));
    
    if (ingredientsArray ){
        for (var i = 0; i < ingredientsArray.length ; i++){
            var ingredientSearchBtnEL = document.createElement("button");
            ingredientSearchBtnEL.textContent = ingredientsArray[i];
            ingredientSearchBtnEL.setAttribute("ingredient-id", ingredientsArray[i]);

            ingredientSearchBtnEL.setAttribute("class", "btn-2");
            ingredientsButtonsEl.appendChild(ingredientSearchBtnEL);
        }
    }
    } else{
        return;
    }
};

var recentSearchesHandler = function(event){
    event.preventDefault();
    var targetEl = event.target;
    ingredientName = targetEl.getAttribute("ingredient-id");

    document.location.replace("./ingredients.html?ingredient_name=" + ingredientName);
}


function showSearchSection (){
    searchOuterEL.setAttribute("style", "display: flex");
}

function hideSearchSection (){
    searchOuterEL.setAttribute("style", "display: none");
}

searchFormEl.addEventListener("submit", formSubmitHandler);
ingredientsButtonsEl.addEventListener("click", recentSearchesHandler);

displayRecentSearches();

setIngredientFromURL();
// hideSearchSection ();

