
function startMove (dom,obj,callback) {
    // console.log('move');

    clearInterval(dom.timer); //先清除定时器
    var iSpeed = 0,
        iCur = 0;

    dom.timer = setInterval(function () {
    	var bStop = true;
    	for(var attr in obj){

        	iCur = parseFloat(getStyle(dom,attr));

        	if(attr == 'opacity'){
        		iSpeed = ( obj[attr] * 100 -  iCur * 100 )/8 ;

        	}else{
            	iSpeed = (obj[attr] - iCur )/8;
            	iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed); 

        	}          
            if( iCur !== obj[attr]){
            	bStop = false;       //有一项未满足都不会停止定时器

            	if(attr == 'opacity'){
            		dom.style[attr] = ( parseInt( iCur * 100 + iSpeed ) )/100;
            		
            	}else {
                    dom.style[attr] = iCur + iSpeed + 'px';
            	}
            }
    	}
        if(bStop){
        	clearInterval(dom.timer);
        	callback && callback();
        }
    },30)
    
    // console.log(dom.offsetLeft);
}

//获取样式
function getStyle (dom,attr) {      //结果为string类型
	return window.getComputedStyle(dom,null)[attr] || dom.currentStyle[attr];
}