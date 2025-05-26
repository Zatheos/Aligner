const defaultSelection = { x: 1, y: 1 };
let currentActiveTableCell = { ...defaultSelection };
let currentTableContents = [];

let currentSuperArrayIndex;
let currentSentenceIndex;

const defaultHeaders = ["Participant", "Speaker", "Sentence", "SNR", "WordNo", "Truth", "Hypothesis", "Match", "Grammar", "Flagged"];
let cachedCompletedSentences = [defaultHeaders];
let cachedCompletedUnformattedSentences = [];
let mostRecentDiffStart;

const getRndTo = int => Math.round(Math.random() * int);

const removeAccents = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const padObject = obj => {
	if (obj.file1.length === obj.file2.length) return obj;
	const length = Math.max(obj.file1.length, obj.file2.length);

	return {
		file1: Array.from({ length }, (_, i) => i < obj.file1.length ? obj.file1[i] : ""),
		file2: Array.from({ length }, (_, i) => i < obj.file2.length ? obj.file2[i] : "")
	};
}

const padArray = arr => {
	const length = Math.max(...arr.map(row => row.length));
	return arr.map(row => Array.from({ length }, (_, i) => i < row.length ? row[i] : ''));
}

const arrayToCSV = (arr, delimiter = ',') =>
	arr
		.map(v =>
			v.map(x => (isNaN(x) ? `"${x.replace(/"/g, '""')}"` : x)).join(delimiter)
		)
		.join('\n');

const merge = (...objs) =>
	[...objs].reduce(
		(acc, obj) =>
			Object.keys(obj).reduce((a, k) => {
				acc[k] = acc.hasOwnProperty(k)
					? [].concat(acc[k]).concat(obj[k])
					: obj[k];
				return acc;
			}, {}),
		{}
	);

const transpose = arr => arr[0].map((col, i) => arr.map(row => row[i]));

