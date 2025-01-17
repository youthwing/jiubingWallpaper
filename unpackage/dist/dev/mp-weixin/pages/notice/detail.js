"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const detail = common_vendor.ref({});
    let noticeId;
    common_vendor.onLoad((e) => {
      noticeId = e.id;
      getNoticeDetail();
    });
    const getNoticeDetail = () => {
      api_apis.apiNoticeDetail({
        id: noticeId
      }).then((res) => {
        detail.value = res.data;
        common_vendor.index.__f__("log", "at pages/notice/detail.vue:53", res);
      });
    };
    return (_ctx, _cache) => {
      return {};
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f737f11"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/notice/detail.js.map
