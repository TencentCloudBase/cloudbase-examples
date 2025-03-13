import { LanguageModel } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { ICreateAgentOptions} from '../type.js'

/********************
 * 客服Agent（初级支持）
 ********************/
export function createPrimaryAgent(model: LanguageModel, options: ICreateAgentOptions) {
  return new Agent({
    name: '初级客服',
    instructions: `
    你是一线客服，负责：
    1. 解答常见问题（产品信息、基础政策）
    2. 识别服务类型并转接
    3. 收集必要信息
    4. 退换货请求
    5. 投诉处理
    6. 复杂技术问题

        # 知识库
        Patagonia坚持环保理念：
    - 所有产品享有无理由免费维修服务
    - 提供二手商品回收计划
    - 退货政策：30天无理由退货，1年内质量问题免费换新

    经典Retro-X夹克特性：
      - 100%再生聚酯纤维外壳
      - 有机棉内衬
      - 无氟防泼水处理技术
      - 终身保修

    Black Hole系列背包：
      - 再生尼龙材质
      - 防水拉链设计
      - 可回收衬垫

    退货流程：
      1. 提交退货请求（需提供订单号），自动帮忙用户创建工单，返回工单号
      2. 用户寄回商品（运费由我们承担），用户提供快递单号
      3. 等待收货（3-5个工作日）
      4. 3-5个工作日内处理退款
      5. 用户可以根据工单号来查询工单进度（注意不要给用户网址，后续用户可以通过对话来查询进度）
      
    保修服务：
      - 非人为损坏免费维修
      - 需提供购买凭证
      - 维修周期通常为2-3周
    `,
    model,
    tools: {
      basicLookup: createOrderLookupTool(),
      // generateReturnAuth: createReturnAuthTool(),
      processRefund: createRefundTool(),
      "serviceTicket": createServiceTicketTool({
        createAgentOptions: options
      }),
      ticketStatus: createTicketStatusTool({
        createAgentOptions: options
      })
    }
  })
}

/********************
 * 共享工具定义
 ********************/
// 订单查询工具（共享）
const createOrderLookupTool = () => createTool({
  id: "order-lookup",
  description: "订单信息查询",
  inputSchema: z.object({ orderId: z.string() }),
  outputSchema: z.object({
    items: z.array(z.object({
      product: z.string(),
      price: z.number()
    })),
    status: z.enum(['shipped', 'delivered'])
  }),
  execute: async ({ context }) => {
    // 模拟订单数据
    return {
      items: [{ product: "Patagonia夹克", price: 299 }],
      status: "delivered" as any
    }
  }
})


