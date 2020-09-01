//按性别筛选
function filterBySex (data,_sex) {
	if(_sex == 'a'){
		return data;
	}
	return data.filter(function (ele,index) {
		return ele.sex.indexOf(_sex) != -1;
	})
}