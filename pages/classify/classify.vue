<template>
	<view class="classlayout pageBg">
		<custom-navBar title="分类"></custom-navBar>
		<view class="classify">
			<theme-item v-for="item in classifyList" :key="item._id" :item="item"></theme-item>
		</view>
	</view>
</template>

<script setup>
	import {
		apiGetClassify
	} from "@/api/apis.js";
	import {
		onShareAppMessage,
		onShareTimeline
	} from "@dcloudio/uni-app"
	import {
		ref
	} from "vue";
	const classifyList = ref([]);
	const getClassify = async () => {
		let res = await apiGetClassify({
			// select: true,
			pageSize: 15
		});
		classifyList.value = res.data
		// console.log(res);
	}
	getClassify();

	onShareAppMessage((e) => {
		return {
			title: "救兵壁纸,壁纸救兵",
			path: "/pages/classify/classify"
		}
	})
	//朋友圈
	onShareTimeline(() => {
		return {
			title: "救兵壁纸,壁纸救兵",
			imageUrl: "/static/images/JiuBing",
		}
	})
</script>

<style lang="scss" scoped>
	.classlayout {
		.classify {
			padding: 30rpx;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 15rpx;
		}
	}
</style>