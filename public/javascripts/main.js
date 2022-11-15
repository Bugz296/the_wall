$(document).ready(() => {

    $("#register").on("submit", (e) => {
        $.post("/register", convertToJson("#register"))
        .done(() => {
            window.location.href = '/home';
        });
        e.preventDefault();
    });

    $("#login").on("submit", (e) => {
        $.post("/login", convertToJson("#login"))
        .done(() => {
            window.location.href = '/home';
        });
        e.preventDefault();
    });

    $("#message_form").on("submit", (e) => {
        $.post("/add_message", convertToJson("#message"))
        .done((data) => {
            $("#message_and_comments_container").empty();
            $("#message_and_comments_container").append(data);
        });
        e.preventDefault();
    });

    $(document).on("submit", ".comment_form", function(){
        let message_id = $(this).attr("value");
        let comment = $("#comment_for_message_id_"+message_id).val();

        $.post("/add_comment", {message_id, comment})
        .done((data) => {
            $("#message_and_comments_container").empty();
            $("#message_and_comments_container").append(data);
        });

        return false;
    });

    $(document).on("click", ".delete_message", function(){
        let message_id = $(this).attr("value");
        $.post("/delete_message", {message_id})
        .done((data) => {
            $("#message_and_comments_container").empty();
            $("#message_and_comments_container").append(data);
        });

        return false;
    });

    $(document).on("click", ".delete_comment", function(){
        let comment_id = $(this).attr("value");

        $.post("/delete_comment", {comment_id})
        .done((data) => {
            $("#message_and_comments_container").empty();
            $("#message_and_comments_container").append(data);
        });

        return false;
    });

    $(document).on("click", "#signout", function(){

        $.get("/logout", {})
        .done(() => {
            window.location.href = '/';
        });

        return false;
    });
});

function convertToJson(element){

    let data = {};
    $(element).serializeArray().map(({name, value})=>{
        data[name] = value;
    });

    return data;
}