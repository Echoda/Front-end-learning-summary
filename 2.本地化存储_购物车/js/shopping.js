//购物车数据,要先获取过来
var iShoppingDate = {};

function init() {
	iShoppingDate = JSON.parse(localStorage.getItem('shoppingCar')) || {};
	//创建购物车商品结构
	createSelectedGoodsDom();
	//请求数据创建商品列表
	ajax('js/shoppingData.json',function(data) {
		// console.log(data);
		createGoodsDom(data);
	});
	// 添加商品事件
	addEvent();
}
init();


//创建商品列表
function createGoodsDom(data) {
	var str = '';
	for(var i = 0;i < data.length;i ++){
		//遍历data[i].list,拼接 选择颜色区 结构colorList
		var colorList = ``;
		data[i].list.forEach(function(item) {
			colorList += `<span data-id = '${item.id}'>${item.color}</span>`;
		})
		str += `<tr>
					<td>
						<img src=${data[i].list[0].img}>
					</td>
					<td>
						<p>${data[i].name}</p>
						<div class="color">
							${colorList}
						</div>
					</td>
					<td>${data[i].list[0].price}.00元</td>
					<td>
						<span>-</span>
						<strong>0</strong>
						<span>+</span>
					</td>
					<td>
						<button>加入购物车</button>
					</td>
				</tr>
		`;
	}
	var goodsList = document.querySelector('.products tbody');
	goodsList.innerHTML = str;
}

// 一系列事件
function addEvent(){
	var trs = document.querySelectorAll('.products tr');  //所有行
	for(var i = 0;i < trs.length; i ++){
		action(trs[i],i);      //将trs[i],i作为参数传递，action内部会有异步绑定，闭包问题
	}
}

function action(tr,n) {

	var oSpans = tr.querySelectorAll('.color span'), //同一行中色卡组
		oActiveColor = null,                             //激活状态的色卡span
		oSubBtn = tr.children[3].children[0],         //减按钮
		oAddBtn = tr.children[3].children[2],          //加按钮
		oImg = tr.querySelector('img'),              //图片
		oNum = tr.querySelector('strong'),           //数量
		oCar = tr.querySelector('button');           //加购按钮

// 1.点击颜色事件：选中的颜色具有active样式，图片跟随改变,再次点击样式消失，图片恢复默认
	for(var i = 0;i < oSpans.length;i ++){

		(function (m) { 
			oSpans[i].addEventListener('click', function() {

				for(var j = 0;j < oSpans.length;j ++){  //清除类名
					//若点击的span是正处于active的,就不操作,而是留给下一个三目判断
					oSpans[j].className = this == oSpans[j] && this.className == 'active' ? 'active' : '' ;
				}
				//类名空则添加类名active,类名active则清除
				this.className = this.className ? '' : 'active';
				this.className && (oActiveColor = this);

				//更换图片
				if(!this.className){  // 若类名都为空,回复默认图片
					oImg.src = 'images/img_0' + (n+1) + '-1.png';
				}else {              //类名不为空时
					oImg.src = 'images/img_0' + (n+1) + '-' + (m+1) + '.png';
				}
				// console.log(oImg.src);    //要用attribute取src
			})
		})(i);
	}

// 2.加减按钮事件
	oAddBtn.onclick = function() {
		oNum.innerHTML ++;
	}
	oSubBtn.onclick = function() {
		if(oNum.innerHTML > 0){
			oNum.innerHTML --;
		}else {
			oNum.innerHTML = 0;
		}
	}

// 3.加购按钮事件
	oCar.onclick = function() {
	    var hasColor = false;

	// 判断是否选择颜色和数量
		for(var i = 0;i < oSpans.length;i ++){
			if(oSpans[i].className != '') hasColor = true;
		}
		if(!hasColor){
			alert('请选择颜色');
			return;  //阻断下面代码的执行
		}
		if(oNum.innerHTML == 0){
			alert('请选择数量');
			return;
		}

	//添加本地存储数据,给索引id的数据赋值，而不是整个直接覆盖
		var iId = oActiveColor.dataset.id;  //e.dataset.attr用于获取标签的'data-attr'的值
		// var iNum = parseInt(oNum.innerHTML);
		iShoppingDate[iId] = {
			"id": iId,
			"img": oImg.getAttribute('src'),
			"name": tr.querySelector('p').innerHTML,
			"color": oActiveColor.innerHTML,
			"price": tr.querySelector('td:nth-of-type(3)').innerHTML,
			//同一种商品则在之前的基础上加
			"num": iShoppingDate[iId] && iShoppingDate[iId].num ? (+iShoppingDate[iId].num) + (+oNum.innerHTML) : oNum.innerHTML,
			"time": new Date().getTime()    //时间戳，用于排序
		};
		localStorage.setItem('shoppingCar', JSON.stringify(iShoppingDate));

	// 恢复原始状态
		oNum.innerHTML = 0;
		oImg.src = 'images/img_0' + (n + 1) +'-1.png';
		oActiveColor.className = '';

	//更新购物车商品结构
		createSelectedGoodsDom();
	}
}

//创建购物车商品结构
function createSelectedGoodsDom() {
	var sumPrice = document.querySelector('.selected strong'),
		tbody = document.querySelector('.selected tbody'),
		str = ``,
		sum = 0;

	//ES7里面的方法,获取对象里的所有value，并把取到的内容放到一个数组
	var goods = Object.values(iShoppingDate);
	//排序，是新加购的商品在最前面
	goods.sort(function(a,b){
		return b.time - a.time;
	})
	for(var k in goods) {
		sum += goods[k].num * parseInt(goods[k].price);
		str += `<tr>
						<td>
							<img src=${goods[k].img}>
						</td>
						<td>${goods[k].name}</td>
						<td>${goods[k].color}</td>
						<td>${goods[k].price}</td>
						<td>x${goods[k].num}</td>
						<td>
							<button data-id='${goods[k].id}'>删除</button>
						</td>
					</tr>`;
	}
	sumPrice.innerHTML = sum + '.00元';
	tbody.innerHTML = str;

	//删除按钮绑定事件
	var	delBtns = tbody.querySelectorAll('button');
	//删除dom结构
	for(var i = 0;i < delBtns.length;i ++) {
		var theId = delBtns[i].dataset.id;
		(function(id) {
			delBtns[i].onclick = function() {
				tbody.removeChild(this.parentNode.parentNode);  //删除dom结构
				//更新总价
				sumPrice.innerHTML = (parseInt(sumPrice.innerHTML) - iShoppingDate[id].num * parseInt(iShoppingDate[id].price)) + '.00元';
				//删除存储数据
				delete iShoppingDate[id];
				localStorage.setItem('shoppingCar', JSON.stringify(iShoppingDate));
				// console.log(iShoppingDate);
			}
		})(theId);
	}
}

window.addEventListener('storage',function(e) {
	init();
	//当localStorage变化时，会在其他关联的页面输出
	console.log(e.storageArea);
	console.log(e.url);
})