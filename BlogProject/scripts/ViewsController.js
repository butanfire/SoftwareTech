/**
 * Created by valchevv on 8/30/2016.
 */

$(function () {
    $('#linkHome').click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkLogout").click(logout);
    $("#linkRegister").click(showRegisterView);
    $("#linkRegister2").click(showRegisterView);
    $("#linkRecipes").click(showRecipesView);
    $("#linkCreateRecipes").click(showCreateRecipeView);
    showHomeView();
    showHideNavigationLink();
    $("#formLogin").submit(function (e) {
        e.preventDefault();
        login();
    });
    $("#formRegister").submit(function (e) {
        e.preventDefault();
        register();
    });
    $("#formRecipe").submit(function (e) {
        e.preventDefault();
        saveRecipe()
    });
    $("#buttonReadRecipes").click(getRecipeComments);
    if (localStorage.getItem('user') != undefined) {
        $("#usernameBox").text("Logged in as : " + localStorage.getItem('user')).show();
    }
    $(document)
        .ajaxStart(function () {
            $("#loadingBox").text("Loading...").show();
        })
        .ajaxStop((function () {
            $("#loadingBox").hide();
        }));
});

function showHideNavigationLink() {
    let loggedIn = sessionStorage.authToken != null;
    if (loggedIn) {
        $('#linkHome').show();
        $("#linkLogin").hide();
        $("#linkLogout").show();
        $("#linkRecipes").show();
        $("#linkCreateRecipes").show();
    }
    else {
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

function showCreateRecipeView() {
    showView("viewCreateRecipes");
}

function showHomeView() {
    showView("viewHome");
}

function showRecipesView() {
    showView("viewRecipes");
}

function showLoginView() {
    showView("viewLogin");
    showHideNavigationLink();
}

function showRegisterView() {
    showView("viewRegister");
    showHideNavigationLink();
}

function showInfoMsg(message) {
    $("#infoBox").text(message).show().delay(2500).fadeOut();
    $("#loadingBox").hide();
}

function showErrorMsg(data, status) {
    let errorMsg = '';
    if (data.responseJSON && data.responseJSON.description) {
        errorMsg = data.responseJSON.description
    }
    else {
        errorMsg = "Error : " + JSON.stringify(data);
    }
    $('#errorBox').text(errorMsg).show().delay(2500).fadeOut();
    $('#infoBox').hide();
}