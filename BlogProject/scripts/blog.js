const kinveyAppID ="kid_Sk0fbFiu";
const kinveyAppSecret = "8dd61a558f744c04b4b1080e716b04bc";
const kinveyServiceBaseURL ="https://baas.kinvey.com/";
const authBase64 = btoa(kinveyAppID + ":" + kinveyAppSecret);
const kinveyBasicAuthHeaders =  {"Authorization": "Basic " + authBase64,};
const kinveyAuthHeaders =  {"Authorization": "Kinvey " + sessionStorage.authToken,};

$(function(){
    $('#linkHome').click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkLogout").click(logout);
    $("#linkRegister").click(showRegisterView);
    $("#linkRecipes").click(showRecipesView);
    $("#linkCreateRecipes").click(showCreateRecipeView);
    showHomeView();
    showHideNavigationLink();
    $("#buttonLogin").click(login);
    $("#buttonRegister").click(register);
    $("#buttonCreateRecipe").click(saveRecipe);
    $("#buttonReadRecipes").click(readAllRecipes);
});

function showHideNavigationLink(){
    let loggedIn = sessionStorage.authToken != null;
    if(loggedIn){
        $('#linkHome').show();
        $("#linkLogin").hide();
        $("#linkLogout").show();
        $("#linkRecipes").show();
        $("#linkCreateRecipes").show();
    }
    else{
        $('#linkHome').show();
        $("#linkLogin").show();
        $("#linkLogout").hide();
        $("#linkRegister").show();
        $("#linkRecipes").hide();
        $("#linkCreateRecipes").hide();
    }
}

function showView(viewName) {
    $("main > section").hide();
    $("#" + viewName).show();
}

function showCreateRecipeView(){
    showView("viewCreateRecipes");
}

function showRecipesView(){
    showView("viewRecipes");
}

function showHomeView(){
    showView("viewHome");
}

function showRecipesView(){
    showView("viewRecipes");
}

function showLoginView(){
    showView("viewLogin");
    showHideNavigationLink();
}

function login(){
    let loginURL = kinveyServiceBaseURL + "user/" + kinveyAppID + "/login";

    let userData = {
        username: $("#loginUser").val(),
        password: $("#loginPass").val()
    };

    $.ajax({
        method: "POST",
        url:  loginURL,
        data: userData,
        headers: kinveyBasicAuthHeaders,
        success: loginSuccess,
        error: showAjaxError
    });

    function loginSuccess(response){
        let userAuth = response._kmd.authtoken;
        sessionStorage.setItem('authToken',userAuth);
        showHomeView();
        showHideNavigationLink();
        showInfoMsg("Login Successful");
    }
}

function showAjaxError(status){
    let errorMsg = "Error : "+ JSON.stringify(status);
    $('#errorBox').text(errorMsg).show();
}

function showRegisterView(){
    showView("viewRegister");
    showHideNavigationLink();
}

function register(){
    let registerURL = kinveyServiceBaseURL + "user/" + kinveyAppID + "/";

    let userData = {
        username: $("#registerUser").val(),
        password: $("#registerPass").val()
    };

    $.ajax({
        method: "POST",
        url:  registerURL,
        data: userData,
        headers: kinveyBasicAuthHeaders,
        success: registerSuccess,
        error: showAjaxError
    });

    function registerSuccess(response){
        let userAuth = response._kmd.authtoken;
        sessionStorage.setItem('authToken',userAuth);
        showHomeView();
        showHideNavigationLink();
        showInfoMsg("Register Successful");
    }
}

function showInfoMsg(message){
    $("#infoBox").text(message).show().delay(2500).fadeOut();
}

function saveRecipe() {
    let recipeURL = kinveyServiceBaseURL + "appdata/" + kinveyAppID + "/recipes";

    let recipeData ={
        recipeName: $("#recipeName").val(),
        recipeText: tinyMCE.activeEditor.getContent({format : 'html'}),
        comments: {
            _type: "KinveyReference",
            _id: $("#recipeName").val(),
            _collection: "Comments"
        }
    }

    $.ajax({
        method: "POST",
        url:  recipeURL,
        headers: kinveyAuthHeaders,
        data: recipeData,
        success: RecipesSaved,
        error: showAjaxError
    });

    function RecipesSaved(){
        showInfoMsg("Recipe Saved Successfully");
        showRecipesView();
    }
}

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
    content_css: [                        '//www.tinymce.com/css/codepen.min.css'        ]
});

function readAllRecipes(){
    let readRecipeURL = kinveyServiceBaseURL + "appdata/" + kinveyAppID + "/recipes";

    $.ajax({
        method: "GET",
        url:  readRecipeURL,
        headers: kinveyAuthHeaders,
        success: RecipesLoaded,
        error: showAjaxError
    });

    function RecipesLoaded(){
        showInfoMsg("Recipes Loaded Successfully");
        showRecipesView();
    }
}

function createComment(){

}

function getComments(){

}

function logout(){
    sessionStorage.clear();
    showHideNavigationLink();
    showInfoMsg("Logout Successful");
    showView("viewHome");
}

