
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
		case 'KeyI':
			insertCell(true);
			redrawTable();
		break;
		case 'KeyO':
			insertCell();
			redrawTable();
		break;
		case 'KeyX':
			deleteCell();
			redrawTable();
		break;
		case 'KeyQ':
			removeSpaces();
			redrawTable();
		break;
	}
}
document.addEventListener('keydown', keyhandler);

const insertCell = above => {
	let workingArray = transpose([...currentArray]);
	workingArray[currentSelection.x].splice(currentSelection.y + (above ? 0 : 1), 0, '');
	workingArray[Number(!currentSelection.x)].push('');
	currentArray = transpose(workingArray);
}

const deleteCell = () => {
	let workingArray = transpose([...currentArray]);
	if (workingArray[currentSelection.x][currentSelection.y] !== '') return;
	workingArray[currentSelection.x].splice(currentSelection.y, 1);
	workingArray[currentSelection.x].push('');
	currentArray = transpose(workingArray);
}

const removeSpaces = () => {
	const workingArray = [...currentArray];
	let i = 0;
	while (workingArray[i] !== undefined){
		if (workingArray[i][0] === '' && workingArray[i][1] === '') workingArray.splice(i, 1);
		else i++;
	}
	currentArray = workingArray;
}

const addClickTrigger = () => {

	const onCellClick = evt => {
		const row = evt.target.parentElement.rowIndex;
		const col = evt.target.cellIndex;
		
		console.log(row, col);
		currentSelection = {x:col, y:row};
		redrawTable();
	}
	
	const myTable = document.getElementById('result');
	const tds = myTable.querySelectorAll('td');
	
	tds.forEach(td => td.addEventListener('click', onCellClick));
}