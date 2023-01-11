const trashIcons = document.querySelectorAll('#comments-container i.fa-trash-alt');

for (let i = 0; i < trashIcons.length; i++) {
    const trash = trashIcons[i];
    trash.addEventListener('click', function (e) {
        e.preventDefault();
        trashAjaxCall(this);
    });
}

function trashAjaxCall(item) {
    $.ajax({
        type: 'DELETE',
        url: window.location.href + '/' + item.getAttribute('id') + '/delete',
        success: function (status) {
            if (status === 'OK') {
                // 200 OK
                document.querySelector('#count').textContent = Number(document.querySelector('#count').textContent) - 1;
                $('#' + item.getAttribute('id')).parent().parent().parent().slideUp();
            }
        }
    });
}
