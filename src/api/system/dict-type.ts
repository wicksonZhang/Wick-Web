import request from "@/utils/request";

const BASE_URL = "/api/v1/system/dict-type";

class DictAPI {
  /**
   * 获取字典分页列表
   *
   * @param queryParams 查询参数
   * @returns 字典分页结果
   */
  static getPage(queryParams: PageQuery) {
    return request<any, PageResult<DictPageVO[]>>({
      url: `${BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  }

  /**
   * 获取字典表单数据
   *
   * @param id 字典ID
   * @returns 字典表单数据
   */
  static getFormData(id: number) {
    return request<any, ResponseData<DictForm>>({
      url: `${BASE_URL}/${id}`,
      method: "get",
    });
  }

  /**
   * 新增字典
   *
   * @param data 字典表单数据
   */
  static add(data: DictForm) {
    return request({
      url: `${BASE_URL}/add`,
      method: "post",
      data: data,
    });
  }

  /**
   * 修改字典
   *
   * @param id 字典ID
   * @param data 字典表单数据
   */
  static update(data: DictForm) {
    return request({
      url: `${BASE_URL}/update`,
      method: "put",
      data: data,
    });
  }

  /**
   * 删除字典
   *
   * @param ids 字典ID，多个以英文逗号(,)分隔
   */
  static deleteByIds(ids: string) {
    return request({
      url: `${BASE_URL}/${ids}`,
      method: "delete",
    });
  }

  /**
   * 获取字典列表
   *
   * @returns 字典列表
   */
  static getList() {
    return request<any, OptionType[]>({
      url: `${BASE_URL}/list`,
      method: "get",
    });
  }

}

export default DictAPI;

/**
 * 字典分页对象
 */
export interface DictPageVO {
  /**
   * 字典ID
   */
  id: number;
  /**
   * 字典名称
   */
  name: string;
  /**
   * 字典编码
   */
  code: string;
  /**
   * 字典状态（1-启用，0-禁用）
   */
  status: number;
}

/**
 * 字典
 */
export interface DictForm {
  /**
   * 字典ID
   */
  id?: number;
  /**
   * 字典名称
   */
  name?: string;
  /**
   * 字典编码
   */
  code?: string;
  /**
   * 字典状态（1-启用，0-禁用）
   */
  status?: number;
  /**
   * 备注
   */
  remark?: string;
}