// 服务工单工具完整实现
const createServiceTicketTool = ({
  createAgentOptions
}: {
  createAgentOptions: ICreateAgentOptions
}) => {
    return createTool({
      id: "create-service-ticket",
      description: "创建售后服务工单并跟踪处理进度",
      inputSchema: z.object({
        orderId: z.string(),
        issueType: z.enum([
          'RETURN', 
          'EXCHANGE', 
          'COMPLAINT', 
          'WARRANTY'
        ]).optional(),,
        description: z.string().optional(),
        customerContact: z.string().optional(),
      }),
      outputSchema: z.object({
        ticketId: z.string(),
        statusUrl: z.string().url(),
        assignedAgent: z.string(),
        estimatedHours: z.number()
      }),
      execute: async ({ context }) => {
        const models = createAgentOptions.tcb.models
        console.log('excute', context || {})
        // 生成唯一工单ID (格式: TCK-YYYYMMDD-XXXXX)
        const generateTicketId = () => {
          const datePart = new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, '');
          const randomPart = Math.random()
            .toString(36)
            .slice(2, 6)
            .toUpperCase();
          return `TCK-${datePart}-${randomPart}`;
        };
  
        // 创建工单记录
        const newTicket = {
          ticketId: generateTicketId(),
          status: 'OPEN',
          priority: context.issueType === 'COMPLAINT' ? 'HIGH' : 'NORMAL',
          ...context,
          history: [
            {
              timestamp: new Date().toISOString(),
              event: 'TICKET_CREATED',
              message: '工单已创建并分配处理专员'
            }
          ]
        };

        await models.tickets.create({
          data: newTicket
        });
  
        // 模拟分配处理专员
        const agentPool = [
          '售后专员-张伟',
          '资深客服-李娜',
          '技术顾问-王强'
        ];
        const assignedAgent = agentPool[
          Math.floor(Math.random() * agentPool.length)
        ];
  
        return {
          ticketId: newTicket.ticketId,
          statusUrl: `https://service.patagonia.com/track/${newTicket.ticketId}`,
          assignedAgent,
          estimatedHours: context.issueType === 'WARRANTY' ? 48 : 24
        };
      }
    });
  };
  
  // 工单状态查询工具（配套实现）
  const createTicketStatusTool = ({
    createAgentOptions
  }: {
    createAgentOptions: ICreateAgentOptions
  }) => {
    const models = createAgentOptions.tcb.models;
    return createTool({
      id: "check-ticket-status",
      description: "查询售后服务工单进度",
      inputSchema: z.object({
        ticketId: z.string()
      }),
      outputSchema: z.object({
        status: z.enum([
          'OPEN', 
          'IN_PROGRESS', 
          'RESOLVED', 
          'CLOSED'
        ]),
        lastUpdate: z.string(),
        nextStep: z.string()
      }),
      execute: async ({ context }) => {
        console.log('excute', context)

        
        const ticket = (await models.tickets.get({
          filter:{
            where: {
              ticketId: {
                $eq: context.ticketId
              }
            }
          }
        })).data
      
        if (!ticket) {
          return {
            status: 'NOT_FOUND',
            lastUpdate: Date.now(),
            nextStep: '未找到工单'
          }
        }
  
        // 模拟状态更新
        const statusUpdates = {
          OPEN: { next: 'IN_PROGRESS', days: 1 },
          IN_PROGRESS: { next: 'RESOLVED', days: 2 },
          RESOLVED: { next: 'CLOSED', days: 3 }
        };
  
        return {
          status: ticket.status as any,
          lastUpdate: ticket.history.slice(-1)[0].timestamp,
          nextStep: `预计${(statusUpdates as any)[ticket.status].days}个工作日内完成`
        };
      }
    });
  };
  

// /********************
//  * 服务转接工具
//  ********************/
// function createServiceTransferTool() {
//   return createTool({
//     id: "transfer-service",
//     description: "转接到专家客服",
//     inputSchema: z.object({
//       context: z.object({
//         orderId: z.string().optional(),
//         issueType: z.enum(['return', 'complaint', 'technical']),
//         description: z.string()
//       })
//     }),
//     outputSchema: z.object({
//       ticketNumber: z.string(),
//       specialist: z.string()
//     }),
//     execute: async ({ context }) => {
//       // 生成服务工单
//       const ticket = `TCK-${Date.now().toString(16)}`
      
//       // 触发售后Agent流程
//       await afterSalesAgent.handleRequest({
//         ticket,
//         context: context
//       })
      
//       return {
//         ticketNumber: ticket,
//         specialist: "售后专家团队"
//       }
//     }
//   })
// }

/********************
 * 售后工具集
 ********************/

// 退款处理工具
const createRefundTool = () => createTool({
  id: "process-refund",
  inputSchema: z.object({
    orderId: z.string(),
    postId: z.string({
      description: '快递单号'
    }).optional(),
  }),
  outputSchema: z.object({
    refundId: z.string(),
    eta: z.number()
  }),
  execute: async ({ context }) => ({
    refundId: `REF-${Date.now()}`,
    eta: 5
  })
})


// /********************
//  * 使用示例
//  ********************/
// async function demo() {
//   const model = new LanguageModel({ /* 模型配置 */ })
//   const serviceSystem = new ServiceCoordinator(model)

//   // 场景1：普通咨询
//   const normalQuery = await serviceSystem.handleUserQuery("你们夹克的材质是什么？")
//   console.log(normalQuery.message) // 直接回答材质问题

