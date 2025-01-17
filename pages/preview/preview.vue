<template>
	<view class="preview" v-if="currentInfo">

		<swiper circular :current="currentIndex" @change="swiperChange">
			<swiper-item v-for="(item,index) in classList" :key="item._id">
				<image v-if="readImgs.includes(index)" @click="maskChange" :src="item.picurl" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<!-- //遮罩层 -->
		<view class="mask" v-if="maskIsShow">
			<view @click="goback" class="goback" :style="{top:getStatusBarHeight() + 'px'}">
				<uni-icons type="left" size="20" #fff></uni-icons>
			</view>
			<view class="count">{{currentIndex + 1}} / {{classList.length}}
			</view>
			<view class="time">
				<uni-dateformat :date="Date.now()" format="hh:mm"></uni-dateformat>
			</view>
			<view class="date">
				<uni-dateformat :date="Date.now()" format="yyyy年MM月dd日"></uni-dateformat>
			</view>
			<view class="footer">

				<!-- 一开始考虑的太复杂,害怕影响样式.考虑了 透明按钮 覆盖 -->
				<!-- <button @click="openPopup" class="openPopup"></button> -->
				<!-- <uni-popup ref="popup" type="bottom" background-color="#fff">底部弹出 Popup</uni-popup> -->

				<view @click="openInfoPopup" class="box">
					<!-- 直接给信息box添加事件 -->
					<uni-icons type="info" size="25"></uni-icons>
					<view class="text">
						信息
					</view>
				</view>
				<view class="box" @click="openScorePopup">
					<uni-icons type="star" size="25"></uni-icons>
					<view class="text">
						{{currentInfo.score}}分
					</view>
				</view>
				<view class="box" @click="clickDownLoad">
					<uni-icons type="download" size="25"></uni-icons>
					<view class="text">
						下载
					</view>
				</view>
			</view>
		</view>

		<!-- //壁纸信息弹窗 -->
		<uni-popup @click="openInfoPopup" ref="infoPopup" type="bottom">
			<view class="infoPopup">
				<view class="popHeader">
					<view class="null">

					</view>
					<view class="title">
						壁纸信息
					</view>
					<view class="close" @click="closeInfoPopup">
						<uni-icons type="closeempty" size="25" color="#999"></uni-icons>
					</view>
				</view>
				<scroll-view scroll-y="true">
					<view class="content">
						<view class="row">
							<view class="label">
								壁纸ID:
							</view>
							<text selectable class="value">{{currentInfo._id}}</text>
						</view>

						<!-- 	<view class="row">
							<view class="label">分类：</view>
							<text class="value class">明星美女</text>
						</view> -->

						<view class="row">
							<view class="label">发布者：</view>
							<text class="value">{{currentInfo.nickname}}</text>
						</view>

						<view class="row">
							<text class="label">评分：</text>
							<view class='value roteBox'>
								<uni-rate readonly touchable :value="currentInfo.score" size="16" />
								<text class="score">{{currentInfo.score}}分</text>
							</view>
						</view>

						<view class="row">
							<text class="label">摘要：</text>
							<view class='value'>
								{{currentInfo.description}}
							</view>
						</view>

						<view class="row">
							<text class="label">标签：</text>
							<view class='value tabs'>
								<view class="tab" v-for="tab in currentInfo.tabs" :key="tab">
									{{tab}}
								</view>
							</view>
						</view>

						<view class="copyright">
							声明：本图片来用户投稿，非商业使用，用于免费学习交流，如侵犯了您的权益，您可以拷贝壁纸ID举报至平台，邮箱861823930@qq.com，管理将删除侵权壁纸，维护您的权益。

						</view>
						<view class="safe-area-inset-bottom">

						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>

		<!-- //评分弹窗 -->
		<uni-popup ref="scorePopup" type="center" :is-mask-click="false">
			<view class="scorePopup">
				<view class="popHeader">
					<view class="null">

					</view>
					<view class="title">
						{{isScore?'已经评分过了~':'壁纸评分'}}
					</view>
					<view class="close" @click="closeScorePopup">
						<uni-icons type="closeempty" size="25" color="#999"></uni-icons>
					</view>
				</view>
				<view class="content">
					<uni-rate v-model="userScore" allow-half="true" :disabled="isScore" disabledColor="#FFCA3E" />
					<text class="text">{{userScore}}分</text>
				</view>
				<view class="footer">
					<button @click="submitScore" :disabled="!userScore||isScore" type="default" size="mini"
						plain>确认评分</button>
				</view>

			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';

	import {
		getStatusBarHeight

	} from "@/utils/system.js"

	import {
		onLoad,
		onUnload,
		onShareAppMessage,
		onShareTimeline
	} from "@dcloudio/uni-app"
	import {
		apiGetSetupScore,
		apiWriteDownload,
		apiDetailWall
	} from "@/api/apis.js"

	const infoPopup = ref(null) //先定义ref数据拿到弹窗状态然后再绑定点击事件
	const scorePopup = ref(null) //先定义ref数据拿到弹窗状态然后再绑定点击事件
	const userScore = ref(0)
	const maskIsShow = ref(true)
	const classList = ref([]);
	const currentId = ref(null);
	const currentIndex = ref(0);
	const readImgs = ref([]);
	const currentInfo = ref(null);
	const isScore = ref(false);



	const storgClassList = uni.getStorageSync("storgClassList") || [];
	// 替换缩略图为高清图片
	classList.value = storgClassList.map(item => {
		return {
			...item,
			picurl: item.smallPicurl.replace("_small.webp", ".jpg")
		}
	})

	onLoad(async (e) => {
		currentId.value = e.id;
		if (e.type == 'share') {
			let res = await apiDetailWall({
				id: currentId.value
			})
			classList.value = res.data.map(item => {
				return {
					...item,
					picurl: item.smallPicurl.replace("_small.webp", ".jpg")
				}
			})
		}
		currentIndex.value = classList.value.findIndex(item => {
			return item._id == currentId.value
		})
		currentInfo.value = classList.value[currentIndex.value]
		readImgsFun();
	})

	const swiperChange = (e) => {
		currentIndex.value = e.detail.current;
		currentInfo.value = classList.value[currentIndex.value]
		readImgsFun();
	}


	//返回上一页
	const goback = () => {
		uni.navigateBack({
			success: () => {

			},
			fail: (err) => {
				uni.reLaunch({
					url: "/pages/index/index"
				})
			}
		})
	}

	// 遮罩层显示
	const maskChange = () => {
		maskIsShow.value = !maskIsShow.value
	}

	//再写点击事件
	//壁纸信息弹窗
	const openInfoPopup = () => {
		infoPopup.value.open()
	}
	//关闭弹窗:
	const closeInfoPopup = () => {
		infoPopup.value.close()
	} //关闭弹窗:


	//评分弹窗
	const openScorePopup = () => {
		if (currentInfo.value.userScore) {
			isScore.value = true
			userScore.value = currentInfo.value.userScore
		}
		scorePopup.value.open()
	}
	const closeScorePopup = () => {
		scorePopup.value.close()
		userScore.value = 0
		isScore.value = false
	}
	//确认评分
	const submitScore = async () => {
		uni.showLoading({
			title: "加载中..."
		})
		let {
			classid,
			_id: wallId

		} = currentInfo.value
		let res = await apiGetSetupScore({
			classid,
			wallId,
			userScore: userScore.value
		})
		uni.hideLoading()
		if (res.errCode === 0) {
			uni.showToast({
				title: "评分成功",
				icon: "none"
			})
			classList.value[currentIndex.value].userScore = userScore.value;
			uni.setStorageSync("storgClassList", classList.value);
			closeScorePopup();

		}
	}


	function readImgsFun() {
		readImgs.value.push(
			currentIndex.value < 0 ? classList.value.length - 1 : currentIndex.value - 1,
			currentIndex.value,
			currentIndex.value >= classList.value.length - 1 ? 0 : currentIndex.value + 1)
		readImgs.value = [...new Set(readImgs.value)];
	}

	const clickDownLoad = async () => {
		// #ifdef H5
		uni.showToast({
			content: "请长按保存壁纸",
			showCancel: false
		})
		// #endif

		// #ifndef H5
		try {

			uni.showLoading({
				title: "下载中...",
				mask: true
			})
			let {
				classid,
				_id: wallId
			} = currentInfo.value;
			let res = await apiWriteDownload({
				classid,
				wallId
			})
			if (res.errCode != 0) throw res;

			uni.getImageInfo({
				src: currentInfo.value.picurl,
				success: (res) => {
					uni.saveImageToPhotosAlbum({
						filePath: res.path,
						success: (res) => {
							console.log(res);
						},
						fail: (err) => {
							if (err.errMsg == 'saveImageToPhotosAlbum:fail cancel') {
								uni.showToast({
									title: "保存失败,用户取消,请重新下载",
									icon: "none"
								})
								return;
							}
							uni.showModal({
								title: "授权提示",
								content: "需要授权保存相册",
								success: (res) => {
									if (res.confirm) {
										uni.openSetting({
											success: (setting) => {
												console.log(
													setting);
												if (setting
													.authSetting[
														'scope.writePhotoAlbum'
													]) {
													uni.showToast({
														title: "授权成功",
														icon: "none"
													})
												} else {
													uni.showToast({
														title: "授权失败",
														icon: "none"
													})
												}
											}
										})
									}
								},
							})
						},
						complete: () => {
							uni.hideLoading();
						}
					})
				}
			})

		} catch (err) {
			console.log(err);
			uni.hideLoading();
		}
		// #endif
	}

	//分享给好友
	onShareAppMessage((e) => {
		return {
			title: "救兵壁纸,壁纸救兵",
			path: "/pages/preview/preview?id=" + currentId.value + "&type=share"
		}
	})
	//朋友圈
	onShareTimeline(() => {
		return {
			title: "救兵壁纸,壁纸救兵",
			imageUrl: "/static/images/JiuBing",
			query: "id = " + currentId.value + "&type=share"
		}
	})
	onUnload(() => {
		uni.removeStorageSync("strogClassiList")
	})
