var nutritionContainerEl = document.querySelector("#nutrition-container");
var descriptionEl = document.querySelector("#nutrient-description");
var servingSizeEl = document.querySelector("#serving-size");
var ingredientNameEl = document.querySelector("#ingredient-name");
var searchFormEl = document.querySelector("#search-form");
var ingredientInputEl = document.querySelector("#ingredient");

function getIngredientName() {
    var queryString = document.location.search;
    var ingredientName = queryString.split("=")[1];
    if (ingredientName){
        ingredientNameEl.textContent = ingredientName.replace("%20", " ");
        getIngredientInfo(ingredientName);
    }else {
        searchFormEl.setAttribute("style", "display: flex");
      }
}


var getIngredientInfo = function(ingredient) {
    var apiUrl = "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=CaaqbdHoAR2KavNuAQFcBRRv7vL4gDF78ENsyxMu&query=" + ingredient + "&dataType=Survey (FNDDS)&pagesize=5";
    
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                descriptionEl.textContent = data.foods[0].description;
                console.log(data);
                console.log(data.foods[0].foodNutrients);

                for (var i = 0; i < data.foods[0].foodNutrients.length; i++){ 
                    //create a new row of nutrient info consisting of nutrient name, amount and unit
                    var nutrientRowEL = document.createElement('div');
                    nutrientRowEL.setAttribute('class', 'row');
                    
                    //create new column for ingredient name
                    var nutrientNameEl = document.createElement('div');
                    nutrientNameEl.setAttribute('class', 'col-md-6');
                    nutrientNameEl.setAttribute('id', 'nutrient-'+i);
                    nutrientNameEl.textContent = data.foods[0].foodNutrients[i].nutrientName;

                    //create new column for ingredient amount
                    var nutrientAmountEl = document.createElement('div');
                    nutrientAmountEl.setAttribute('class', 'col-md-3');
                    nutrientAmountEl.setAttribute('id', 'amount-'+i);
                    nutrientAmountEl.textContent = data.foods[0].foodNutrients[i].value;

                    //create new column for unit
                    var nutrientUnitEl = document.createElement('div');
                    nutrientUnitEl.setAttribute('class', 'col-md-3');
                    nutrientUnitEl.setAttribute('id', 'unit-'+i);
                    nutrientUnitEl.textContent = data.foods[0].foodNutrients[i].unitName;

                    //add name, amount and unit columns to the nutrient row element
                    nutrientRowEL.appendChild(nutrientNameEl);
                    nutrientRowEL.appendChild(nutrientAmountEl);
                    nutrientRowEL.appendChild(nutrientUnitEl);

                    //add new nutrient row element to nutrient contianer
                    nutritionContainerEl.appendChild(nutrientRowEL);

                }
          
            //   // check if api has paginated issues
            //   if (response.headers.get("Link")) {
            //     displayWarning(repo);
            //   }
            });
        }else {
            document.location.replace("./index.html");
        }
      });
};
  
// var displayIssues = function(issues) {
//     if (issues.length === 0) {
//         issueContainerEl.textContent = "This repo has no open issues!";
//         return;
//       }

//     for (var i = 0; i < issues.length; i++) {
//         // create a link element to take users to the issue on github
//         var issueEl = document.createElement("a");
//         issueEl.classList = "list-item flex-row justify-space-between align-center";
//         issueEl.setAttribute("href", issues[i].html_url);
//         issueEl.setAttribute("target", "_blank");
        
//         // create span to hold issue title
//         var titleEl = document.createElement("span");
//         titleEl.textContent = issues[i].title;

//         // append to container
//         issueEl.appendChild(titleEl);

//         // create a type element
//         var typeEl = document.createElement("span");

//         // check if issue is an actual issue or a pull request
//         if (issues[i].pull_request) {
//         typeEl.textContent = "(Pull request)";
//         } else {
//         typeEl.textContent = "(Issue)";
//         }

//         // append to container
//         issueEl.appendChild(typeEl);
//         issueContainerEl.appendChild(issueEl);
//       }
// };

// var displayWarning = function(repo) {
//     // add text to warning container
//     limitWarningEl.textContent = "To see more than 30 issues, visit ";
    
//     var linkEl = document.createElement("a");
//     linkEl.textContent = "See More Issues on GitHub.com";
//     linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
//     linkEl.setAttribute("target", "_blank");
  
//     // append to warning container
//     limitWarningEl.appendChild(linkEl);
// };

var formSubmitHandler = function(event){
    event.preventDefault();
    // get value from input element
    var ingredient = ingredientInputEl.value.trim();

    if (ingredient) {
        getIngredientInfo(ingredient);
        ingredientInputEl.value = "";
        } else {
        alert("Please enter an ingredient");
        }
        
};

getIngredientName();
  
searchFormEl.addEventListener("submit", formSubmitHandler);
