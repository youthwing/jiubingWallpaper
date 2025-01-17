<template>
	<view class="box">
		<view class="name">
			<slot name="name"></slot>
		</view>
		<view class="appricate">
			<image src="/common/images/appriacte.jpg" mode="aspectFill"></image>
		</view>
		<view class="hphoto">
			<image src="/common/images/headerphoto.jpg" mode="aspectFill"></image>
		</view>
	</view>
</template>

<script setup>

</script>

<style lang="scss">
	.box {

		padding-left: 30rpx;
		font-size: 36rpx;
		font-weight: 600;


		.appricate {
			width: 100%;
			display: flex;
			align-content: center;
			justify-content: center;
		}

		.hphoto {
			width: 100%;
			display: flex;
			align-content: center;
			justify-content: center;
		}
	}
</style>