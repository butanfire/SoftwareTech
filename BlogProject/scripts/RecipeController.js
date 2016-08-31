/**
 * Created by valchevv on 8/30/2016.
 */
var outputStructure = ''; //using a global var so it can be populated by the comments
var recipes = '';
var commentsComing = '';

const kinveyAppID = "kid_Sk0fbFiu";
const kinveyAppSecret = "8dd61a558f744c04b4b1080e716b04bc";
const kinveyServiceBaseURL = "https://baas.kinvey.com/";
const authBase64 = btoa(kinveyAppID + ":" + kinveyAppSecret);
const kinveyBasicAuthHeaders = {"Authorization": "Basic " + authBase64,};
const kinveyAuthHeaders = {"Authorization": "Kinvey " + sessionStorage.authToken,};


tinymce.init({
    selector: 'textarea',
    height: 250,
    width: 750,
    plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table contextmenu paste code'
    ],
    toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
    content_css: ['//www.tinymce.com/css/codepen.min.css']
});

function saveRecipe() {
    let recipeURL = kinveyServiceBaseURL + "appdata/" + kinveyAppID + "/recipes";

    let recipeData =
    {
        recipeName: $("#recipeName").val(),
        recipeText: tinyMCE.activeEditor.getContent({format: 'html'}),
        author: localStorage.getItem('user')
    }
    if (recipeData.recipeText.length < 10) {
        showErrorMsg("Recipe must be at least 10 characters long");
    }
    else {
        $.ajax({
            method: "POST",
            url: recipeURL,
            headers: kinveyAuthHeaders,
            data: recipeData,
            success: RecipesSaved,
            error: showErrorMsg
        });
    }

    function RecipesSaved() {
        showInfoMsg("Recipe Saved Successfully");
        showRecipesView();
    }
}

function readAllRecipes() {
    let readRecipeURL = kinveyServiceBaseURL + "appdata/" + kinveyAppID + "/recipes";

    $.ajax({
        method: "GET",
        url: readRecipeURL,
        headers: kinveyAuthHeaders,
        success: RecipesLoaded,
        error: showErrorMsg
    });

    function RecipesLoaded(recipesData) {
        recipes = recipesData;
        showInfoMsg("Recipes Loaded Successfully");

        if (recipesData.length == 0) {
            $("#recipesOutput").text("No recipes uploaded");
        }
        else
        {
            $("#viewRecipes").text(' ').append("<button type='button' id='buttonReadRecipes' onclick='readAllRecipes()'>Load Recepies</button>"); //clearing the recipes and adding the button
            outputStructure = $('<table>') //adding the table structure for the recipes
                .append($('<tr>').append(
                    '<th>Recipe name</th>',
                    '<th>Author</th>',
                    '<th>Recipe Text</th>')
                );

            getRecipeComments(); //the function for fetching the comments

            for (let recipe of recipesData) {
                recipeCommented = recipe;
                outputStructure.append($('<tr>').append(  //adding each recipe to the table
                    $('<td>').text(recipe.recipeName),
                    $('<td>').text(recipe.author),
                    $('<td>').append(recipe.recipeText)));

                outputStructure.append($('<tr>').append($('<td colspan="3">').append(("<div><a href='#' class='addCommentButton' onclick='showAddComment(this)'>Add Comment</a></div>")))); //adding the add comment button

                for (let comment of commentsComing) {
                    if (comment.commentID._obj == recipe._id) {
                        outputStructure.append($('<tr>').append(
                            '<div><th>Author</th></div>',
                            '<div><th>Comment</th></div>'));
                        let commentAuthor = comment.commentAuthor;
                        let commentText = comment.commentText;
                        outputStructure.append($('<tr>').append(
                            $('<td>').text(commentAuthor),
                            $('<td>').text(commentText)));
                    }
                }
            }
            $("#viewRecipes").append(outputStructure); //adding the whole structure to the table
        }
    }
}
