
function ajax(url,success) {

	var xhr = new XMLHttpRequest();
	xhr.open('get',url,false);       //false:同步模式,send过程中不会执行下面

	xhr.onreadystatechange = function() {
		//readyState是ajax对象返回的状态码,4:完成,已接收到全部数据,且可以再客户端使用
		if(xhr.readyState == 4 && xhr.status == 200){
			var data = JSON.parse(xhr.responseText);
			success && success(data);
		}
	}
	//若send发送过程超快完成一返回结果,此时onreadystatechange函数未赋值完成,内部就不会执行,
	//所以将send()写在后面
	xhr.send();
}