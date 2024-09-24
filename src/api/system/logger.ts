import request from "@/utils/request";

const LOGGER_BASE_URL = "/api/v1";

class LoggerAPI {

  /**
   * 获取登录日志分页列表
   *
   * @param queryParams 查询参数
   */
  static getPage(queryParams: PageQuery) {
    return request<any, PageResult<LoginLogPageVO[]>>({
      url: `${LOGGER_BASE_URL}/login-log/page`,
      method: "get",
      params: queryParams,
    });
  }

  /**
   * 导出登录日志
   *
   * @param queryParams 查询参数
   */
  static exportLoginLog(queryParams: PageQuery) {
    return request({
      url: `${LOGGER_BASE_URL}/login-log/export`,
      method: "get",
      params: queryParams,
      responseType: "arraybuffer",
    });
  }

  /**
   * 获取操作日志分页数据
   *
   * @param queryParams
   */
  static getOperateLogPage(queryParams: PageQuery) {
    return request<any, PageResult<OperateLogPageVO[]>>({
      url: `${LOGGER_BASE_URL}/operate-log/page`,
      method: "get",
      params: queryParams,
    });
  }

  /**
   * 导出用户操作日志
   * @param queryParams
   */
  static exportOperateLog(queryParams: PageQuery) {
    return request({
      url: `${LOGGER_BASE_URL}/operate-log/export`,
      method: "get",
      params: queryParams,
      responseType: "arraybuffer",
    });
  }

}

export default LoggerAPI;

/**
 * 登录日志分页对象
 */
export interface LoginLogPageVO {
  /**
   * 日志编号
   */
  id: number;
  /**
   * 操作类型
   */
  logType: number;
  /**
   * 用户id
   */
  userId: number;
  /**
   * 用户名称
   */
  username: string;
  /**
   * 登陆结果
   */
  result: number;
  /**
   * 登录地址
   */
  userIp: string;
  /**
   * 浏览器
   */
  userAgent: string;
  /**
   * 操作系统
   */
  os: string;
  /**
   * 登录日期
   */
  createTime: Date;
}

export interface LoginLogQuery extends PageQuery {
  /**
   * 用户名称
   */
  userName?: string;
  /**
   * 用户ip
   */
  userIp?: string;
  /**
   * 创建时间
   * */
  createTime?: Date;
}

/**
 * 操作日志分页对象
 */
export interface OperateLogPageVO {
  /**
   * 主键id
   */
  id: number;
  /**
   * 用户类型
   */
  userType: number;
  /**
   * 用户id
   */
  userId: number;
  /**
   * 用户名称
   */
  userName: string;
  /**
   * 用户昵称
   */
  userNickname: string;
  /**
   * 操作模块
   */
  type: string;
  /**
   * 操作模块
   */
  module: string;
  /**
   * 操作内容
   */
  name: string;
  /**
   * 请求方式
   */
  requestMethod: string;
  /**
   * 请求URL
   */
  requestUrl: string;
  /**
   * 用户ip
   */
  userIp: string;
  /**
   * 用户地址
   */
  operateLocation: string;
  /**
   * 浏览器
   */
  userAgent: string;
  /**
   * 创建者
   */
  createBy: string;
  /**
   * java方法执行参数
   */
  javaMethod: string;
  /**
   * java方法执行参数
   */
  javaMethodArgs: string;
  /**
   * 开始时间
   */
  startTime: Date;
  /**
   * 执行时间
   */
  duration: number;
  /**
   * 执行结果
   */
  resultMsg: String;
}

export interface OperateLogQuery extends PageQuery {
  /**
   * 用户id
   */
  userId?: string;
  /**
   * 操作模块
   */
  type?: string;
  /**
   * 操作模块
   */
  module?: string;
  /**
   * 创建时间
   */
  createTime?: [];
}
