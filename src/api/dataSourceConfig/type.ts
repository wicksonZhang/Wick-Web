/**
 * 数据源配置请求参数
 */
export interface DataSourceConfig {
  /**
   * 数据源配置id
   */
  id: number | undefined;
  /**
   * 用户名
   */
  name: string;
  /**
   * 数据源url
   */
  url: string;
  /**
   * 用户名
   */
  username: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 创建日期
   */
  createTime?: Date;
}

export interface DataSourceConfigVO {
  /**
   * 数据源配置id
   */
  id: number | undefined;
  /**
   * 用户名
   */
  name: string;
  /**
   * 数据源url
   */
  url: string;
  /**
   * 用户名
   */
  username: string;
  /**
   * 密码
   */
  password: string;
}