const cleanup = str => str.replace(/[.,\/#!?$%\^&\*;:{}=\_`~]/g, "")
	.replace(/\s+/g, " ")
	.trim()
	.split(" ")
	.map(x => removeAccents(x.toLowerCase().trim()))
	.join(" ");


const createTable = arr => {
	const table = document.createElement('table');
	table.setAttribute("id", "result");
	const tableBody = document.createElement('tbody');
	if (currentActiveTableCell.x > 1) currentActiveTableCell.x = 1
	if (currentActiveTableCell.y > arr.length) currentActiveTableCell.y = arr.length - 1;

	arr.forEach((rowData, index) => {
		const row = document.createElement('tr');
		if (rowData[0] === "" || rowData[1] === "") row.classList.add("ablank");
		else if (rowData[0].replace(/[.,\[\]'-\/#!?$%\^&\*;:{}=\_`~()]/g, "") !== rowData[1].replace(/[.,\[\]'-\/#!?$%\^&\*;:{}=\_`~()]/g, "")) {
			row.classList.add("mismatch");
		}
		rowData.forEach((cellData, ind2) => {
			const cell = document.createElement(index === 0 ? 'th' : 'td');
			if (index === currentActiveTableCell.y && ind2 === currentActiveTableCell.x) cell.setAttribute("id", "active");
			cell.appendChild(document.createTextNode(cellData));
			row.appendChild(cell);
		});
		tableBody.appendChild(row);
	});

	table.appendChild(tableBody);
	return table;
}

const exportDiff = (string1, string2) => {
	const file1mod = cleanup(string1);
	const file2mod = cleanup(string2);
	// if the hypothesis is [blank], then put it at the top and skip the rest.
	if (file2mod === "[blank]") return transpose(padArray([["Truth", ...file1mod.split(" ")], ["Hypothesis", "[blank]"]]));
	const res = Diff["diffWords"](file1mod, file2mod);
	const decommoned = res.map(x => ({
		file1: x.added ? "" : x.value.split(" "),
		file2: x.removed ? "" : x.value.split(" ")
	}));
	const exceptionsHandled = handleExceptions(decommoned);
	const moreAligned = makeDelAndInsAligned(exceptionsHandled);
	const padded4parity = moreAligned.map(x => padObject(x));
	const merged = merge(...padded4parity);
	mostRecentDiffStart = merged.file2.reduce((total, x) => (x === "" ? total : total + 1), 0);
	const ready4csv = transpose([["Truth", ...merged.file1], ["Hypothesis", ...merged.file2]]);
	return ready4csv;
}

const handleExceptions = arr => {
	for (let i = 0; i < arr.length; i++) {
		// for any hyphens, append to the end of the previous word
		const thisItem = arr[i];
		if (thisItem.file2 === "-" && i > 0) {
			thisItem.file2 = "";
			arr[i - 1].file2 += "-";
		}
		// for any square brackets, append them to the start or end of the nearest word
		else if (thisItem.file2 === "[" && i < arr.length - 2) {
			thisItem.file2 = "";
			arr[i + 1].file2 = "[" + arr[i + 1].file2;
		}
		else if (thisItem.file2 === "]" && i > 0) {
			thisItem.file2 = "";
			arr[i + 1].file2 += "]";
		}
	}
	return arr;
}
const combineCellWithLineAbove = () => {
	currentTableContents[currentActiveTableCell.y-1][currentActiveTableCell.x] += currentTableContents[currentActiveTableCell.y][currentActiveTableCell.x];
	currentTableContents[currentActiveTableCell.y][currentActiveTableCell.x] = "";
}

const makeDelAndInsAligned = arr => {
	let memory = {type: null, idx: null, length: null}
	for (let i = 0; i < arr.length; i++) {
		const thisItem = arr[i];
		let itemType;
		// if (thisItem.file1 === thisItem.file2) itemType = "match";
		if ((thisItem.file1.length === thisItem.file2.length) && (typeof(thisItem.file1) === typeof(thisItem.file2))) itemType = "match";
		else if (thisItem.file1 === "") itemType = "ins";
		else if (thisItem.file2 === "") itemType = "del";
		else console.error("WTF");

		if (itemType === "match") memory = {type: null, idx: null, length: null};
		else {
			if (memory.type === itemType) memory.length++;
			else {
				if (memory.type === null) memory = {type: itemType, idx: i, length: 1};
				else {
					const rememberedRow = arr[memory.idx];
					if (rememberedRow.file1 !== "" && itemType === "del") console.error("Aargh");
					else if (rememberedRow.file2 !== "" && itemType === "ins") console.error("Eerk");
					else {
						if (itemType === "ins"){
							rememberedRow.file2 = thisItem.file2;
							thisItem.file2 = "";
						} else if  (itemType === "del"){
							rememberedRow.file1 = thisItem.file1;
							thisItem.file1 = "";
						} 
						memory.length--;
						memory.idx++;
						if (memory.length < 1)  memory = {type: null, idx: null, length: null};
					}
				}
			}
		}
	}
	return arr;
}

//not referenced anywhere
const retryLastDownload = () => output2Csv(JSON.parse(localStorage.getItem("lastParticipantData")));

const output2Csv = (arr, filename = "my_data.csv") => {
	//probably overkill, but just to protect against cancelled downloads
	localStorage.setItem("lastParticipantData", JSON.stringify(arr));

	if (!filename.endsWith(".csv")) filename+= ".csv";
	const csvStuff = arrayToCSV(arr);
	const csvContent = "data:text/csv;charset=utf-8," + csvStuff;

	const encodedUri = encodeURI(csvContent);
	const link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", filename);
	//document.body.appendChild(link); // Required for FF
	link.click(); 
}

const redrawTable = () => {
	if (currentTableContents.length < 1) return;
	const tableHtml = createTable(currentTableContents);
	document.getElementById("result")?.remove();
	document.getElementById("text-container").appendChild(tableHtml);
	addClickTrigger();
	document.getElementById("active").scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
}

const getDiffExample = () => {
	currentActiveTableCell = { ...defaultSelection };
	const ind = getRndTo(examples.length - 1);
	const truth = examples[ind][0];
	const hyp = examples[ind][1];
	currentTableContents = exportDiff(truth, hyp);
	redrawTable();
}

const CSVToArray = (data, delimiter = ',', omitFirstRow = false) =>
	data
		.slice(omitFirstRow ? data.indexOf('\n') + 1 : 0)
		.split('\n')
		.map(v => v.split(delimiter));

const nestedArray2ObjArray = arr => {
	const [headers,...rows] = arr;
	const res = rows.map(row => {
		const el = headers.reduce((object, header, index) => {
			object[header.trim()] = row[index];
			return object;
		}, {});
		return el;
	});
	return res;
}

const beginWorkWithNewFile = () => {
	if (truth === undefined || meta === undefined || superArray === undefined || superArray.length <= 0){
		console.error("Data not found!");
		return;
	} else { 
		currentSuperArrayIndex = 0;
		const startWith = prompt("Please enter the id of the last record you completed:", loadParticipantId()??"");
		if (startWith == null || startWith == "") {
			//get here if prompt is cancelled
		} else {
			const foundIndex = superArray.findIndex(x=>x.ResponseId === startWith);
			if (foundIndex === -1) {
				if (confirm("Couldn't find that record! Try again?")){
					beginWorkWithNewFile();
					return;
				}
			} else currentSuperArrayIndex = foundIndex + 1;
		}
		startWorkWithNewParticipant();
	}
}
const startWorkWithNewParticipant = () => {
	updateRecordIdDisplay();
	cachedCompletedUnformattedSentences = [];
	//always start with first sentence for a record
	currentSentenceIndex = 1;
	currentActiveTableCell = { ...defaultSelection };
	const thisTruth = truth[currentSentenceIndex];
	const thisHyp = superArray[currentSuperArrayIndex][currentSentenceIndex];
	currentTableContents = exportDiff(thisTruth, thisHyp);
	flagAllIfAppropriate();
	removeSpaces();
	redrawTable();
	updateSentenceIdDisplay();
}

const updateRecordIdDisplay = () => document.getElementById("recordDisplay").innerHTML = "Participant: " + superArray[currentSuperArrayIndex]?.ResponseId;
const updateSentenceIdDisplay = () => document.getElementById("sentenceDisplay").innerHTML = currentSentenceIndex;

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

const startWorkWithNewSentence = () => {
	updateSentenceIdDisplay();
	currentActiveTableCell = { ...defaultSelection };
	const thisTruth = truth[currentSentenceIndex];
	const thisHyp = superArray[currentSuperArrayIndex][currentSentenceIndex];
	currentTableContents = exportDiff(thisTruth, thisHyp);
	flagAllIfAppropriate();
	removeSpaces();
	redrawTable();
}

const moveCurrentTableToCache = () => {
	cachedCompletedUnformattedSentences.push([...currentTableContents]);
}

const flagAllIfAppropriate = () => {
	const workingArray = transpose(currentTableContents);
	if (workingArray[1].filter(x=>x !== '').length === 1){
		for (let i = 1; i < currentTableContents.length; i++) flagRow(i, 4);
		redrawTable();
	}
}

const formatArrayForCsv = (arr, ind) => {
	const [headers, ...keepCells] = arr;
	let count = 0;
	keepCells.map(x=>x.unshift(x[0].length > 0 ? ++count : ''));
	keepCells.forEach(x=>x.unshift(superArray[currentSuperArrayIndex].ResponseId,...meta[ind].trim().split("-")));
	cachedCompletedSentences = [...cachedCompletedSentences, ...keepCells];
}

const sanityCheck = () => {
	return true;
	const wordsNowInHyp = transpose(currentTableContents)[1].reduce((total, x) => (x === "" ? total : total + 1), 0);
	//subtract one here because otherwise we're counting "hypothesis"
	if (wordsNowInHyp - 1 !== mostRecentDiffStart) {
		console.error("Word count mismatch!");
		alert("Word count mismatch! Something may have gone wrong with this record!");
		for (let i = 1; i < currentTableContents.length; i++) flagRow(i);
		redrawTable();
		throw "Word count mismatch! Something may have gone wrong with this record!";
		return false;
	}
	return true;
}

const saveParticipantId = () => localStorage.setItem("participantId", superArray[currentSuperArrayIndex].ResponseId);
const loadParticipantId = () => localStorage.getItem("participantId");