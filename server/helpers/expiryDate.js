module.exports = function(minutes) {
	const minute = 60000; // 1m = 6k ms

	const expiryDate = Date.now() + minutes * minute;

	return expiryDate;
};
