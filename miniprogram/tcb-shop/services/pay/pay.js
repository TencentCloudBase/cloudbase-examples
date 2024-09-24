/**
 *
 * @param {{id: String, totalPrice: Number}} order
 * @returns
 */
export async function pay(order) {
  try {
    const res = await wx.cloud.callFunction({
      // 云函数名称
      name: 'shop_pay',
      data: {
        orderId: order.id
      },
    });
    const paymentData = res.result?.data;
    // 唤起微信支付组件，完成支付
    try {
      await wx.requestPayment({
        timeStamp: paymentData?.timeStamp,
        nonceStr: paymentData?.nonceStr,
        package: paymentData?.packageVal,
        paySign: paymentData?.paySign,
        signType: 'RSA', // 该参数为固定值
      });
    } catch (e) {
      return Promise.reject(e);
    }
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function refund(orderId) {
  const res = await wx.cloud.callFunction({
    // 云函数名称
    name: 'shop_refund',
    data: {
      orderId,
    },
  });
  if (!res?.result?.data) {
    throw new Error("refund failed", res);
  }
  return res;
}
