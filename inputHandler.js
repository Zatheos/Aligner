
const keyhandler = e => {
	if (currentTableContents?.length < 1) return;
	switch (e.code) {
		case 'ArrowUp':
			if (currentActiveTableCell.y > 1) {
				currentActiveTableCell.y--;
				updateHighlightedCell();
				e.preventDefault();
			}
		break;
		case 'ArrowDown':
			if (currentActiveTableCell.y < currentTableContents.length - 1) {
				currentActiveTableCell.y++;
				updateHighlightedCell();
				e.preventDefault();
			}
		break;
		case 'ArrowLeft':
			if (currentActiveTableCell.x > 0) {
				currentActiveTableCell.x--;
				updateHighlightedCell();
				e.preventDefault();
			}
		break;
		case 'ArrowRight':
			if (currentActiveTableCell.x < 1) {
				currentActiveTableCell.x++;
				updateHighlightedCell();
				e.preventDefault();
			}
		break;
		case 'KeyA':
			insertCell(true);
			redrawTable();
		break;
		case 'KeyB':
			insertCell();
			redrawTable();
		break;
		case 'KeyX':
			deleteCell();
			redrawTable();
		break;
		case 'KeyF':
			flagRow(undefined, 4);
			redrawTable();
		break;
		case 'KeyC':
			combineCellWithLineAbove();
			redrawTable();
		break;
		case 'KeyM':
			flagRow();
			redrawTable();
		break;
		case 'KeyG':
			flagRow(undefined, 3);
			redrawTable();
		break;
		case 'KeyU':
			shunt(true);
			redrawTable();
		break;
		case 'KeyD':
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
		case 'KeyR':
			undo.fullReset();
			redrawTable();
		break;
		case 'KeyZ':
			undo.revert();
			redrawTable();
		break;
		case 'Enter':
		case 'NumpadEnter':
			confirmThisSentenceAndGoNext();
			redrawTable();
			e.preventDefault();
		break;
	}
}
document.addEventListener('keydown', keyhandler);

const updateHighlightedCell = () => {
	document.getElementById("active").setAttribute("id", "");
	document.getElementById("result").querySelectorAll("tr")[currentActiveTableCell.y].querySelectorAll("td")[currentActiveTableCell.x].setAttribute("id", "active");
	document.getElementById("active").scrollIntoView({behavior: "instant", block: "center", inline: "nearest"});
}

const insertCell = above => {
	undo.add();
	let workingArray = transpose([...currentTableContents]);
	workingArray[currentActiveTableCell.x].splice(currentActiveTableCell.y + (above ? 0 : 1), 0, '');
	workingArray = padArray(workingArray);
	currentTableContents = transpose(workingArray);
}

const deleteCell = () => {
	undo.add();
	let workingArray = transpose([...currentTableContents]);
	if (workingArray[currentActiveTableCell.x][currentActiveTableCell.y] !== '') return;
	workingArray[currentActiveTableCell.x].splice(currentActiveTableCell.y, 1);
	workingArray = padArray(workingArray);
	currentTableContents = transpose(workingArray);
}

const removeSpaces = () => {
	undo.add();
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
		updateHighlightedCell();
	}
	
	const myTable = document.getElementById('result');
	const tds = myTable.querySelectorAll('td');
	
	tds.forEach(td => td.addEventListener('click', onCellClick));
}

const flagRow = (rowNumber = currentActiveTableCell.y, col = 2) => {
	undo.add();
	if (currentTableContents[rowNumber][col] === '*') currentTableContents[rowNumber][col] = '';
	else {
		currentTableContents[rowNumber][col] = '*';
		for (let i = col - 1; i > 1; i--)	currentTableContents[rowNumber][i] ??= ''; 
	}
	if (currentTableContents[0][2] === '' || currentTableContents[0][3] === '' || currentTableContents[0][4] === '' ||
			currentTableContents[0][2] === undefined || currentTableContents[0][3] === undefined || currentTableContents[0][4] === undefined) {
		currentTableContents[0][2] = 'M';
		currentTableContents[0][3] = 'G';
		currentTableContents[0][4] = 'F';
	}
	currentTableContents = padArray(currentTableContents);
}

