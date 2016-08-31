/**
 * Created by valchevv on 8/30/2016.
 */
function createRecipeComment(recipeData, commentText, commentAuthor){
    let recipeURL = kinveyServiceBaseURL + "appdata/" + kinveyAppID + "/recipe";

    if(!recipeData.commentIDs){
        recipeData.commentIDs = [];
    }
    recipeData.commentIDs.push({text: commentText, author: commentAuthor});

    $.ajax({
        method: "PUT",
        url:  recipeURL + '/' + recipeData._id,
        headers: kinveyAuthHeaders,
        data: JSON.stringify(recipeData),
        success: addRecipeCommentSuccess,
        error: showErrorMsg
    });

    function addRecipeCommentSuccess(){
        showInfoMsg("Recipe comment added");
    }
}

function addComment(recipe){
    let author = $("#commentAuthor").val();
    let text = $("#commentAuthor").val();
    
    createRecipeComment(recipe,text,author);
}

function getRecipeComments(){
        let commentsURL = kinveyServiceBaseURL + "appdata/" + kinveyAppID + "/Comments/?resolve_depth=1";

        $.ajax({
            method: "GET",
            url: commentsURL,
            headers: kinveyAuthHeaders,
            success: getRecipeCommentSuccess,
            error: showErrorMsg
        });


    function getRecipeCommentSuccess(commentsData){
        showInfoMsg("Recipe comments loaded");
        //alert(commentsData[0].commentID._obj.recipeName);
        let outputStructure = $('<table>')
            .append($('<tr>').append(
                '<th>Author</th>',
                '<th>Comment</th>')
            );

            for (let comment of commentsData) {
                {
                    let commentAuthor = comment.author;
                    let commentText = comment.commentText;
                    outputStructure
                        .append("<tr colspan='3'></tr>")
                        .append("<div></div>").text(commentAuthor)
                        .append("<div></div>").text(commentText);
                }
            }

        $("#viewRecipes").append(outputStructure);
        }
}

function showAddComment(link,recipe){
    let row = $(link).parent();
    row.append($("<form class='credentials' class='formComments'>").append("<div>Author:</div>")
        .append("<div><input type='text' id='commentAuthor'/></div>")
        .append("<div>Comment:</div>")
        .append("<div><input type='text' id='commentText'/></div>")
        .append("<div><input type='submit' value='Add Comment' onclick='addComment(recipe)'/></div>")
        .append("<div><input type='submit' value='Cancel' onclick='removeRow(this)'/></div>")
        .append("</form>"));
}

function removeRow(link){
    let row = $(link).parent().parent();
    row.fadeOut(function() {
        row.remove();
    })
}