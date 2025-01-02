import dayjs from 'dayjs';

export function model() {
  return globalThis.dataModel;
}

/**
 * 读取多条数据
 * @param name 数据模型标识
 * @param pageNumber 第几页
 * @param pageSize 分页大小，建议指定，如需设置为其它值，需要和 pageNumber 配合使用，两者同时指定才会生效
 * @param filter 过滤条件
 * @param select 
 */
export async function getAll({ filter, select, name, pageNumber = 1, pageSize = 200 }) {
  const addSelect = (prop) => (select ? { ...prop, select } : prop);
  const first = await model()[name].list(
    addSelect({
      pageNumber,
      pageSize,
      getCount: true,
      filter,
    }),
  );
  const {
    data: { total },
  } = first;
  const totalPage = Math.ceil(total / 200);
  const lists = await Promise.all(
    Array.from({ length: totalPage - 1 }, (_, index) => index + 2).map((pageNumber) =>
      model()[name].list(
        addSelect({
          pageNumber,
          pageSize,
          filter,
        }),
      ),
    ),
  );
  const ret = lists.reduce((acc, current) => acc.concat(current.data.records), first.data.records).map((item)=>{
    return {
      time: dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      ...item,
    }
  })
  return ret;
}

/**
 * 读取单条数据
 * @param name 数据模型标识
 * @param _id 根据数据标识 _id 进行操作
 * @param select  设置返回字段
 */
export async function getOne({name,_id,select}){
  const addSelect = (prop) => (select ? { ...prop, select } : prop);
  const { data } = await model()[name].get(  addSelect({
    filter: {
      where: {
        $and: [
          {
            _id: {
              $eq: _id,
            },
          },
        ]
      }
    }
  }));
  //转换时间 格式为YYYY-MM-DD HH:mm:ss
  data.time = dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm:ss');
  return data;
}