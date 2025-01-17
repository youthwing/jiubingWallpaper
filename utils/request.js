const BASE_URL = 'https://tea.qingnian8.com/api/bizhi';
//网络请求放在这个文件里面

export function request(config = {

}) {

	let {
		url,
		data = {},
		method = "GET",
		header = {}
	} = config //解构赋值

	url = BASE_URL + url
	header["access-key"] = "jiubing"
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method,
			header,
			data,
			success: res => {
				if (res.data.errCode === 0) {
					resolve(res.data)
				} else if (res.data.errCode === 400) {
					uni.showModal({
						title: "ERROR",
						content: res.data.errMsg,
						showCancel: false
					})
					reject(res.data)
				} else {
					uni.showToast({
						title: res.data.errMsg,
						icon: "none"
					})
					reject(res.data)
				}
			},
			fail: err => {
				reject(err)
			}
		})
	})
}