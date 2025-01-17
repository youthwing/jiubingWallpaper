<template>
	<view class="classifylist">
		<view class="loadingLayout" v-if="!classList.length && !noData">
			<uni-load-more status="loading"></uni-load-more>
		</view>
		<view class="content">
			<navigator :url="'/pages/preview/preview?id='+item._id" class="item" v-for="item in classList"
				:key="item._id">
				<image :src="item.smallPicurl" mode="aspectFill"></image>
			</navigator>
		</view>
		<view class="loadingLayout" v-if="classList.length || noData">
			<uni-load-more :status="noData?'noMore':'loading'"></uni-load-more>
		</view>
		<view class="safe-area-inset-bottom">
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue"

	import {
		apiGetClassList,
		apiGetHistoryList
	} from "@/api/apis.js";
	import {
		onLoad,
		onReachBottom,
		onShareAppMessage,
		onShareTimeline
	} from "@dcloudio/uni-app"
	import {
		gotoHome
	} from "@/utils/common.js"

	const classList = ref([]);
	const noData = ref(false);
	//定义data参数
	const queryParams = {
		pageNum: 1,
		pageSize: 12
	}
	let pageName

	// onload传递组件参数
	onLoad((e) => {
		let {
			id = null, name = null, type = null
		} = e;
		if (type) queryParams.type = type;
		if (id) queryParams.classid = id;

		pageName = name
		//修改导航标题
		uni.setNavigationBarTitle({
			title: name
		})
		//执行获取分类列表方法
		getClassList();
	})


	onReachBottom(() => {
		if (noData.value) return;
		queryParams.pageNum++;

		getClassList()

	})

	//获取网络请求
	const getClassList = async () => {
		let res;
		if (queryParams.classid) res = await apiGetClassList(queryParams);
		if (queryParams.type) res = await apiGetHistoryList(queryParams);

		classList.value = [...classList.value, ...res.data];
		if (queryParams.pageSize > res.data.length) noData.value = true;
		uni.setStorageSync("storgClassList", classList.value);
	}

	//分享给好友
	onShareAppMessage((e) => {
		return {
			title: "救兵壁纸,壁纸救兵",
			path: "/pages/classlist/classlist?id=" + queryParams.classid + "&name=" + pageName
		}
	})
	//朋友圈
	onShareTimeline(() => {
		return {
			title: "救兵壁纸,壁纸救兵",
			imageUrl: "/static/images/JiuBing",
			query: "id = " + queryParams.classid + " & name = " + pageName
		}
	})
</script>

<style lang="scss" scoped>
	.classifylist {


		.content {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 5rpx;
			padding: 5rpx;

			.item {
				height: 440rpx;

				image {
					display: block;
					width: 100%;
					height: 100%;

				}
			}
		}
	}
</style>