//   // 场景2：退货请求
//   const returnRequest = await serviceSystem.handleUserQuery("我想退货订单号ABC123的夹克")
//   console.log(returnRequest.message)
//   /*
//   输出示例：
//   已转接至售后专家团队，您的服务编号：TCK-18a9b3c
//   退货授权码：RET-ABC123-8j2k
//   请将商品寄至：上海市售后中心 #123
//   预计退款将在5个工作日内处理
//   */
// }

// demo()

// import { LanguageModel } from '@mastra/core';
// import { Agent } from '@mastra/core/agent';
// import { createTool } from '@mastra/core/tools'
// import { z } from 'zod'

// /********************
//  * 预设知识库配置
//  ********************/
// const PATAGONIA_KNOWLEDGE = {
//     brandPhilosophy: `Patagonia坚持环保理念：
//   - 所有产品享有无理由免费维修服务
//   - 提供二手商品回收计划
//   - 退货政策：30天无理由退货，1年内质量问题免费换新`,

//     productMaterials: {
//         jacket: `经典Retro-X夹克特性：
//     - 100%再生聚酯纤维外壳
//     - 有机棉内衬
//     - 无氟防泼水处理技术
//     - 终身保修`,

//         backpack: `Black Hole系列背包：
//     - 再生尼龙材质
//     - 防水拉链设计
//     - 可回收衬垫`
//     },

//     policies: {
//         return: `退货流程：
//     1. 提交退货请求（需提供订单号）
//     2. 获取退货授权码
//     3. 寄回商品（运费由我们承担）
//     4. 3-5个工作日内处理退款`,

//         warranty: `保修服务：
//     - 非人为损坏免费维修
//     - 需提供购买凭证
//     - 维修周期通常为2-3周`
//     }
// }

// /********************
//  * 工具定义
//  ********************/
// // 订单查询工具
// const createOrderLookupTool = () => createTool({
//     id: "order-lookup",
//     description: "根据订单号查询完整订单信息",
//     inputSchema: z.object({ orderId: z.string().length(12) }),
//     outputSchema: z.object({
//         items: z.array(z.object({
//             product: z.string(),
//             price: z.number(),
//             quantity: z.number()
//         })),
//         totalAmount: z.number(),
//         status: z.enum(['pending', 'shipped', 'delivered', 'returned']),
//         purchaseDate: z.string().datetime(),
//         contactEmail: z.string().email()
//     }),
//     execute: async ({ context }) => {
//         // 模拟数据库查询
//         const mockOrders: any = {
//             'ABC123XYZ456': {
//                 items: [{ product: "Patagonia Retro-X Jacket", price: 299, quantity: 1 }],
//                 totalAmount: 299,
//                 status: "delivered",
//                 purchaseDate: "2024-03-15T09:30:00Z",
//                 contactEmail: "customer@example.com"
//             }
//         }
//         return mockOrders[context.orderId as any] || Promise.reject("订单不存在")
//     }
// })

// // 退货授权工具
// const createReturnAuthTool = () => createTool({
//     id: "generate-return-auth",
//     description: "生成退货授权码并发送确认邮件",
//     inputSchema: z.object({
//         orderId: z.string().length(12),
//         email: z.string().email()
//     }),
//     outputSchema: z.object({
//         authCode: z.string().length(8),
//         shippingLabel: z.string()
//     }),
//     execute: async ({ context }) => ({
//         authCode: Math.random().toString(36).slice(2, 10).toUpperCase(),
//         shippingLabel: `退货地址：Patagonia退货中心\n授权码：${context.orderId}-RETURN\n运费到付`
//     })
// })

// // 增强版退款工具
// const createRefundSubmissionTool = () => createTool({
//     id: "submit-refund",
//     description: "提交退款请求到财务系统",
//     inputSchema: z.object({
//         orderId: z.string().length(12),
//         reason: z.string().min(10)
//     }),
//     outputSchema: z.object({
//         caseNumber: z.string(),
//         refundAmount: z.number(),
//         estimatedDays: z.number()
//     }),
//     execute: async ({ context, tools }) => {
//         // 先查询订单信息
//         const order = await tools.orderLookup.execute(context)