</script>

<style lang="scss" scoped>
	.preview {
		width: 100%;
		height: 100vh;
		position: relative;

		swiper {
			width: 100%;
			height: 100%;

			image {
				width: 100%;
				height: 100%;
			}
		}



		.mask {
			&>view {
				position: absolute;
				left: 0;
				right: 0;
				margin: auto;
				color: #fff;
				width: fit-content;
			}

			.goback {
				width: 38px;
				height: 38px;
				background: rgba(0, 0, 0, 0.5);
				left: 30rpx;
				margin-left: 0;
				border-radius: 100px;
				top: 0;
				backdrop-filter: blur(10rpx);
				border: 1rpx solid rgba(255, 255, 255, 0.3);
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.count {
				top: 10vh;
				left: 0;
				right: 0;
				margin: auto;
				background-color: rgba(0, 0, 0, 0.3);
				font-size: 28rpx;
				border-radius: 40rpx;
				padding: 8rpx 28rpx;
				backdrop-filter: blur(10rpx);
			}

			.time {
				top: calc(10vh + 80rpx);
				font-size: 140rpx;
				font-weight: 100;
				line-height: 1em;
				text-shadow: 0 4rpx rgba(0, 0, 0, 0.3);
			}

			.date {
				top: calc(10vh + 230rpx);
				text-shadow: 0 4rpx rgba(0, 0, 0, 0.3);
				font-size: 34rpx;
			}

			// .openPopup {
			// 	position: absolute;
			// 	bottom: 0.05vh;
			// 	height: 120rpx;
			// 	left: 20rpx;
			// 	width: 15vw;
			// 	border-radius: 100%;
			// 	opacity: 0;
			// }

			.footer {
				background: rgba(255, 255, 255, 0.3);
				bottom: 10vh;
				width: 65vw;
				height: 120rpx;
				border-radius: 100rpx;

				display: flex;
				align-self: center;
				justify-content: space-around;
				margin: 0 auto;


				box-shadow: 0 2rpx 0 rgba(0, 0, 0, 0.1);
				backdrop-filter: blur(10rpx);

				.box {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					padding: 15rpx;

					.text {
						font-size: 28rpx;
						color: #333;
					}
				}

			}
		}


		.popHeader {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.title {
				color: $band-theme-greycolor2;
			}

			.close {
				padding: 6rpx;
			}
		}

		.infoPopup {
			background: #fff;
			padding: 30rpx;
			border-radius: 30rpx 30rpx 0 0;
			overflow: hidden;



			scroll-view {
				max-height: 60vh;

				.content {
					.row {
						display: flex;
						padding: 16rpx 0;
						font-size: 32rpx;
						line-height: 1.7em;

						.label {
							color: $text-font-color-3;
							width: 140rpx;
							font-size: 30rpx;
							text-align: right;
						}

						.value {
							padding-left: 10rpx;
							flex: 1;
							width: 0;
						}

						.roteBox {
							display: flex;
							align-items: center;

							.score {
								font-size: 26rpx;
								color: $text-font-color-2;
								padding-left: 10rpx;
							}
						}

						.tabs {
							display: flex;
							flex-wrap: wrap; //装不下自动换行

							.tab {
								border: 1px solid $band-theme-purplecolor1;
								color: $band-theme-purplecolor1;
								font-size: 22rpx;
								padding: 10rpx 30rpx;
								border-radius: 40rpx;
								line-height: 1em;
								margin: 0 10rpx 10rpx 0;
							}
						}

						.class {
							color: $band-theme-purplecolor1;
						}
					}

					.copyright {
						font-size: 28rpx;
						padding: 20rpx;
						background: #F6F6F6;
						color: #666;
						border-radius: 10rpx;
						margin: 20rpx 0;
						line-height: 1.6em;
					}
				}
			}
		}

		.scorePopup {
			background: #fff;
			padding: 30rpx;
			border-radius: 30rpx;
			width: 70vw;

			.content {
				padding: 30rpx 0;
				display: flex;
				justify-content: center;
				align-items: center;

				.text {
					color: #fccc42;
					padding-left: 10rpx;
					width: 80rpx;
					lighting-color: 1em;
					text-align: right;
				}

			}

			.footer {
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
</style>