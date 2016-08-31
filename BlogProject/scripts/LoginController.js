/**
 * Created by valchevv on 8/30/2016.
 */
function register(){
    let registerURL = kinveyServiceBaseURL + "user/" + kinveyAppID + "/";

    let userData = {
        username: $("#registerUser").val(),
        password: $("#registerPass").val()
    };
    if(userData.username.length < 5) {
        showErrorMsg("Username is less than 5 characters")
    }
    else{
        if (userData.password.length < 5) {
            showErrorMsg("Password is less than 5 characters")
        }
        else {
            $.ajax({
                method: "POST",
                url: registerURL,
                data: userData,
                headers: kinveyBasicAuthHeaders,
                success: registerSuccess,
                error: showErrorMsg
            });
        }
    }

    function registerSuccess(response){
        let userAuth = response._kmd.authtoken;
        sessionStorage.setItem('authToken',userAuth);
        showHomeView();
        showHideNavigationLink();
        showInfoMsg("Register Successful");
        showLoggedUser(response);
    }
}

function login(){
    let loginURL = kinveyServiceBaseURL + "user/" + kinveyAppID + "/login";

    let userData = {
        username: $("#loginUser").val(),
        password: $("#loginPass").val()
    };
    if(userData.username.length < 5) {
        showErrorMsg("Username is less than 5 characters")
    }
    else {
        if (userData.password.length < 5) {
            showErrorMsg("Password is less than 5 characters")
        }
        else {
            $.ajax({
                method: "POST",
                url: loginURL,
                data: userData,
                headers: kinveyBasicAuthHeaders,
                success: loginSuccess,
                error: showErrorMsg
            });
        }
    }

    function loginSuccess(response){
        let userAuth = response._kmd.authtoken;
        sessionStorage.setItem('authToken',userAuth);
        showHomeView();
        showHideNavigationLink();
        showInfoMsg("Login Successful");
        showLoggedUser(response);
    }
}

function showLoggedUser(response){
    var user = {'name':response.username};
    $("#usernameBox").text("Logged in as : "+ user.name).show();
    localStorage.setItem('user', user.name);
}

function hideLoggedUser(){
    $("#usernameBox").hide();
}

function logout(){
    sessionStorage.clear();
    localStorage.clear();
    showHideNavigationLink();
    showInfoMsg("Logout Successful");
    showView("viewHome");
    hideLoggedUser();
}