//         // 模拟退款提交
//         return {
//             caseNumber: `REF-${Date.now()}`,
//             refundAmount: order.totalAmount,
//             estimatedDays: order.status === 'delivered' ? 3 : 7
//         }
//     }
// })

// /********************
//  * 客服Agent实现
//  ********************/
// function createCustomerServiceAgent(model: LanguageModel) {
//     return new Agent({
//         name: 'Patagonia Customer Service Expert',
//         instructions: `
//     # 角色职责
//     您需要处理以下类型咨询：
//     1. 产品咨询（材质/尺寸/使用）
//     2. 订单服务（查询/退货/换货）
//     3. 政策解答（保修/环保/物流）

//     # 知识库
//     ${Object.entries(PATAGONIA_KNOWLEDGE).map(([k, v]) => `## ${k}\n${v}`).join('\n')}

//     # 操作流程
//     1. 当用户提及订单号时，自动调用orderLookup工具
//     2. 涉及金额操作必须二次确认
//     3. 回答技术问题优先引用知识库内容
//     4. 退货流程：
//        a. 验证订单有效性
//        b. 生成退货授权
//        c. 提交财务退款

//     # 对话风格
//     - 保持友好自然的沟通
//     - 复杂流程分步骤说明
//     - 重要信息用emoji强调
//     `,
//         model,
//         tools: {
//             orderLookup: createOrderLookupTool(),
//             createReturnAuth: createReturnAuthTool(),
//             submitRefund: createRefundSubmissionTool()
//         },
//         // config: {
//         //     contextAwareness: {
//         //         memoryWindow: 3,  // 保持最近3轮对话上下文
//         //         keyInfoExtraction: ['orderId', 'productType']
//         //     }
//         // }
//     })
// }

// // /********************
// //  * 使用示例
// //  ********************/
// // async function fullServiceDemo(model: LanguageModel) {
// //     const csAgent = createCustomerServiceAgent(model)

// //     // 场景1：售前咨询
// //     const materialQuery = await csAgent.generate({
// //         prompt: "Retro-X夹克的内衬材质是什么？"
// //     })
// //     console.log('材质咨询回复:', materialQuery.text)
// //     /* 预期输出：
// //        包含"有机棉内衬"的说明，引用productMaterials知识库内容
// //     */

// //     // 场景2：订单状态查询
// //     const orderQuery = await csAgent.generate({
// //         prompt: "我的订单ABC123XYZ456现在什么状态？"
// //     })
// //     console.log('订单查询结果:', orderQuery.data) // 包含工具调用结果

// //     // 场景3：退货流程
// //     const returnProcess = await csAgent.generate({
// //         prompt: "我需要退回订单ABC123XYZ456的夹克，质量问题"
// //     })
// //     console.log('退货流程响应:', returnProcess.text)
// //     /* 预期输出：
// //        1. 确认订单信息
// //        2. 提供退货授权码
// //        3. 说明退款金额（299美元）和时间
// //     */

// //     // 场景4：异常处理
// //     try {
// //         await csAgent.generate({
// //             prompt: "我要退回不存在的订单INVALID123"
// //         })
// //     } catch (error) {
// //         console.log('异常处理:', error.message) // 显示"订单不存在"
// //     }
// // }

// // /********************
// //  * 辅助工具
// //  ********************/
// // // 身份验证中间件
// // async function verifyIdentity(orderId: string, email: string) {
// //     const order = await createOrderLookupTool().execute({ orderId })
// //     return order.contactEmail === email
// // }

// // // 服务转接函数
// // function createServiceTransfer(agent: Agent) {
// //     return createTool({
// //         id: "transfer-service",
// //         inputSchema: z.object({
// //             serviceType: z.enum(['technical', 'financial', 'complaint'])
// //         }),
// //         execute: ({ context }) => {
// //             return agent.generate({
// //                 prompt: `转接请求类型：${context.serviceType}`
// //             })
// //         }
// //     })
// // }

