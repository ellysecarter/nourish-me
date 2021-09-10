//sets ElementById("servings") to the recipe's number of servings
function setServings(id) {
    $.ajax({
        url:"https://api.spoonacular.com/recipes/"+id+"/information?apiKey=66f53e7e0ca942c9806998c27a0847af",
        success: function(res) {
            if (res.servings == 1) {
                document.getElementById("servings").innerHTML = res.servings + " Serving"
            }
            else {
                document.getElementById("servings").innerHTML = res.servings + " Servings"
            }
        }
    });
}

//sets ElementById("ingredients") to the recipe's ingredients separated by <br>s
function setIngredients(id) {
    $.ajax({
        url:"https://api.spoonacular.com/recipes/"+id+"/information?apiKey=66f53e7e0ca942c9806998c27a0847af",
        success: function(res) {
            var ingredients = res.extendedIngredients
            var ingredientsString = ""
            for (i=0; i<ingredients.length; i++) {
                ingredientsString = ingredientsString  + ingredients[i].original + "<br>"
            }
            document.getElementById("ingredients").innerHTML = ingredientsString
        }
    });
}

//sets ElementById("instructions") to the recipe's instructions separated by <br>s
function setInstructions(id) {
    $.ajax({
        url:"https://api.spoonacular.com/recipes/"+id+"/analyzedInstructions?apiKey=66f53e7e0ca942c9806998c27a0847af",
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

//sets ElementById("sourceLink") to display and link to the recipe
function setLink(id) {
    $.ajax({
        url:"https://api.spoonacular.com/recipes/"+id+"/information?apiKey=66f53e7e0ca942c9806998c27a0847af",
        success: function(res) {
            document.getElementById("sourceLink").innerHTML=res.sourceUrl
            document.getElementById("sourceLink").href=res.sourceUrl
        }
    });
}

//is called by the button to search for one recipe and set ElementById("title") to its title as well as call other functions
//two commented out lines contain code for displaying the recipe's corresponding image and how long it takes to prepare
function getRecipe(q) {
    $.ajax({
        url: "https://api.spoonacular.com/recipes/search?apiKey=66f53e7e0ca942c9806998c27a0847af&number=1&query="+q,
        success: function(res){
            var id = res.results[0].id
            document.getElementById("title").innerHTML="<h1>"+res.results[0].title+"</h1>"/*+
            "<br><img src='"+res.baseUri+res.results[0].image+"' width='400' /> <br>"+
            "Ready in "+res.results[0].readyInMinutes+" minutes" */
            setServings(id)
            setIngredients(id)
            setInstructions(id)
            setLink(id)
        }
    });
}