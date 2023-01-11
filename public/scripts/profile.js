var checkbox = document.querySelectorAll('input[type=checkbox]');
for (let i = 0; i < checkbox.length; i++) {
	checkbox[i].addEventListener('change', function() {
		if (this.checked && (this.getAttribute('id').length === 24 || this.getAttribute('id').length === 27)) {
			// Switch is on => Post is approved
			const postID = this.getAttribute('id');
			console.log(postID);
			$.ajax({
				type: 'POST',
				url: '/admin/approved',
				data: {
					postID: function() {
						if (postID.length === 24) {
							return postID;
						} else {
							return postID.slice(3);
						}
					}
				}
			});
		}

		if (!this.checked && (this.getAttribute('id').length === 24 || this.getAttribute('id').length === 27)) {
			// Switch is off => Post is not approved
			const postID = this.getAttribute('id');
			$.ajax({
				type: 'POST',
				url: '/admin/notapproved',
				data: {
					postID: function() {
						if (postID.length === 24) {
							return postID;
						} else {
							return postID.slice(3);
						}
					}
				}
			});
		}
	});
}
