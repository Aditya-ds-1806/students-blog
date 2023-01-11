var count;
var likesArray = [];
var bookmarksArray = [];

for (let i = 0; i < document.querySelectorAll('span.like-stats').length; i++) {
	likesArray.push(Number(document.querySelectorAll('span.like-stats')[i].textContent));
	document.querySelectorAll('span.like-stats')[i].addEventListener('click', function(e) {
		var initial = Number(this.textContent);
		count = initial;
		if (this.classList.contains('liked')) {
			count = count - 1;
		} else {
			count = count + 1;
		}
		this.classList.toggle('liked');
		this.children[1].textContent = count;
		e.preventDefault();

		if (Math.abs(likesArray[i] - count) == 0 || Math.abs(likesArray[i] - count) == 1) {
			$.ajax({
				type: 'POST',
				url: '/like',
				data: {
					likes: count,
					postID: this.parentElement.getAttribute('id'),
					likeState: function() {
						return initial < count;
					}
				}
			});
		} else {
			// console.log('Dont mess with the data');
		}
	});
}

for (let i = 0; i < document.querySelectorAll('span.bookmark-stats').length; i++) {
	bookmarksArray.push(Number(document.querySelectorAll('span.bookmark-stats')[i].textContent));
	document.querySelectorAll('span.bookmark-stats')[i].addEventListener('click', function(e) {
		var initial = Number(this.textContent);
		count = initial;
		if (this.classList.contains('bookmarked')) {
			count = count - 1;
		} else {
			count = count + 1;
		}
		this.classList.toggle('bookmarked');
		this.children[1].textContent = count;
		e.preventDefault();
		// console.log(bookmarksArray[i] - count);

		if (Math.abs(bookmarksArray[i] - count) == 0 || Math.abs(bookmarksArray[i] - count) == 1) {
			$.ajax({
				type: 'POST',
				url: '/bookmark',
				data: {
					bookmarks: count,
					postID: this.parentElement.getAttribute('id'),
					bookmarkState: function() {
						return initial < count;
					}
				}
			});
		} else {
			// console.log('Dont mess with the data');
		}
	});
}
