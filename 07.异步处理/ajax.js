function ajax({type='get',data,contentType='application/json',url} = {}) {

	return new Promise((resolve,reject) => {
		let xhr;
		if(window.XMLHttpRequest){ //非IE浏览器
			xhr = new XMLHttpRequest();
		}else{  //IE浏览器
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}

		let paras = '';
		for(let k in data){
			paras += k + '=' + data[k] + '&';
		}
		paras = paras.substring(0,paras.length - 1);
		// console.log('paras:',paras);

		if(type == 'get'){
			xhr.open('get',url + '?' + paras);
			xhr.send();
		}else{
			xhr.open('post',url);
			xhr.setRequestHeader('Content-Type', contentType);
			if(contentType == 'application/json'){
				xhr.send(Json.stringify(paras));
			}else{
				xhr.send(paras);
			}
		}

		xhr.onreadystatechange = function(){

			let contentType = xhr.getResponseHeader('Content-Type');
			let result;
			if( contentType.includes('application/json') ){
				result = JSON.parse(xhr.responseText);
			}

			if(xhr.readyState == 4){
				if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
					resolve(result);
				}else{
					reject(xhr.status);
				}
			}
		}

	})
}