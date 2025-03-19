import request from "@/utils/request";

const BASE_URL = "/api/v1/tool/data-source";

class ToolDataSourceAPI {

  /**
   * 获取数据源配置分页数据
   */
  static getPage(queryParams: PageQuery) {
    return request<any, PageResult<ToolDataSourceVO[]>>({
      url: `${BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  }

  /**
   * 获取数据源配置咧白哦
   */
  static getOptions() {
    return request<any, OptionType[]>({
      url: `${BASE_URL}/options`,
      method: "get"
    });
  }

  /**
   * 获取数据源配置数据
   *
   * @param id 数据源配置ID
   * @returns 数据源配置表单数据
   */
  static getFormData(id: number) {
    return request<any, ToolDataSourceForm>({
      url: `${BASE_URL}/${id}`,
      method: "get",
    });
  }

  /**
   * 新增数据源配置数据
   *
   * @param data 数据源配置表单数据
   * @returns 请求结果
   */
  static add(data: ToolDataSourceForm) {
    return request({
      url: `${BASE_URL}/add`,
      method: "post",
      data: data,
    });
  }

  /**
   * 修改数据源配置数据
   *
   * @param data 数据源配置表单数据
   * @returns 请求结果
   */
  static update(data: ToolDataSourceForm) {
    return request({
      url: `${BASE_URL}/update`,
      method: "put",
      data: data,
    });
  }

  /**
   * 删除数据源配置数据
   *
   * @param ids 数据源配置ID，多个以英文逗号(,)分隔
   * @returns 请求结果
   */
  static deleteByIds(ids: string) {
    return request({
      url: `${BASE_URL}/delete/${ids}`,
      method: "delete",
    });
  }

  /**
   * 测试连接
   *
   * @param data
   */
  static testConnection(data: ToolDataSourceForm) {
    return request({
      url: `${BASE_URL}/testConnection`,
      method: "post",
      data: data,
    });
  }

}

export default ToolDataSourceAPI;

/**
 *  ToolDataSourceVO类型
 */
export interface ToolDataSourceVO {
  id?: number; // 主键编号
  name?: string; // 参数名称
  url?: string; // 数据源连接
  username?: string; // 用户名
  password?: string; // 密码
}

/**
 *  ToolDataSourceFrom表单
 */
export interface ToolDataSourceForm {
  id?: number; // 主键编号
  name?: string; // 参数名称
  url?: string; // 数据源连接
  username?: string; // 用户名
  password?: string; // 密码
}