// // /**
// //  * 客服支持Agent
// //  */
// // function createCustomerServiceAgent(model: LanguageModel) {
// //     const customerServiceAgent = new Agent({
// //         name: 'Customer Service Agent',
// //         instructions: `
// //         你是一个专业客服，负责处理退货请求。你需要：
// //         1. 验证用户身份（通过邮箱和订单号）
// //         2. 生成退货授权码
// //         3. 提交退款请求到财务系统
// //         4. 提供退货物流指导
        
// //         请保持专业友好的语气，确保所有操作符合公司退货政策。
// //         当需要敏感操作时，必须确认用户身份。
// //     `,
// //         model,
// //         tools: {
// //             getReturnAuthCode: createReturnAuthTool(),
// //             submitRefundRequest: createRefundSubmissionTool()
// //         }
// //     });

// //     return customerServiceAgent
// // }

// // /**
// //  * 生成退货授权码工具
// //  */
// // function createReturnAuthTool() {
// //     return createTool({
// //         id: "generate-return-auth",
// //         description: "生成退货授权码并发送到用户邮箱",
// //         inputSchema: z.object({
// //             email: z.string().email(),
// //             orderId: z.string().length(12)
// //         }),
// //         outputSchema: z.object({
// //             authCode: z.string().length(8),
// //             shippingInstructions: z.string()
// //         }),
// //         execute: async ({ context }) => {
// //             // 模拟生成授权码逻辑
// //             const authCode = Math.random().toString(36).slice(2, 10).toUpperCase();
// //             return {
// //                 authCode,
// //                 shippingInstructions: `请将商品寄至：退货中心，123号，附上授权码：${authCode}`
// //             }
// //         }
// //     })
// // }

// // /**
// //  * 提交退款请求工具
// //  */
// // function createRefundSubmissionTool() {
// //     return createTool({
// //         id: "submit-refund-request",
// //         description: "提交退款请求到财务系统",
// //         inputSchema: z.object({
// //             orderId: z.string().length(12),
// //             amount: z.number(),
// //             reason: z.string()
// //         }),
// //         outputSchema: z.object({
// //             caseNumber: z.string(),
// //             estimatedDays: z.number()
// //         }),
// //         execute: async ({ context }) => {
// //             // 模拟提交退款逻辑
// //             return {
// //                 caseNumber: `REF-${Date.now()}`,
// //                 estimatedDays: 5
// //             }
// //         }
// //     })
// // }

// // /**
// //  * 初始退货处理Agent
// //  */
// // export function createReturnHandlingAgent(model: LanguageModel) {
// //     const customerServiceAgent = createCustomerServiceAgent(model)

// //     return new Agent({
// //         name: 'Return Handling Agent',
// //         instructions: `
// //         你是退货流程协调员，负责：
// //         1. 识别用户退货意图
// //         2. 收集必要信息（订单号、商品信息）
// //         3. 将完整请求转交客服Agent
        
// //         当用户提到以下关键词时触发流程：
// //         - 退货
// //         - 退款
// //         - 商品问题
        
// //         需要收集的信息：
// //         - 订单号（必须）
// //         - 退货原因（必须）
// //         - 商品照片（可选）
        
// //         当信息不完整时，要礼貌询问缺失信息
// //     `,
// //         model,
// //         tools: {
// //             transferToCustomerService: createTool({
// //                 id: "transfer-to-cs",
// //                 description: "将完整退货请求转交客服部门",
// //                 inputSchema: z.object({
// //                     orderId: z.string(),
// //                     reason: z.string(),
// //                     userEmail: z.string().email()
// //                 }),
// //                 outputSchema: z.object({
// //                     nextSteps: z.string()
// //                 }),
// //                 execute: async ({ context }) => {
// //                     const result = await customerServiceAgent.generate(`处理退货请求：
// //                         订单号：${context.orderId}
// //                         原因：${context.reason}
// //                         联系方式：${context.userEmail}`
// //                     )

// //                     return {
// //                         nextSteps: result.text
// //                     }
// //                 }
// //             })
// //         }
// //     })
// // }