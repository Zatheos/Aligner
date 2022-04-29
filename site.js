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
	["uh no i don't think so actually my phone line has uh been cut off",
		"Uh, no, I don't think so. Actually, my phone line has been cut to."],
	["we sometimes go and eat together at the steak house he's also a barber there",
		"We sometimes go and eat together at the steak house. He's also a barber there."],
	["right well it could have been somebody from work that i was just giving a lift back maybe",
		"Right. Well, it could have been somebody from work that was just giving a lift back, maybe."],
	["um there's some other shops the uh city tour bus leaves from there as well",
		"Um, some other shops, the, uh, city tour bus leaves from there."],
	["yeah i may have seen him around but i couldn't put a name to a face",
		"Yeah, I may have seen him around, but I couldn't put her name."],
	["and um there's also a boat house but that's obviously that's quite hard to see from there",
		"And, um, there's also beta house, but that's obviously, it's quite hard to see from."],
	["i really don't remember him he may have been at my school but i i can't really remember",
		"I really don't remember him. He may have been at my school, but I, I can't really."],
	["well she hasn't actually passed her test yet actually to be honest but um she's quite environmentally conscious as well",
		"Well, she hasn't actually passed her test yet actually, to be honest, but, um, she's quite environmentally conscious."],
	["um well I try and catch the news normally and uh the weather for the next few days",
		"Um, well, I try and catch the news normally and, uh, the weather for the next few days."],
	["She's oh she's got this adorable poodle uh it's very cute and uh she drives her scooter to work",
		"She's uh, she's got this adorable poodle. Um, it's very cute. And, uh, she drives a scooter to work."],
	["Not exactly I can't really remember their surnames but I might have known them i don't know",
		"Not exactly. I can't remember their names, but I might've named it."],
	["And um on the right there's a big reservoir uh and a a really big yew tree right next to it",
		"And I'm on the right. There's a big reservoir, uh, and, uh, every big nutrient right next."],
	["um she lives on the same street as me and so sometimes we go for a drink after work",
		"Um, she lives in the same street as me and say, sometimes we go for drink."],
	["And then there's a deer park and a there's a boat house on the river",
		"And then there's a diff Huck and, uh, the boat house on the river."],
	["I start at eight o'clock every day and I finish about five o'clock or just past",
		"I start at eight o'clock every day and I finished about five o'clock or just."],
	["Oh I relaxed um watched some tv there was something I wanted to watch on",
		"No I've relaxed. Um, watch some TV. That's something I wanted to watch on."],
	["uh did have a sack of potatoes in front could have been that but um",
		"Uh, did I have a sack of debt is in front, could have been not boats."],
	["I don't know they hire a lot of lot of newcomers it's bit uh cut and chop with staff",
		"Oh, no, the, I R a lot, a lot of newcomers. It's better. Couldn't shut waste."],
	["given him an haircut once or twice when he's come round but not uh not seen him too much",
		"I've given him an accurate once or twice when he's come round, but not to not seeing him to."],
	["Not too much of a social butterfly me you know just go in get me drinks",
		"Not too much of a social butterfly, man, you know, just going get me drinks."],
	["uh can get a bit inebriated sometimes so not all the time no can't say",
		"Uh, can get a bit any Abria it's sometimes not all the time. No, God."],
	["uh just to get a bit of fuel you know some doritos and that",
		"Uh, just about a bit of fuel, you know, some Doritos."],
	["Yeah it's alright it's alright except for when it rains it gets very muddy",
		"Yeah, so, all right. So, all right. So when it rains, it gets very."],
	["Yeah i had me lunch i had uh i had a bit of dessert let me food settle",
		"Yeah, I had a little chatter. I had a bit of dessert, like my favorites."],
	["um he's a tour guide and uh i knew him from secondary school uh we regularly chat on skype",
		"Um, and he's a tour guide and I knew him from secondary school. Uh, my regular chat on Skype."],
	["Okay no not that i'm aware of not that i drove i drive quite a lot on my own",
		"Okay. No, not that I'm aware of. No, but I drew, if I drive quite well on my."],
	["Just a main road um and the city bus tour leaves departs from outside the shop",
		"Just the main word. Um, and the city bus tour Leaves departs from outside the."],
	["I might do but i'm not in enough to recognise faces staff change don't they and",
		"I might do, but I'm not in enough to recognize faces. Staff changed up."],
	["She might do i don't think it's that one i've never seen her there",
		"She might do. I don't think it's that one. I've never seen it."],
	["uh i was but i was on my own just went for a quiet walk",
		"Uh, I lost, but I was on my own swim for the quiet wall."],
	["Ah he does but it's a it's a fairly big place you know you don't run into people that often",
		"I those breaks would be it's a fairly big place. You know, you don't run into people that."],
	["Yeah quarter of an hour half an hour something like that depending on traffic",
		"Yeah, cool. Up an hour, half an hour, depending on truck."],
];

const defaultSelection = { x: 1, y: 1 };
let currentSelection = { ...defaultSelection };
let currentArray = [];

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

const cleanup = str => str.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, "")
	.replace(/\s+/g, " ")
	.trim()
	.split(" ")
	.map(x => removeAccents(x.toLowerCase().trim()));


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
		file1: x?.common ?? x.file1,
		file2: x?.common ?? x.file2
	}));
	console.log("decommoned");
	console.log(decommoned);
	const padded4parity = decommoned.map(x => padObject(x));
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
	addClickTrigger();
}

const getDiffFromInputs = () => {
	currentSelection = { ...defaultSelection };
	let truth = document.getElementById("truth").value;
	let hyp = document.getElementById("hyp").value;
	if (truth === "" && hyp === "") {
		const ind = getRndTo(examples.length - 1);
		truth = examples[ind][0];
		hyp = examples[ind][1];
	}
	console.log("TRUTH: ", truth);
	console.log("HYP: ", hyp);
	currentArray = exportDiff(truth, hyp);
	redrawTable();
}

const CSVToArray = (data, delimiter = ',', omitFirstRow = false) =>
	data
		.slice(omitFirstRow ? data.indexOf('\n') + 1 : 0)
		.split('\n')
		.map(v => v.split(delimiter));
