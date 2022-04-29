const initFileLoader = () => {
	const myForm = document.getElementById("myForm");
	const csvFile = document.getElementById("csvFile");

	myForm.addEventListener("submit", function (e) {
		e.preventDefault();
		const input = csvFile.files[0];
		const reader = new FileReader();

		reader.onload = e => {
			const text = e.target.result;
			let workingArray = CSVToArray(text);
			console.log(workingArray);
			workingArray = padArray(workingArray);
			console.log(workingArray);
			workingArray = nestedArray2ObjArray(workingArray);
			console.log(workingArray);

			const indexOfTruth = workingArray.findIndex(x => x.ResponseId?.toLowerCase()?.trim() === 'truth');
			if (indexOfTruth === -1) {
				console.error("Can't find the truth!");
				return;
			}
			const truthObj = workingArray.splice(indexOfTruth, 1)[0];
			console.log(truthObj);
			
			const indexOfMeta = workingArray.findIndex(x => x.ResponseId?.toLowerCase()?.trim() === 'meta');
			if (indexOfMeta === -1) {
				console.error("Can't find the meta!");
				return;
			}
			const metaObj = workingArray.splice(indexOfTruth, 1)[0];
			console.log(metaObj);
			

			truth = truthObj;
			meta = metaObj;
			superArray = workingArray;
		};

		reader.readAsText(input);
	});

}

window.onload = initFileLoader;
let superArray = [];
let truth;
let meta;

const nestedArray2ObjArray = arr => {
	const [headers,...rows] = arr;
	const res = rows.map(row => {
		const el = headers.reduce((object, header, index) => {
			object[header] = row[index];
			return object;
		}, {});
		return el;
	});
	return res;
}