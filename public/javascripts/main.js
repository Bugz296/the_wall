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

    $(document).on("click", "#signout", function(){

        $.get("/logout", {})
        .done(() => {
            window.location.href = '/';
        });

        return false;
    });

    $(document).on("submit", "#post_a_message", function(){

        let message = $("#message").val();
        $.post("/add_message", { message })
        .done(() => {
            window.location.href = '/home';
        });

        return false;
    });

    $(document).on("submit", ".post_a_comment", function(){
        let message_id = $(this).attr("value");
        let comment = $("#comment_" + message_id).val();

        $.post("/add_comment", { message_id, comment })
        .done(() => {
            window.location.href = '/home';
        });

        return false;
    });

    $(document).on("click", ".delete_comment", function(){
        let content_id = $(this).attr("value");

        $.post("/delete_content", { content_id })
        .done(() => {
            window.location.href = '/home';
        });

        return false;
    });
    
    $(document).on("click", ".delete_message", function(){
        let content_id = $(this).attr("value");

        $.post("/delete_content", { is_message: 1, content_id })
        .done(() => {
            window.location.href = '/home';
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