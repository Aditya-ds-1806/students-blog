var textarea = document.querySelector('textarea');
window.onload = disableSubmit(textarea);

function autoGrow(textarea) {
	textarea.style.height = '5px';
	textarea.style.height = textarea.scrollHeight + 'px';
}

function disableSubmit(textarea) {
	if (!/\S/.test($('#comment-text').val())) {
		document.querySelector("button[type='submit'].btn-primary").classList.add('disabled');
	} else {
		document.querySelector("button[type='submit'].btn-primary").classList.remove('disabled');
	}
}

if (textarea) {
	textarea.addEventListener('input', function () {
		autoGrow(textarea);
		disableSubmit(textarea);
	});
}

// Make an AJAX call to /blogs/comment route
$('#comment').submit(function (e) {
	e.preventDefault();
	if (/\S/.test($('#comment-text').val())) {
		$.ajax({
			type: 'POST',
			url: document.URL + '/comment',
			data: {
				commentText: $('#comment-text').val()
			},
			success: function (status) {
				if (status === 'OK') {
					// 200 OK
					textarea.value = null;
					disableSubmit(textarea);
					document.querySelector('#count').textContent = Number(document.querySelector('#count').textContent) + 1;
					$.ajax({
						type: "GET",
						url: document.URL + '/getCommentPartial',
						success: function (data) {
							const initHeight = $(document).height();
							const initScroll = $(window).scrollTop();
							$("#comments-container").prepend(data);
							$(document).scrollTop(initScroll + $(document).height() - initHeight);
							// add event listener to new trash icon
							var trashId = $(data).find('i').attr('id');
							console.log(trashId);
							$('#' + trashId).click(function (e) {
								e.preventDefault();
								trashAjaxCall(this);
							});
						}
					});
				}
			}
		});
	} else {
		disableSubmit(textarea);
	}
});
