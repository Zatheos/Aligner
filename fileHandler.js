const initFileLoader = () => {
	const myForm = document.getElementById("myForm");
	const csvFile = document.getElementById("csvFile");

	myForm.addEventListener("submit", e => {
		e.preventDefault();
		const input = csvFile.files[0];
		const reader = new FileReader();

		reader.onload = processInputFile;
		reader.readAsText(input);
	});

}

window.onload = initFileLoader;
let superArray = [];
let truth;
let meta;


const processInputFile = e => {
	const text = e.target.result;
	// let workingArray = CSVToArray(text);
	let workingArray = csv2Array(text);
	workingArray = padArray(workingArray);
	workingArray = nestedArray2ObjArray(workingArray);

	const indexOfTruth = workingArray.findIndex(x => x.ResponseId?.toLowerCase()?.trim() === 'truth');
	if (indexOfTruth === -1) {
		console.error("Can't find the truth!");
		return;
	}
	const truthObj = workingArray.splice(indexOfTruth, 1)[0];	
	const indexOfMeta = workingArray.findIndex(x => x.ResponseId?.toLowerCase()?.trim() === 'meta');
	if (indexOfMeta === -1) {
		console.error("Can't find the meta!");
		return;
	}
	const metaObj = workingArray.splice(indexOfMeta, 1)[0];

	truth = truthObj;
	meta = metaObj;
	superArray = workingArray;

	const form = document.getElementById("myForm")
	form.setAttribute("disabled", "disabled");
	form.setAttribute("hidden", "hidden");
	document.getElementById("trangles").style.display = 'none';
	document.getElementById("alternatively").style.display = 'none';

	beginWorkWithNewFile();
};
