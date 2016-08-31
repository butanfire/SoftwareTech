/**
 * Created by valchevv on 8/30/2016.
 */

function createRecipeComment(recipeData, commentText, commentAuthor) {
    let commentsURL = kinveyServiceBaseURL + "appdata/" + kinveyAppID + "/Comments";

    let data =
    {
        commentText: commentText,
        commentAuthor: commentAuthor,
        commentID: {
            _type: "KinveyRef",
            _id: recipeData._id,
            _collection: "recipe"
        }
    }

    $.ajax({
        method: "POST",
        url: commentsURL,
        headers: kinveyAuthHeaders,
        data: data,
        success: addRecipeCommentSuccess,
        error: showErrorMsg
    });

    function addRecipeCommentSuccess() {
        showInfoMsg("Recipe comment added");
    }
}

function addComment(link) {
    let author = $("#commentAuthor").val();
    let text = $("#commentText").val();
    createRecipeComment(recipeCommented, text, author);
    removeCommentFields(link);
} //a function for sending the data for the comments and removing the comment fields

function getRecipeComments() {
    let commentsURL = kinveyServiceBaseURL + "appdata/" + kinveyAppID + "/Comments/?resolve=commentID";

    $.ajax({
        method: "GET",
        url: commentsURL,
        headers: kinveyAuthHeaders,
        success: getRecipeCommentSuccess,
        error: showErrorMsg
    });


    function getRecipeCommentSuccess(commentsData) {
        showInfoMsg("Recipe comments loaded");
        commentsComing = commentsData;
    }
}

function showAddComment(link) { //adding the AddComent and form for the comments
    let row = $(link).parent();
    row.append($("<form class='credentials' class='formComments'>").append("<div>Author:</div>")
        .append("<div><input type='text' id='commentAuthor'/></div>")
        .append("<div>Comment:</div>")
        .append("<div><input type='text' id='commentText'/></div>")
        .append("<div><input type='submit' class='formComments' value='Add Comment' onclick='addComment(this)'/></div>")
        .append("<div><input type='submit' class='formComments' value='Cancel' onclick='removeCommentFields(this)'/></div>")
        .append("</form>"));
}

function removeCommentFields(link) { //removing the comment fields after pressing cancel
    let row = $(link).parent().parent();
    row.fadeOut(function () {
        row.remove();
    })
}