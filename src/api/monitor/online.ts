import request from "@/utils/request";

const BASE_URL = "/api/v1/monitor/online";

const OnlineAPI = {
  /**
   * 获取登录日志分页列表
   *
   * @param queryParams 查询参数
   */
   getPage(queryParams: PageQuery) {
    return request<any, PageResult<MonitorOnlinePageVO[]>>({
      url: `${BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 强制退出当前用户
   *
   * @param sessionId 会话id
   */
   forceQuit(sessionId: string) {
    return request({
      url: `${BASE_URL}/force-quit/${sessionId}`,
      method: "delete",
    });
  },

  /**
   * 导出在线用户
   *
   * @param queryParams
   */
   exportOnline(queryParams: PageQuery) {
    return request({
      url: `${BASE_URL}/export`,
      method: "get",
      params: queryParams,
      responseType: "arraybuffer",
    });
  }
}

export default OnlineAPI;

export interface MonitorOnlinePageVO {
  /**
   * 会话编号
   */
  sessionId: string;
  /**
   * 登录用户
   */
  username: string;
  /**
   * 登录ip
   */
  loginIp: string;
  /**
   * 登录地址
   */
  loginAddress: string;
  /**
   * 登录时间
   */
  loginDate: string;
}
