
const keyhandler = e => {
	console.log(e.code);
	switch (e.code) {
		case 'ArrowUp':
			if (currentSelection.y > 1) {
				currentSelection.y--;
				redrawTable();
				e.preventDefault();
			}
		break;
		case 'ArrowDown':
			if (currentSelection.y < currentArray.length - 1) {
				currentSelection.y++;
				redrawTable();
				e.preventDefault();
			}
		break;
		case 'ArrowLeft':
			if (currentSelection.x > 0) {
				currentSelection.x--;
				redrawTable();
				e.preventDefault();
			}
		break;
		case 'ArrowRight':
			if (currentSelection.x < 1) {
				currentSelection.x++;
				redrawTable();
				e.preventDefault();
			}
		break;
	}
}
document.addEventListener('keydown', keyhandler);