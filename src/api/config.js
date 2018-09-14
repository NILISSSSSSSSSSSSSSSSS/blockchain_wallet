
// export const baseUrl="http://192.168.0.154:5091";

// export const baseUrl="";
export const baseUrl = "https://wallet.accelchain.io";

export const currentVersion = 108; //姜霞以前写的老版本，不用管
export const currentVersionDot = 'v2.2.5'; // 安卓： 上一次的版本号 v1.0.9 //热更新小版本号加一，也就是最后面小数点后面的数字加1，也就是尾号加1，app更新v1改为v2依次累加
export const iosCurrentVersionDot = 'v1.1.0'; // IOS : 上一次的版本号 v1.0.2 热更新小版本号加一，也就是最后面小数点后面的数字加1，也就是尾号加1，app更新v1改为v2依次累加
export var UtcToLocale = function (UTCDateString) {
	if (!UTCDateString) { return '-'; }
	function formatFunc(str) { return str > 9 ? str : '0' + str }
	var date2 = new Date(UTCDateString);     //这步是关键
	var year = date2.getFullYear();
	var mon = formatFunc(date2.getMonth() + 1);
	var day = formatFunc(date2.getDate());
	var hour = formatFunc(date2.getHours());
	var min = formatFunc(date2.getMinutes());
	var sec = formatFunc(date2.getSeconds());
	var dateStr = year + '-' + mon + '-' + day + ' ' + hour + ':' + min + ':' + sec;
	return dateStr
}
