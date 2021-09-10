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

//sets ElementById("ingredients") to the recipe's ingredients seperated by <br>s
function setIngredients(id) {
    $.ajax({
        url:"https://api.spoonacular.com/recipes/"+id+"/information?apiKey=66f53e7e0ca942c9806998c27a0847af",
        success: function(res) {
            var ingredients = res.extendedIngredients
            var ingredientsString = ""
            for (i=0; i<ingredients.length; i++) {
                ingredientsString = ingredientsString  + ingredients[i].name + "<br>"
            }
            document.getElementById("ingredients").innerHTML = ingredientsString
        }
    });
}

//is called by the button to search for one recipe and set ElementById("title") to its title as well as call other functions
//two commented out lines contain code for displaying the recipe's corresponding image and how long it takes to prepare
function getRecipe(q) {
    $.ajax({
        url: "https://api.spoonacular.com/recipes/search?apiKey=66f53e7e0ca942c9806998c27a0847af&number=1&query="+q,
        success: function(res){
            document.getElementById("title").innerHTML="<h1>"+res.results[0].title+"</h1><br>"+
            //image "<img src='"+res.baseUri+res.results[0].image+"' width='400' /> <br>"+
            //"Ready in "+res.results[0].readyInMinutes+" minutes"
            setIngredients(res.results[0].id)
            setLink(res.results[0].id)
        }
    });
}