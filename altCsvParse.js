const parseRow = function(row) {
  let isInQuotes = false;
  let values = [];
  let val = '';

  for (let i = 0; i < row.length; i++) {
    switch (row[i]) {
      case ',':
        if (isInQuotes) {
          val += row[i];
        } else {
          values.push(val);
          val = '';
        }
        break;

      case '"':
        if (isInQuotes && i + 1 < row.length && row[i+1] === '"') {
          val += '"'; 
          i++;
        } else {
          isInQuotes = !isInQuotes
        }
        break;

      default:
        val += row[i];
        break;
    }
  }

  values.push(val);

  return values;
}

const csv2Array = str => str.split(/\r?\n/).map(parseRow);
