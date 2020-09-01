//按关键词筛选
function filterByText (data,_text) {
	if(!_text){      //input的value值为string类型
		return data;
	}
	return data.filter(function (ele) {
		return ele.name.indexOf(_text) != -1;
	})
}