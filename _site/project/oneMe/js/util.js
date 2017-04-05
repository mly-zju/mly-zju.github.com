var util = {};

util.timeFormat = function(time) {
	var minute;
	var second;
	minute = parseInt(time / 60);
	second = parseInt(time % 60);
	if (minute < 10) {
		minute = '0' + minute;
	}
	if (second < 10) {
		second = '0' + second;
	}
	return minute + ':' + second;
}
