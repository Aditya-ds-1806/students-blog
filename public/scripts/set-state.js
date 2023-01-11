setTimeout(ajaxCall, 1000);
function ajaxCall() {
    $.ajax({
        type: "POST",
        url: "/setStatus",
        data: 'Im alive',
        success: function () {
            setTimeout(ajaxCall, 60 * 2 * 1000);
        }
    });
}