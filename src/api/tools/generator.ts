import request from "@/utils/request";

const GENERATOR_BASE_URL = "/api/v1/code-gen";

class GeneratorAPI {
  /** 获取数据表分页列表 */
  static getCodeGenTableList(params: CodeGenTablePageQuery) {
    return request<any, PageResult<CodeGenTableVO[]>>({
      url: `${GENERATOR_BASE_URL}/list`,
      method: "get",
      params: params,
    });
  }

  /** 获取代码生成预览数据 */
  static getPreviewData(tableId: number) {
    return request<any, CodeGenTablePreviewVO[]>({
      url: `${GENERATOR_BASE_URL}/preview/${tableId}`,
      method: "get",
    });
  }

  /** 获取数据源表数据 */
  static getDataSourceTableList(params: CodeGenTablePageQuery) {
    return request<any, PageResult<CodeGenTableVO[]>>({
      url: `${GENERATOR_BASE_URL}/db/list`,
      method: "get",
      params: params,
    });
  }

  /** 导入选中数据表的数据 */
  static importTable(tableNames: string) {
    return request({
      url: `${GENERATOR_BASE_URL}/importTable/${tableNames}`,
      method: "post",
    });
  }

  /**
   * 查询详情代码生成表定义
   * @param tableId 表id
   */
  static getToolCodeGenTable(tableId: number) {
    return request<any, CodeGenTableDetailsVO>({
      url: `${GENERATOR_BASE_URL}/details/${tableId}`,
      method: "get",
    });
  }

  /**
   * 修改代码生成信息
   * @param data
   */
  static updateToolCodeGenTable(data: any) {
    return request({
      url: `${GENERATOR_BASE_URL}/update`,
      method: "put",
      data: data,
    });
  }

  /**
   * 删除表信息
   *
   * @param ids 表ID，多个以英文逗号(,)分隔
   * @returns 请求结果
   */
  static deleteByIds(ids: string) {
    return request({
      url: `${GENERATOR_BASE_URL}/delete/${ids}`,
      method: "delete",
    });
  }

  /**
   * 同步数据表
   * @param tableId 数据表id
   */
  static syncCodegenFromDB(tableId: number) {
    return request({
      url: `${GENERATOR_BASE_URL}/syncDb/${tableId}`,
      method: "put",
    });
  }
}

export default GeneratorAPI;

/**  数据表分页查询参数 */
export interface CodeGenTablePageQuery extends PageQuery {
  /** 表名 */
  tableName?: string;

  /** 表描述 */
  tableComment?: string;

  /** 创建时间 */
  createTime?: [string, string];
}

/** 数据表分页对象 */
export interface CodeGenTableVO {
  /** 表id */
  id: number;

  /** 表名称 */
  tableName: string;

  /** 表描述 */
  tableComment: string;

  /** 类名 */
  className: string;

  /** 创建时间 */
  createTime: string;

  /** 更新时间 */
  updateTime: string;
}

/** 代码生成预览对象 */
export interface CodeGenTablePreviewVO {
  /** 文件生成路径 */
  path: string;

  /** 包名路径 */
  packagePath: string;

  /** 文件名称 */
  fileName: string;

  /** 文件内容 */
  content: string;
}

/** 代码详细数据 */
export interface CodeGenTableDetailsVO {
  /**
   * 数据表基本信息
   */
  table: CodeGenTableInfoVO | any;

  /**
   * 数据表字段信息
   */
  columns: CodeGenColumnsInfoVO[];
}

/** 数据表基本信息 */
export interface CodeGenTableInfoVO {
  // ========================== 基本信息 ==========================

  /** 主键id,示例值：1 */
  id: number;

  /** 表名,示例值："system_user" */
  tableName: string;

  /** 表描述,示例值："用户信息表" */
  tableComment: string;

  /** 类名, 示例值："ClassName" */
  className: string;

  /** 作者,示例值："wickson" */
  functionAuthor: string;

  /** 备注,示例值："备注" */
  remark: string;

  // ========================== 生成信息 ==========================

  /** 使用的模板（crud单表操作 tree树表操作 sub主子表操作）,示例值："crud" */
  tplCategory: string;

  /** 前端类型（Vue2 Element UI、Vue3 Element Plus）,示例值："Vue3 Element Plus" */
  tplWebType: string;

  /** 包路径,示例值："com.wick.boot.module.system" */
  packageName: string;

  /** 模块名,示例值："system" */
  moduleName: string;

  /** 业务名,示例值："user" */
  businessName: string;

  /** 功能名,示例值："用户信息" */
  functionName: string;

  /** 生成代码方式,示例值："0-zip压缩包" 或 "1-自定义路径" */
  genType: string;

  /** 上级菜单,示例值："1024"*/
  parentMenuId: string;

  /** 自定义路径,示例值："/" */
  genPath: string;
}

/** 字段配置 */
export interface CodeGenColumnsInfoVO {
  /** 编号, 示例值：1024 */
  id?: number;

  /** 归属表编号, 示例值：1 */
  tableId?: number;

  /** 列名称, 示例值："username" */
  columnName?: string;

  /** 列描述, 示例值："用户名" */
  columnComment?: string;

  /** 列类型, 示例值："varchar(64)" */
  columnType?: string;

  /** JAVA类型, 示例值："varchar(64)" */
  javaType?: string;

  /** JAVA字段名, 示例值："username" */
  javaField?: string;

  /** 是否主键（1是）, 示例值：0 */
  pk?: number;

  /** 是否自增（1是）, 示例值：0 */
  increment?: number;

  /** 是否必填（1是）, 示例值："1" */
  required?: string;

  /** 是否为插入字段（1是）, 示例值："1" */
  created?: string;

  /** 是否编辑字段（1是）, 示例值："1" */
  edit?: string;

  /** 是否列表字段（1是）, 示例值："1" */
  list?: string;

  /** 是否查询字段（1是）, 示例值："1" */
  query?: string;

  /** 查询方式（EQ等于、NE不等于、GT大于、LT小于、LIKE模糊、BETWEEN范围）, 示例值："EQ" */
  queryType?: string;

  /** 显示类型（input文本框、textarea文本域、select下拉框、checkbox复选框、radio单选框、datetime日期控件、image图片上传控件、upload文件上传控件、editor富文本控件）, 示例值："input" */
  htmlType?: string;

  /** 字典类型 */
  dictType?: string;

  /** 排序, 示例值：3 */
  sort?: number;
}
