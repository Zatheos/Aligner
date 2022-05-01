
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
		case 'KeyF':
			flagRow();
			redrawTable();
		break;
		case 'KeyM':
			shunt(true);
			redrawTable();
		break;
		case 'KeyN':
			shunt(false);
			redrawTable();
		break;
		case 'Backspace':
			goBack();
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
	workingArray = padArray(workingArray);
	currentTableContents = transpose(workingArray);
}

const deleteCell = () => {
	let workingArray = transpose([...currentTableContents]);
	if (workingArray[currentActiveTableCell.x][currentActiveTableCell.y] !== '') return;
	workingArray[currentActiveTableCell.x].splice(currentActiveTableCell.y, 1);
	workingArray = padArray(workingArray);
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
		let col = evt.target.cellIndex;
		if (col > 1) col = 1;
		currentActiveTableCell = {x:col, y:row};
		redrawTable();
	}
	
	const myTable = document.getElementById('result');
	const tds = myTable.querySelectorAll('td');
	
	tds.forEach(td => td.addEventListener('click', onCellClick));
}

const flagRow = () => {
	if (currentTableContents[currentActiveTableCell.y][2] === '*') currentTableContents[currentActiveTableCell.y][2] = '';
	else {
		currentTableContents[currentActiveTableCell.y][2] = '*';
		currentTableContents = padArray(currentTableContents);
	}
}

const shunt = up => {
	let workingArray = transpose([...currentTableContents]);
	let nonEmptyCellIndex;
	if (up){
		for (let i = currentActiveTableCell.y; i > 0; i--){
			if (workingArray[currentActiveTableCell.x][i] !== ""){
				nonEmptyCellIndex = i;
				break;
			}
		}
	} else{
		for (let i = currentActiveTableCell.y; i < workingArray[currentActiveTableCell.x].length; i++){
			if (workingArray[currentActiveTableCell.x][i] !== ""){
				nonEmptyCellIndex = i;
				break;
			}
		}
	}
	const startLookingForEmptyCellsHere = nonEmptyCellIndex ?? currentActiveTableCell.y;
	const emptyCellIndex = up ? workingArray[currentActiveTableCell.x].lastIndexOf("", startLookingForEmptyCellsHere) : workingArray[currentActiveTableCell.x].indexOf("", startLookingForEmptyCellsHere);

	if (emptyCellIndex === undefined || emptyCellIndex === -1) return;
	const deleted = workingArray[currentActiveTableCell.x].splice(emptyCellIndex, 1);
	workingArray[currentActiveTableCell.x].splice(currentActiveTableCell.y, 0, '');
	if (!deleted.every(x=>x === '') || deleted.length !== 1) {
		console.error("Aargh might havetried to delete something!");
		return;
	}
	
	workingArray = padArray(workingArray);
	currentTableContents = transpose(workingArray);
}

const goBack = () => {
	if (!(currentSentenceIndex > 1)) return;
	currentSentenceIndex--;
	currentTableContents = cachedCompletedUnformattedSentences.pop();	
}
