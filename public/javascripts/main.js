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

    $("#post_message").on("submit", (e) => {
        let message = $("#message").val();
        $("#message").val("");
        $.post("/add_message", { message })
        .done((data) => {
            updateGroupMessagesContainer(data.result);
        });
        e.preventDefault();
    });

    $(document).on("click", ".delete_message_btn", function(e){
        let message_id = $(this).attr("value");
        $.post("/delete_message", { message_id: parseInt(message_id) })
        .done((data) => {
            updateGroupMessagesContainer(data.result);
        });
        e.preventDefault();
    });

    $(document).on("submit", ".post_comment", function(){
        let message_id = $(this).attr("value");
        let comment = $("#to_msg_id_" + message_id).val();
        $("#to_msg_id_" + message_id).val("");
        $.post("/add_comment", { message_id, comment })
        .done((data) => {
            updateGroupMessagesContainer(data.result);
        });
        return false
    });

    $(document).on("click", ".delete_comment_btn", function(e){
        let comment_id = $(this).attr("value");
        let message_id = $("#msg_comment_id_" + comment_id).val();
        console.log('message_id :>> ', message_id);
        $.post("/delete_comment", { comment_id: parseInt(comment_id), message_id })
        .done((data) => {
            updateGroupMessagesContainer(data.result);
        });
        e.preventDefault();
    });
});

function convertToJson(element){

    let data = {};
    $(element).serializeArray().map(({name, value})=>{
        data[name] = value;
    });

    return data;
}

function updateGroupMessagesContainer(data){
    $("#group_messages_container").empty();

    let html = "";
    for(let { message_id, message, msg_created_at, messenger, comments: comments_json } of data){
        comments = JSON.parse(comments_json || '[]');

        html += `
            <section class="message_container">
                <p>${messenger} - <span>${msg_created_at}</span></p>
                <p>${message}</p>
                <button class="delete_message_btn" name="message_id" value="${message_id}"> Delete </button>
                <div class="comments_container">`;

        for(let { comment_id, comment, commenter, comment_created_at } of comments){
            html += `
                    <div>
                        <p>${commenter} - <span>${comment_created_at}</span></p>
                        <p>${comment}</p>
                        <button class="delete_comment_btn" value="${comment_id}"> Delete </button>
                        <input type="hidden" id="msg_comment_id_${comment_id}" value="${message_id}"/>
                    </div>`;
        }
            html += `
                    <form class="post_comment" value="${message_id}">
                        <h3>Post a comment</h3>
                        <textarea id="to_msg_id_${message_id}" name="comment"></textarea>
                        <input type="submit" value="Post a comment"/>
                    </form>
                </div>
            </section>`
    }

    $("#group_messages_container").append(html);
}