const shunt = up => {
	undo.add();
	let workingArray = transpose([...currentTableContents]);
	let nonEmptyCellIndex;
	if (up){
		i = currentActiveTableCell.y;
		while (nonEmptyCellIndex === undefined && i > 0){
			if (workingArray[currentActiveTableCell.x][i] !== "") nonEmptyCellIndex = i;
			else i--;
		}
	} else{
		i = currentActiveTableCell.y;
		while (nonEmptyCellIndex === undefined && i < workingArray[currentActiveTableCell.x].length){
			if (workingArray[currentActiveTableCell.x][i] !== "") nonEmptyCellIndex = i;
			else i++;
		}
	}
	const startLookingForEmptyCellsHere = nonEmptyCellIndex ?? currentActiveTableCell.y;
	const emptyCellIndex = up ? 
		workingArray[currentActiveTableCell.x].lastIndexOf("", startLookingForEmptyCellsHere) : 
		workingArray[currentActiveTableCell.x].indexOf("", startLookingForEmptyCellsHere);

	if (emptyCellIndex === undefined || emptyCellIndex === -1) return;
	const deleted = workingArray[currentActiveTableCell.x].splice(emptyCellIndex, 1);
	workingArray[currentActiveTableCell.x].splice(currentActiveTableCell.y, 0, '');
	if (!deleted.every(x => x === '') || deleted.length !== 1) {
		console.error("Aargh! Might have tried to delete something! Doing nothing instead.");
		return;
	}
	
	workingArray = padArray(workingArray);
	currentTableContents = transpose(workingArray);
}

const goBack = () => {
	if (!(currentSentenceIndex > 1)) return;
	currentSentenceIndex--;
	currentTableContents = cachedCompletedUnformattedSentences.pop();	
	startWorkWithNewSentence();
}

const combineCellWithLineAbove = () => {
	undo.add();
	currentTableContents[currentActiveTableCell.y-1][currentActiveTableCell.x] += currentTableContents[currentActiveTableCell.y][currentActiveTableCell.x];
	currentTableContents[currentActiveTableCell.y][currentActiveTableCell.x] = "";
}

const undoBuffer = () => {
	let record = [];
	return {
		add: () => record.push(currentTableContents.map(x=>[...x])),
		revert: () => {
			currentTableContents = record.pop()??currentTableContents;
		},
		fullReset: () => {
			if (confirm("Are you sure you want to revert ALL changes to this record?"))
			{	
				currentTableContents = record[0]??currentTableContents;
				record = [];
			};
		},
		blank: () => record = []
	}
}
const undo = undoBuffer();



const confirmThisSentenceAndGoNext = () => {
	if (superArray.length === 0) {
		//example data case
		if (!sanityCheck()) return;
		output2Csv(currentTableContents, "aligner_example.csv");
		document.getElementById("result").remove();
		currentTableContents = [];
		return;
	}
	removeSpaces();
	if (!sanityCheck()) return;
	moveCurrentTableToCache();
	currentSentenceIndex++;
	if (superArray[currentSuperArrayIndex][currentSentenceIndex] === undefined){
		//end of this participant - do download
		for (let i = 0; i < cachedCompletedUnformattedSentences.length; i++) formatArrayForCsv(cachedCompletedUnformattedSentences[i], i + 1);
		const desiredFilename = `p${superArray[currentSuperArrayIndex].ResponseId}-exp1-${new Date().toLocaleDateString().replaceAll("\/", "")}`;
		saveParticipantId();
		output2Csv(cachedCompletedSentences, desiredFilename);
		
		if (++currentSuperArrayIndex > superArray.length - 1){
			//no more participants - finished
			currentTableContents = [];
			document.getElementById("recordDisplay").innerHTML = "File completed!";
			document.getElementById("sentenceDisplay").innerHTML = '';
			const form = document.getElementById("myForm")
			form.removeAttribute("disabled");
			form.removeAttribute("hidden");
			document.getElementById("trangles").style.display = 'block';
			document.getElementById("result").remove();
		} else {
			//start with next participant
			cachedCompletedSentences = [defaultHeaders];
			startWorkWithNewParticipant();
		}

	}	else {
		//next sentence for same participant
		startWorkWithNewSentence();
	}
}