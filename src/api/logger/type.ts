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
   * 链路追踪id
   */
  traceId: number;
  /**
   * 用户id
   */
  userId: number;
  /**
   *用户类型
   */
  userType: number;
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
   * 登录日期
   */
  createTime: Date;
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
   * 链路追踪编号
   */
  traceId: string;
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
   * 详细内容
   */
  extra: string;
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
