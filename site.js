const examples = [
	[
		"uh no i don't think so actually my phone line has uh been cut off       ",
		"Uh, no, I don't think so. Actually, my phone line has  been cut to."
	],
	[
		"um there's some other shops the uh city tour bus leaves from there as well       ",
		"Um,  some other shops, the, uh, city tour bus leaves from there."
	],
	[
		"uh did  have a sack of potatoes  in front could have been that but um     ",
		"Uh, did I have a sack of debt is in front, could have been not boats."
	],
	[
		"I don't know they hire  a lot of lot of newcomers it's bit uh cut and chop with staff  ",
		"Oh,  no, the, I R a lot, a lot of newcomers. It's better.  Couldn't  shut waste."
	],
	[
		"Okay no not that i'm aware of not that i drove  i drive quite a lot on my own  ",
		"Okay. No, not that I'm aware of. No, but I drew, if I drive quite well  on my."
	],
];

const defaultSelection = {x:1, y:1};
let currentSelection = {...defaultSelection};
let currentArray = [];

const getRndTo = int => Math.round(Math.random() * int);

const removeAccents = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const padArray = obj => {
	if (obj.file1.length === obj.file2.length) return obj;
	const length = Math.max(obj.file1.length, obj.file2.length);

  return {
		file1: Array.from({length}, (_, i) => i < obj.file1.length ? obj.file1[i] : ""),
		file2: Array.from({length}, (_, i) => i < obj.file2.length ? obj.file2[i] : "")
	}; 
}

const arrayToCSV = (arr, delimiter = ',') =>
  arr
    .map(v =>
      v.map(x => (isNaN(x) ? `"${x.replace(/"/g, '""')}"` : x)).join(delimiter)
    )
    .join('\n');

const padded2 = obj => {
	if (obj.file1.length === 0) obj.file1.push("");
	if (obj.file2.length === 0) obj.file2.push("");
	return obj;
}

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

const cleanup = str => str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
													.replace(/\s+/g, " ")
													.trim()
													.split(" ")
													.map(x => removeAccents(x.toLowerCase().trim()));


const makeTableHTML= myArray => {
	let result = "<table border=1>";
	for (let i = 0; i < myArray.length; i++) {
			result += "<tr>";
			for (let j = 0; j < myArray[i].length; j++){
					result += i === 0 ? "<th>" + myArray[i][j] + "</th>" : "<td>" + myArray[i][j] + "</td>";
			}
			result += "</tr>";
	}
	result += "</table>";

	return result;
}

const createTable = arr => {
  const table = document.createElement('table');
	table.setAttribute("id", "result");
  const tableBody = document.createElement('tbody');

  arr.forEach((rowData, index) => {
    const row = document.createElement('tr');
		if (rowData[0] !== rowData[1]) row.classList.add("mismatch");
    rowData.forEach((cellData, ind2) => {
      const cell = document.createElement(index === 0 ? 'th' : 'td');
			if (index === currentSelection.y && ind2 === currentSelection.x) cell.setAttribute("id", "active");
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

	console.log("file1");
	console.log(file1mod);
	console.log("file2");
	console.log(file2mod);

	const res = diff(file1mod, file2mod);
	console.log("initial");
	console.log(res);

	const decommoned = res.map(x => ({
		file1: x?.common??x.file1,
		file2: x?.common??x.file2
	}));
	console.log("decommoned");
	console.log(decommoned);
	const padded4parity = decommoned.map(x => padArray(x));
	console.log("padded4parity");
	console.log(padded4parity);
	const merged = merge(...padded4parity);
	console.log("merged");
	console.log(merged);
	const ready4csv = transpose([["Truth", ...merged.file1], ["Hypothesis", ...merged.file2]]); 
	console.log("ready4csv");
	console.log(ready4csv);

	return ready4csv;
}

const output2Csv = arr => {
	const csvStuff = arrayToCSV(arr);
	console.log("csvStuff");
	console.log(csvStuff);
	const csvContent = "data:text/csv;charset=utf-8," + csvStuff;

	const encodedUri = encodeURI(csvContent);
	const link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "my_data.csv");
	//document.body.appendChild(link); // Required for FF

	link.click(); // This will download the data file named "my_data.csv".
	console.log("#####################");
}

const redrawTable = () => {
	const tableHtml = createTable(currentArray);
	document.getElementById("result")?.remove();
	document.getElementById("text-container").appendChild(tableHtml);
}

const getDiffFromInputs = () => {
	currentSelection = {...defaultSelection};
	let truth = document.getElementById("truth").value;
	let hyp = document.getElementById("hyp").value;
	if (truth === "" && hyp === "") {
		const ind = getRndTo(examples.length - 1);
		truth = examples[ind][0];
		hyp = examples[ind][1];
	}
	console.log("TRUTH: ",truth);
	console.log("HYP: ", hyp);
	currentArray = exportDiff(truth, hyp);
	redrawTable();
}
