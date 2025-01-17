<template>
	<view class="userlayout pageBg" v-if="userinfo">
		<view :style="{height:getNavBarHeight()+'px'}"></view>
		<view class="userInfo">
			<view class="avatar">
				<image src="@/common/images/headerphoto.jpg" mode="aspectFill"></image>
			</view>
			<view class="ip">{{userinfo.IP}}</view>
			<view class="address">来自于：
				{{ userinfo.address.city || userinfo.address.province || userinfo.address.country}}

			</view>
		</view>
		<view class="section">
			<view class="list">
				<navigator url="/pages/classlist/classlist?name=我的下载&type=download">
					<view class="row">
						<view class="left">
							<uni-icons type="download-filled" size="20"></uni-icons>
							<view class="text">我的下载</view>
						</view>
						<view class="right">
							<view class="text">{{userinfo.downloadSize}}</view>
							<uni-icons type="right" size="15" color="#aaa"></uni-icons>
						</view>
					</view>
				</navigator>

				<navigator url="/pages/classlist/classlist?name=我的评分&type=score">
					<view class="row">
						<view class="left">
							<uni-icons type="star-filled" size="20"></uni-icons>
							<view class="text">我的评分</view>
						</view>
						<view class="right">
							<view class="text">{{userinfo.scoreSize}}</view>
							<uni-icons type="right" size="15" color="#aaa"></uni-icons>
						</view>
					</view>

				</navigator>

				<view class="row lastChild">
					<view class="left">
						<uni-icons type="chatboxes-filled" size="20"></uni-icons>
						<view class="text">联系客服</view>
					</view>
					<view class="right">
						<view class="text"></view>
						<uni-icons type="right" size="15" color="#aaa"></uni-icons>
					</view>
					<!-- #ifdef MP -->
					<button open-type="contact">联系客服</button>
					<!-- #endif -->
					<!-- #ifndef MP -->
					<button @click="clickContact">拨打电话</button>
					<!-- #endif -->


				</view>
			</view>
		</view>

		<view class="section">
			<view class="list">
				<view class="row">
					<view class="left">
						<uni-icons type="notification-filled" size="25"></uni-icons>
						<view class="text">
							订阅更新
						</view>
					</view>
					<view class="right">
						<view class="text">

						</view>
						<uni-icons type="right" size="15"></uni-icons>
					</view>
				</view>
				<view class="row lastChild">
					<view class="left">
						<uni-icons type="flag-filled" size="25"></uni-icons>
						<view class="text">
							常见问题
						</view>
					</view>
					<view class="right">
						<view class="text">

						</view>
						<uni-icons type="right" size="15"></uni-icons>
					</view>
				</view>
			</view>
		</view>


	</view>

	<view class="loadingLayout" v-else>
		<view :style="{height:getNavBarHeight()+'px'}"></view>
		<uni-load-more status="loading"></uni-load-more>
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue";

	import {
		getNavBarHeight
	} from "@/utils/system.js"

	import {
		apiUserInfo,
	} from "/api/apis.js"

	const userinfo = ref(null);

	const clickContact = () => {
		uni.makePhoneCall({
			phoneNumber: '19839958798'
		});
	}
	const getUserInfo = () => {
		apiUserInfo().then(res => {
			// console.log(res);
			userinfo.value = res.data
		})
	}
	getUserInfo();
</script>

<style lang="scss" scoped>
	.userlayout {
		.userInfo {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			padding: 50rpx 0;

			.avatar {
				width: 160rpx;
				height: 160rpx; //给头像区域设置宽高
				border-radius: 50%; //圆形
				overflow: hidden; //一定要加,不然头像会覆盖在上面

				image {
					width: 100%;
					height: 100%; //设置图片宽高,显示完整
				}
			}

			.ip {
				font-size: 44rpx;
				color: #333;
				padding: 20rpx 0 5rpx
			}

			.address {
				font-size: 28rpx;
				color: #aaa;
			}

		}


		.section {
			width: 690rpx;
			margin: 50rpx auto;
			border: 1px solid #eee;
			border-radius: 10rpx;
			box-shadow: 0 0 30rpx rgba(0, 0, 0, 0.05);

			.list {
				.row {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 30rpx;
					height: 100rpx;
					border-bottom: 1px solid #eee;
					position: relative;
					background: #fff;



					.left {
						display: flex;
						align-items: center;

						:deep() {
							.uni-icons {
								color: $band-theme-purplecolor2 !important;
							}
						}

						.text {
							padding-left: 20rpx;
							color: #666
						}
					}

					.right {
						display: flex;
						align-items: center;

						.text {
							font-size: 28rpx;
							color: #aaa;

						}
					}

					button {
						position: absolute;
						top: 0;
						left: 0;
						height: 100rpx;
						width: 100%;
						opacity: 0;
					}
				}

				.row .lastChild {
					border-bottom: 0
				}
			}
		}
	}
</style>


<!-- $band-theme-purplecolor2 !important -->