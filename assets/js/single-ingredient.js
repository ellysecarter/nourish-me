var nutritionContainerEl = document.querySelector("#ingredient-info-container");
var descriptionEl = document.querySelector("#nutrient-description");
var ingredientNameEl = document.querySelector("#ingredient-name");
var ingredientsArray = [];
var searchheaderFormEl = document.querySelector("#search-header");
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

function getIngredientName() {
    var queryString = document.location.search;
    ingredientName = queryString.split("=")[1];
    ingredientName = ingredientName.replace("%20", " ");
    if (ingredientName){
        getIngredientInfo(ingredientName);
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
                recipeLinkEl.innerHTML = "<a href='./recipes.html#" + ingredient + "'>" + ingredient+ "</a>";
                //display the nutrients info data
                for (var i = 0; i < data.foods[0].foodNutrients.length; i++){ 
                    //create a new row of nutrient info consisting of nutrient name, amount and unit
                    var nutrientRowEL = document.createElement('div');
                    nutrientRowEL.setAttribute('class', 'row');
                    
                    //create new column for ingredient name
                    var nutrientNameEl = document.createElement('div');
                    nutrientNameEl.setAttribute('class', 'col-md-6');
                    nutrientNameEl.setAttribute('id', 'nutrient-'+i);
                    nutrientNameEl.setAttribute('style', ' text-align:left')
                    nutrientNameEl.textContent = data.foods[0].foodNutrients[i].nutrientName;

                    //create new column for ingredient amount
                    var nutrientAmountEl = document.createElement('div');
                    nutrientAmountEl.setAttribute('class', 'col-md-3');
                    nutrientAmountEl.setAttribute('id', 'amount-'+i);
                    nutrientAmountEl.setAttribute('style', ' text-align:left')
                    nutrientAmountEl.textContent = data.foods[0].foodNutrients[i].value;

                    //create new column for unit
                    var nutrientUnitEl = document.createElement('div');
                    nutrientUnitEl.setAttribute('class', 'col-md-3');
                    nutrientUnitEl.setAttribute('id', 'unit-'+i);
                    nutrientUnitEl.setAttribute('style', ' text-align:left')
                    nutrientUnitEl.textContent = data.foods[0].foodNutrients[i].unitName;

                    //add name, amount and unit columns to the nutrient row element
                    nutrientRowEL.appendChild(nutrientNameEl);
                    nutrientRowEL.appendChild(nutrientAmountEl);
                    nutrientRowEL.appendChild(nutrientUnitEl);

                    //
                    if ((i % 2) == 1){
                        nutrientRowEL.style.backgroundColor = "lightgray";
                    }
                    //add new nutrient row element to nutrient contianer
                    nutritionContainerEl.appendChild(nutrientRowEL);


                }

                //reset the recent searches buttons
                displayRecentSearches();
           
            });
        }else {
            document.location.replace("./index.html");
        }
      });
};
  
var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
      }

    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");
        
        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
        typeEl.textContent = "(Pull request)";
        } else {
        typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);
        issueContainerEl.appendChild(issueEl);
      }
};

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
  
    // append to warning container
    limitWarningEl.appendChild(linkEl);
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
    // if city name is blank, alert user
    } else {
            alert("Please enter a city username");
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

searchFormEl.addEventListener("submit", formSubmitHandler);
searchheaderFormEl.addEventListener("submit", formSubmitHandler);
ingredientsButtonsEl.addEventListener("click", recentSearchesHandler);

displayRecentSearches();
getIngredientName();