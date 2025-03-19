import request from "@/utils/request";

const BASE_URL = "/api/v1/monitor/job-group";

const XxlJobGroupAPI = {
  /**
   * 获取执行器管理分页数据
   */
  getPage(queryParams: PageQuery) {
    return request<any, PageResult<XxlJobGroupVO[]>>({
      url: `${BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 获取执行器管理数据
   *
   * @param id 执行器管理ID
   * @returns 执行器管理表单数据
   */
  getFormData(id: number) {
    return request<any, XxlJobGroupForm>({
      url: `${BASE_URL}/${id}`,
      method: "get",
    });
  },

  /**
   * 新增执行器管理数据
   *
   * @param data 执行器管理表单数据
   * @returns 请求结果
   */
  add(data: XxlJobGroupForm) {
    return request({
      url: `${BASE_URL}/add`,
      method: "post",
      data: data,
    });
  },

  /**
   * 修改执行器管理数据
   *
   * @param data 执行器管理表单数据
   * @returns 请求结果
   */
  update(data: XxlJobGroupForm) {
    return request({
      url: `${BASE_URL}/update`,
      method: "put",
      data: data,
    });
  },

  /**
   * 删除执行器管理数据
   *
   * @param ids 执行器管理ID，多个以英文逗号(,)分隔
   * @returns 请求结果
   */
  deleteByIds(ids: string) {
    return request({
      url: `${BASE_URL}/delete/${ids}`,
      method: "delete",
    });
  },
  /**
   * 获取执行器集合
   */
  getJobGroupList() {
    return request<any, OptionType[]>({
      url: `${BASE_URL}/list`,
      method: "get",
    });
  },
};

export default XxlJobGroupAPI;

/**
 *  XxlJobGroupVO类型
 */
export interface XxlJobGroupVO {
  id?: number; //
  appName?: string; // 执行器AppName
  title?: string; // 执行器名称
  addressType?: number; // 执行器地址类型：0=自动注册、1=手动录入
  addressList?: string; // 执行器地址列表，多地址逗号分隔
}

/**
 *  XxlJobGroupFrom表单
 */
export interface XxlJobGroupForm {
  id?: number; //
  appName?: string; // 执行器AppName
  title?: string; // 执行器名称
  addressType?: number; // 执行器地址类型：0=自动注册、1=手动录入
  addressList?: string; // 执行器地址列表，多地址逗号分隔
}
