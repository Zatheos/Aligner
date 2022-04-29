
const keyhandler = e => {
	console.log(e.code);
	if (currentTableContents?.length < 1) return;
	switch (e.code) {
		case 'ArrowUp':
			if (currentActiveTableCell.y > 1) {
				currentActiveTableCell.y--;
				redrawTable();
				e.preventDefault();
			}
		break;
		case 'ArrowDown':
			if (currentActiveTableCell.y < currentTableContents.length - 1) {
				currentActiveTableCell.y++;
				redrawTable();
				e.preventDefault();
			}
		break;
		case 'ArrowLeft':
			if (currentActiveTableCell.x > 0) {
				currentActiveTableCell.x--;
				redrawTable();
				e.preventDefault();
			}
		break;
		case 'ArrowRight':
			if (currentActiveTableCell.x < 1) {
				currentActiveTableCell.x++;
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
		case 'Enter':
		case 'NumpadEnter':
			confirmThisRecordAndGoNext();
			redrawTable();
			e.preventDefault();
		break;
	}
}
document.addEventListener('keydown', keyhandler);

const insertCell = above => {
	let workingArray = transpose([...currentTableContents]);
	workingArray[currentActiveTableCell.x].splice(currentActiveTableCell.y + (above ? 0 : 1), 0, '');
	workingArray[Number(!currentActiveTableCell.x)].push('');
	currentTableContents = transpose(workingArray);
}

const deleteCell = () => {
	let workingArray = transpose([...currentTableContents]);
	if (workingArray[currentActiveTableCell.x][currentActiveTableCell.y] !== '') return;
	workingArray[currentActiveTableCell.x].splice(currentActiveTableCell.y, 1);
	workingArray[currentActiveTableCell.x].push('');
	currentTableContents = transpose(workingArray);
}

const removeSpaces = () => {
	const workingArray = [...currentTableContents];
	let i = 0;
	while (workingArray[i] !== undefined){
		if (workingArray[i][0] === '' && workingArray[i][1] === '') workingArray.splice(i, 1);
		else i++;
	}
	currentTableContents = workingArray;
}

const addClickTrigger = () => {

	const onCellClick = evt => {
		const row = evt.target.parentElement.rowIndex;
		const col = evt.target.cellIndex;
		currentActiveTableCell = {x:col, y:row};
		redrawTable();
	}
	
	const myTable = document.getElementById('result');
	const tds = myTable.querySelectorAll('td');
	
	tds.forEach(td => td.addEventListener('click', onCellClick));
}

// TODO 
// add ability to go back to previous record and make more changes
// add ability to *mark* something as noteworthy / return to