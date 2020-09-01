function createStorage (initState) {
	var state = initState || {};
	var list = [];                      //订阅的函数列表
	return {
		getState: function (type) {      //获取对应状态值
			return state[type];
		},
		dispatch: function (action) {     // 将状态改变映射到state，并执行功能函数
			state[action.type] = action.value;  // action:{type:'text',value: '王'}
			list.forEach(function (ele) { ele() });  //执行订阅的函数
		},
		subscribe: function (func) {     //订阅函数
			list.push(func);
		}
	}
}

// var storage = createStorage({
//     text:'',
//     sex:'a'
// });
// storage.getState('text');
// storage.dispatch({type:'text',value: '王'});