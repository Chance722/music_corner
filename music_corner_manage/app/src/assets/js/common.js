const common = {
	isSupportTouch: () => {
		//判斷是否支持移動端觸屏事件
		var supported = false;
		try{
			document.createEvent('TouchEvent');
			supported = true;
		}catch(e) {}

		return supported;
	},
	runApp: (url,faild,chromeIntent) => {
		var ua = window.navigator.userAgent;
		var isChrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/);
		var isAndroid = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
		var isIOS9 = /OS 9_(\d(_\d)*)/g.test(navigator.appVersion);
		// var timeout = 500;
		var timeout = 5000;
		var timer = null;
		if(url) {
			var t = Date.now();
			var frameId = '__run_app_frame__';
			var frame = document.getElementById(frameId);
			if(!frame){
				frame = document.createElement('iframe');
				frame.id = frameId;
				frame.style.display = 'none';
				frame.style.width = 0;
				frame.style.height = 0;
				document.body.appendChild(frame);
			}
			if(isChrome || isIOS9) {
				if(isAndroid){
					if(chromeIntent && chromeIntent == 'string'){
						window.location.href = chromeIntent;
					} else {
						window.location.href = url;
					}
				}else{
					window.location.href = url;
				}
			} else {
				frame.src = url;
			}
		}
		window.clearTimeout(timer);
		timer = window.setTimeout(function() {
		    if (Date.now() - t < timeout + 100) {
		        if (faild && typeof faild == 'string') {
		            window.location.href = faild;
		        } else if (typeof faild == 'function') {
		            faild();
		        }
		    }
		}, timeout);
	},
	formatDate: (date) => {
		var dateStr = date.getTime();
		var time = new Date(Number(dateStr));
		var y = time.getFullYear();//年
		var m = time.getMonth() + 1;//月
		m>=10?m=m:m='0'+m;
		var d = time.getDate();//日
		d>=10?d=d:d='0'+d;
		var h = time.getHours();//时
		h>=10?h=h:h='0'+h;
		var mm = time.getMinutes();//分
		mm>=10?mm=mm:mm='0'+mm;
		var s = time.getSeconds();//秒
		s>=10?s=s:s='0'+s;
		return (y+"-"+m+"-"+d+" "+h+":"+mm+":"+s);
	},
	formatDate2: (date) => {
		var dateStr = date.getTime();
		var time = new Date(Number(dateStr));
		var y = time.getFullYear();//年
		var m = time.getMonth() + 1;//月
		m>=10?m=m:m='0'+m;
		var d = time.getDate();//日
		d>=10?d=d:d='0'+d;
		var h = time.getHours();//时
		h>=10?h=h:h='0'+h;
		var mm = time.getMinutes();//分
		mm>=10?mm=mm:mm='0'+mm;
		var s = time.getSeconds();//秒
		s>=10?s=s:s='0'+s;
		return (y+"-"+m+"-"+d+" "+h+":"+mm);
	},
	formatDate3: (dateStr) => {
		var time = new Date(Number(dateStr));
		var y = time.getFullYear();//年
		var m = time.getMonth() + 1;//月
		m>=10?m=m:m='0'+m;
		var d = time.getDate();//日
		d>=10?d=d:d='0'+d;
		var h = time.getHours();//时
		h>=10?h=h:h='0'+h;
		var mm = time.getMinutes();//分
		mm>=10?mm=mm:mm='0'+mm;
		var s = time.getSeconds();//秒
		s>=10?s=s:s='0'+s;

		return {
			year: y,
			month: m,
			day: d,
			hour: h,
			minute: mm,
			second: s
		}
	},
	base64Encode: (input) => {
		var rv;
        rv = encodeURIComponent(input);
        rv = unescape(rv);
        rv = window.btoa(rv);
        return rv;
	},
	getUrlParam: () => {
		var url = location.search;
		var theRequest = new Object(); 
		if (url.indexOf("?") != -1) { 
		var str = url.substr(1); 
		var strs = str.split("&"); 
		for(var i = 0; i < strs.length; i ++) { 
			theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
			} 
		} 
		return theRequest; 
	},
	hasClass: (obj,cls) => {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
	},
	removeClass: (obj,cls) => {
		if (common.hasClass(obj, cls)) {  
		        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');  
		        obj.className = obj.className.replace(reg, ' ');  
		    }  
	},
	addClass: (obj,cls) => {
		if (!common.hasClass(obj, cls)) obj.className += " " + cls;  
	}
}

export default common;