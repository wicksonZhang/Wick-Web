import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { DataSourceConfig } from "@/api/dataSourceConfig/type";
import { DeptForm } from "@/api/dept/types";

/**
 * 获取数据源配置分页数据
 */
export function getListDataSourceConfig(): AxiosPromise<DataSourceConfig> {
  return request({
    url: "/api/v1/data-source-config",
    method: "get",
  });
}

/**
 * 获取数据源配置信息
 */
export function getDataSourceConfigById(
  id: number
): AxiosPromise<DataSourceConfig> {
  return request({
    url: "/api/v1/data-source-config/" + id,
    method: "get",
  });
}

/**
 * 新增数据源配置
 */
export function createDataSourceConfig(data: DataSourceConfig) {
  return request({
    url: "/api/v1/data-source-config/add",
    method: "post",
    data: data,
  });
}

/**
 * 修改数据源配置
 */
export function updateDataSourceConfig(data: DataSourceConfig) {
  return request({
    url: "/api/v1/data-source-config/update",
    method: "put",
    data: data,
  });
}

/**
 * 测试连接
 */
export function testConnection(data: DataSourceConfig) {
  return request({
    url: "/api/v1/data-source-config/testConnection",
    method: "post",
    data: data,
  });
}

/**
 * 删除数据源配置信息
 * @param id
 */
export function deleteDataSourceConfig(id: number) {
  return request({
    url: "/api/v1/data-source-config/" + id,
    method: "delete",
  });
}
