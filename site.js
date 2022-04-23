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

const cleanup = str => str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s+/g, " ").trim().split(" ").map(x => removeAccents(x.toLowerCase().trim()));

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
	const ready4csv = transpose([["truth", ...merged.file1], ["hypothesis", ...merged.file2]]); 
	console.log("ready4csv");
	console.log(ready4csv);
	const csvStuff = arrayToCSV(ready4csv);
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

const test = () => exportDiff("Okay no not that i'm aware of not that i drove  i drive quite a lot on my own  ",
 "Okay. No, not that I'm aware of. No, but I drew, if I drive quite well  on my.")
//test();

const getDiffFromInputs = () => {
	const truth = document.getElementById("truth");
	const hyp = document.getElementById("hyp");
	console.log("TRUTH: ",truth.value);
	console.log("HYP: ", hyp.value);
	exportDiff(truth.value, hyp.value);
}