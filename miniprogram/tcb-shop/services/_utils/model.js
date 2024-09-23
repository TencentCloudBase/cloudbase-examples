export function model() {
  return globalThis.dataModel;
}

export async function getAll({ filter, select, name }) {
  const addSelect = (prop) => (select ? { ...prop, select } : prop);
  const pageSize = 200;
  const first = await model()[name].list(
    addSelect({
      pageNumber: 1,
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

  const ret = lists.reduce((acc, current) => acc.concat(current.data.records), first.data.records);
  return ret;
}
