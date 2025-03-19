import request from "@/utils/request";

const BASE_URL = "/api/v1/monitor/job-log";

const XxlJobLogAPI = {
  /**
   * 获取调度日志分页数据
   */
  getPage(queryParams: PageQuery) {
    return request<any, PageResult<XxlJobLogVO[]>>({
      url: `${BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取定时任务
   * @param jobGroup
   */
  getJobIdByGroup(jobGroup: string | undefined) {
    return request<any, OptionType[]>({
      url: `${BASE_URL}/getJobsByGroup/${jobGroup}`,
      method: "get",
    });
  },
};

export default XxlJobLogAPI;

/**
 *  XxlJobLogVO类型
 */
export interface XxlJobLogVO {
  id?: number; // 任务编号
  jobGroup?: number; // 执行器主键ID
  jobId?: number; // 任务，主键ID
  executorAddress?: string; // 执行器地址，本次执行的地址
  executorHandler?: string; // 执行器任务handler
  executorParam?: string; // 执行器任务参数
  executorShardingParam?: string; // 执行器任务分片参数，格式如 1/2
  executorFailRetryCount?: number; // 失败重试次数
  triggerTime?: Date; // 调度-时间
  triggerCode?: number; // 调度-结果
  triggerMsg?: string; // 调度-日志
  handleTime?: Date; // 执行-时间
  handleCode?: number; // 执行-状态
  handleMsg?: string; // 执行-日志
  alarmStatus?: number; // 告警状态：0-默认、1-无需告警、2-告警成功、3-告警失败
}
