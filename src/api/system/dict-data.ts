import request from "@/utils/request";

const BASE_URL = "/api/v1/system/dict-data";

const DictDataAPI = {

  /**
   * 获取字典分页列表
   *
   * @param queryParams 查询参数
   * @returns 字典分页结果
   */
  getPage(queryParams: PageQuery) {
    return request<any, PageResult<DictDataPageVO[]>>({
      url: `${BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 获取字典数据表单
   *
   * @param id 字典ID
   * @returns 字典数据表单
   */
  getFormData(id: number) {
    return request<any, ResponseData<DictDataForm>>({
      url: `${BASE_URL}/${id}`,
      method: "get",
    });
  },

  /**
   * 新增字典数据
   *
   * @param data 字典数据
   */
  add(data: DictDataForm) {
    return request({
      url: `${BASE_URL}/add`,
      method: "post",
      data: data,
    });
  },

  /**
   * 修改字典数据
   *
   * @param id 字典ID
   * @param data 字典数据
   */
  update(id: number, data: DictDataForm) {
    return request({
      url: `${BASE_URL}/update`,
      method: "put",
      data: data,
    });
  },

  /**
   * 删除字典
   *
   * @param ids 字典ID，多个以英文逗号(,)分隔
   */
  deleteByIds(ids: string) {
    return request({
      url: `${BASE_URL}/delete/${ids}`,
      method: "delete",
    });
  },

  /**
   * 获取字典的数据项
   *
   * @param dictCode 字典编码
   * @returns 字典数据项
   */
  getOptions(dictCode: string) {
    return request<any, OptionType[]>({
      url: `${BASE_URL}/${dictCode}/options`,
      method: "get",
    });
  }
}

export default DictDataAPI;

/**
 * 字典分页对象
 */
export interface DictDataPageVO {
  /**
   * 字典ID
   */
  id: number;
  /**
   * 字典编码
   */
  dictCode: string;
  /**
   * 字典数据值
   */
  value: number;
  /**
   * 字典数据标签
   */
  label: string;
  /**
   * 状态（1:启用，0:禁用)
   */
  status: number;
  /**
   * 字典排序
   */
  sort?: number;
}

/**
 * 字典
 */
export interface DictDataForm {
  /**
   * 字典ID
   */
  id?: number;
  /**
   * 字典编码
   */
  dictCode?: string;
  /**
   * 字典数据值
   */
  value?: number;
  /**
   * 字典数据标签
   */
  label?: string;
  /**
   * 状态（1:启用，0:禁用)
   */
  status?: number;
  /**
   * 字典排序
   */
  sort?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 标签类型
   */
  tagType?: "success" | "warning" | "info" | "primary" | "danger" | undefined;
}
