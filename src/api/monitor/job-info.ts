import request from "@/utils/request";

const BASE_URL = "/api/v1/monitor/job-info";

const MonitorXxlJobInfoAPI = {
  /**
   * 获取定时任务管理分页数据
   */
  getPage(queryParams: PageQuery) {
    return request<any, PageResult<MonitorXxlJobInfoVO[]>>({
      url: `${BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 获取定时任务管理数据
   *
   * @param id 定时任务管理ID
   * @returns 定时任务管理表单数据
   */
  getFormData(id: number) {
    return request<any, MonitorXxlJobInfoForm>({
      url: `${BASE_URL}/${id}`,
      method: "get",
    });
  },

  /**
   * 新增定时任务管理数据
   *
   * @param data 定时任务管理表单数据
   * @returns 请求结果
   */
  add(data: MonitorXxlJobInfoForm) {
    return request({
      url: `${BASE_URL}/add`,
      method: "post",
      data: data,
    });
  },

  /**
   * 修改定时任务管理数据
   *
   * @param data 定时任务管理表单数据
   * @returns 请求结果
   */
  update(data: MonitorXxlJobInfoForm) {
    return request({
      url: `${BASE_URL}/update`,
      method: "put",
      data: data,
    });
  },

  /**
   * 删除定时任务管理数据
   *
   * @param ids 定时任务管理ID，多个以英文逗号(,)分隔
   * @returns 请求结果
   */
  deleteByIds(ids: string) {
    return request({
      url: `${BASE_URL}/delete/${ids}`,
      method: "delete",
    });
  },

  /**
   * 启动 | 停止定时任务
   *
   * @param id 1：启动，0：停止
   * @param status 1：启动，0：停止
   * @returns 请求结果
   */
  handleTriggerStatus(id: number | undefined, status: number | undefined) {
    return request({
      url: `${BASE_URL}/updateStatus/${id}/${status}`,
      method: "patch",
    });
  },
  /**
   * 执行定时任务
   */
  executeTrigger(data: MonitorExecutorParamVO) {
    return request({
      url: `${BASE_URL}/executeTrigger`,
      method: "post",
      data: data,
    });
  },
};

export default MonitorXxlJobInfoAPI;

/**
 *  MonitorXxlJobInfoVO类型
 */
export interface MonitorXxlJobInfoVO {
  id?: number; //
  jobGroup?: number; // 执行器主键ID
  jobDesc?: string; // 任务描述
  addTime?: Date; // 添加时间
  author?: string; // 负责人
  alarmEmail?: string; // 报警邮件
  scheduleType?: string; // 调度类型
  scheduleConf?: string; // 调度配置，值含义取决于调度类型
  misfireStrategy?: string; // 调度过期策略
  executorRouteStrategy?: string; // 执行器路由策略
  executorHandler?: string; // 执行器任务handler
  executorParam?: string; // 执行器任务参数
  executorBlockStrategy?: string; // 阻塞处理策略
  executorTimeout?: number; // 任务执行超时时间，单位秒
  executorFailRetryCount?: number; // 失败重试次数
  glueType?: string; // GLUE类型
  glueSource?: string; // GLUE源代码
  glueRemark?: string; // GLUE备注
  glueUpdatetime?: Date; // GLUE更新时间
  childJobid?: string; // 子任务ID，多个逗号分隔
  triggerStatus?: number; // 调度状态：0-停止，1-运行
  triggerLastTime?: number; // 上次调度时间
  triggerNextTime?: number; // 下次调度时间
}

/**
 *  MonitorXxlJobInfoFrom表单
 */
export interface MonitorXxlJobInfoForm {
  id?: number; // 执行器主键ID
  jobGroup?: string | number; // 执行器
  jobDesc?: string; // 任务描述
  addTime?: Date; // 添加时间
  author?: string; // 负责人
  alarmEmail?: string; // 报警邮件
  scheduleType?: string; // 调度类型
  scheduleConf?: string; // 调度配置，值含义取决于调度类型
  misfireStrategy?: string; // 调度过期策略
  executorRouteStrategy?: string; // 执行器路由策略
  executorHandler?: string; // 执行器任务handler
  executorParam?: string; // 执行器任务参数
  executorBlockStrategy?: string; // 阻塞处理策略
  executorTimeout?: number; // 任务执行超时时间，单位秒
  executorFailRetryCount?: number; // 失败重试次数
  glueType?: string; // GLUE类型
  glueSource?: string; // GLUE源代码
  glueRemark?: string; // GLUE备注
  glueUpdatetime?: Date; // GLUE更新时间
  childJobid?: string; // 子任务ID，多个逗号分隔
  triggerStatus?: number; // 调度状态：0-停止，1-运行
  triggerLastTime?: number; // 上次调度时间
  triggerNextTime?: number; // 下次调度时间
  schedule_conf_CRON?:string; // 调度配置，值含义取决于调度类型
  schedule_conf_FIX_RATE:string; // 调度配置，值含义取决于调度类型
  schedule_conf_FIX_DELAY:string; // 调度配置，值含义取决于调度类型
}

export interface MonitorExecutorParamVO {
  id?: number;
  executorParam?: string; // 执行器任务参数
  addressList?: string; // 执行器地址列表，多地址逗号分隔
}
