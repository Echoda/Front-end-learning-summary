function combineFilterFunc (obj) {
	return function (arr) {
		var lastArr = arr;
		for (var k in obj) {
			lastArr = obj[k](lastArr,storage.getState(k));
		}
		return lastArr;
	}
}
var lastFilter = combineFilterFunc({text: filterByText,sex: filterBySex});