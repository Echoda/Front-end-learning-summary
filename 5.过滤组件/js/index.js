    var personArr = [
    {name: '王港', src: './src/img/3.png', des: '颈椎不好', sex: 'm'}, 
    {name: '刘莹', src: './src/img/5.png',des: '我是谁', sex: 'f'} ,
    {name: '王秀莹', src: './src/img/4.png', des: '我很好看', sex: 'f'} ,
    {name: '刘金雷', src: './src/img/1.png', des: '你没有见过陌生的脸', sex: 'm'}, 
    {name: '刘飞翔', src: './src/img/2.png', des: '瓜皮刘', sex: 'm'}
    ];

    var oUl = document.getElementsByClassName('list')[0].getElementsByTagName('ul')[0];
    var oBtn = document.getElementsByClassName('btn');
    var oBtnArr = [].slice.call(oBtn,0); //伪数组转换为数组
    var oInp = document.getElementsByClassName('filter')[0].getElementsByTagName('input')[0];

    // 创建数据仓库
    var storage = createStorage({
        text:'',
        sex:'a'
    });

    function update () {
        randerPage(lastFilter(personArr));
    }
    // 订阅update函数
    storage.subscribe(update);

	//渲染页面
    function randerPage (data) {
    	var template = ``;
    	data.forEach(function (ele,index) {
    		template += `
				<li>
					<img src="img/${index + 1}.png">
					<span class="name">${ele.name}</span>
					<span class="des">${ele.des}</span>
				</li>
				`
    	})
    	oUl.innerHTML = template;
    }
    randerPage(personArr);

	// 改变按钮样式
    function changeStyle (ele) {
	    var len = oBtn.length;
		for(var i = 0;i < len;i ++){
			oBtn[i].classList.remove('active');
			ele.classList.add('active');
		}
    }

    // 绑定按钮点击事件
    oBtnArr.forEach(function (ele) {
    	ele.onclick = function () {
    		changeStyle(this);
    		storage.dispatch({type: 'sex',value: this.getAttribute('sex')});
    	}
    })

    //防抖
    function debounce (handler, delay) {
        var timer = null;
        return function (e) {
            var _self = this, _arg = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                handler.apply(_self, _arg);
            }, delay);

            // 下面是错误的  this.value this指向window
            // var _arg = arguments;
            // clearTimeout(timer);
            // timer = setTimeout(() => {
            //     handler(_arg);
            // }, delay);
        }
    }

    function deal () {
        // console.log('1');
        console.log(this);
        storage.dispatch({type: 'text', value: this.value})
    }
    // 绑定文本输入事件
    oInp.oninput = debounce(deal, 500);



