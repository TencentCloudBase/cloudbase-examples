// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const db = cloud.database();
    
    // 创建或获取todos集合
    const todosCollection = 'todos';
    
    // 尝试在集合中添加一条数据，如果集合不存在会自动创建
    const result = await db.collection(todosCollection).add({
      data: {
        title: '欢迎使用CloudBase React模板',
        content: '这是一个初始化的待办事项',
        completed: false,
        createdAt: new Date()
      }
    });
    
    // 创建索引
    await db.createIndex(todosCollection, {
      name: 'idx_completed',
      unique: false,
      keys: {
        completed: 1
      }
    });
    
    return {
      success: true,
      message: '数据库集合创建成功',
      result
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stack: error.stack
    };
  }
} 