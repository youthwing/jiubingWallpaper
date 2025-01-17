<template>
	<view class="themeItem">
		<navigator :url="'/pages/classlist/classlist?id='+item._id+'&name='+item.name" class="box" v-if="!isMore">
			<image class="pic" :src="item.picurl" mode="aspectFill"></image>
			<view class="mask">{{item.name}}</view>
			<view class="tab" v-if="compareTimestamp(item.updateTime)">{{compareTimestamp(item.updateTime)}}前更新</view>
		</navigator>

		<navigator url="/pages/classify/classify" open-type="reLaunch" class="box more" v-if="isMore">
			<image class="pic" src="/common/images/classify2.jpg" mode="aspectFill"></image>
			<view class="mask">
				<uni-icons type="more-filled" size="34" color="#fff"></uni-icons>
				<view class="text">更多</view>
			</view>
		</navigator>
	</view>
</template>

<script setup>
	import {
		compareTimestamp
	} from "@/utils/common.js"
	defineProps({
		isMore: {
			type: Boolean,
			default: false

		},
		item: {
			type: Object,
			default () {
				return {
					name: "默认名称",
					picurl: "/common/images/classify1.jpg",
					updateTime: Date.now() - 1000 * 60 * 60 * 5
				}
			}
		}
	})
</script>

<style lang="scss" scoped>
	.themeItem {
		.box {
			height: 340rpx;
			border-radius: 10rpx;
			overflow: hidden;
			position: relative;

			.pic {
				width: 100%;
				height: 100%;

			}

			.mask {
				width: 100%;
				height: 70rpx;
				font-size: 30rpx;
				position: absolute;
				bottom: 0;
				left: 0;
				background: rgba(0, 0, 0, 0.2);
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center; //居中
				backdrop-filter: blur(5rpx);
				font-weight: 600;
			}

			.tab {
				position: absolute;
				left: 0;
				top: 0;
				background-color: rgba(75, 45, 225, 0.5);
				backdrop-filter: blur(10rpx); //高斯模糊
				color: #eee;
				font-size: 22rpx;
				padding: 6rpx, 14rpx;
				border-radius: 0 0 20rpx 0;
				transform: scale(0.8); //缩放
				transform-origin: left top; //缩放基准位置 左上角为基准
			}
		}

		.box.more {
			.mask {
				width: 100%;
				height: 100%;
				flex-direction: column;
				backdrop-filter: blur(10rpx);
			}

			.text {
				font-size: 26rpx;
			}

		}
	}
</style>