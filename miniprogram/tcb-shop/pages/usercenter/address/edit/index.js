import Toast from 'tdesign-miniprogram/toast/index';
import { createAddress, updateAddress } from '../../../../services/address/address';
import { addressListShouldFresh } from '../../../../utils/addressListFresh';

const innerPhoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$';
const innerNameReg = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$';

Page({
  options: {
    multipleSlots: true,
  },
  externalClasses: ['theme-wrapper-class'],
  data: {
    detailAddress: '',
    name: '',
    phone: '',
    addressId: null,

    loading: false,
  },
  setLoading() {
    this.setData({ loading: true });
  },
  unsetLoading() {
    this.setData({ loading: false });
  },
  onLoad(options) {
    const { name, address, _id, phone } = options;
    if (![name, address, _id, phone].every((x) => typeof x === 'string')) return;

    this.setData({
      name,
      detailAddress: address,
      addressId: _id,
      phone,
    });
  },
  onInputValue(event) {
    const {
      detail: { value },
      target: {
        dataset: { item },
      },
    } = event;
    this.setData({ [item]: value });
  },
  onCheckDefaultAddress({ detail }) {
    const { value } = detail;
    this.setData({
      'locationState.isDefault': value,
    });
  },
  onVerifyInputLegal() {
    const { name, phone, detailAddress } = this.data;
    const prefixPhoneReg = String(this.properties.phoneReg || innerPhoneReg);
    const prefixNameReg = String(this.properties.nameReg || innerNameReg);
    const nameRegExp = new RegExp(prefixNameReg);
    const phoneRegExp = new RegExp(prefixPhoneReg);

    if (!name || !name.trim()) {
      return {
        isLegal: false,
        tips: '请填写收货人',
      };
    }
    if (!nameRegExp.test(name)) {
      return {
        isLegal: false,
        tips: '收货人仅支持输入中文、英文（区分大小写）、数字',
      };
    }
    if (!phone || !phone.trim()) {
      return {
        isLegal: false,
        tips: '请填写手机号',
      };
    }
    if (!phoneRegExp.test(phone)) {
      return {
        isLegal: false,
        tips: '请填写正确的手机号',
      };
    }
    if (!detailAddress || !detailAddress.trim()) {
      return {
        isLegal: false,
        tips: '请完善详细地址',
      };
    }
    if (detailAddress && detailAddress.trim().length > 50) {
      return {
        isLegal: false,
        tips: '详细地址不能超过50个字符',
      };
    }
    return {
      isLegal: true,
      tips: '添加成功',
    };
  },
  toast(message) {
    Toast({
      context: this,
      selector: '#t-toast',
      message,
      icon: '',
      duration: 1000,
    });
  },
  async formSubmit() {
    const { isLegal, tips } = this.onVerifyInputLegal();

    if (isLegal) {
      const { detailAddress, name, phone, addressId } = this.data;
      this.setLoading();

      let action, failedMessage;
      if (typeof addressId === 'string') {
        action = () => updateAddress({ name, address: detailAddress, phone, _id: addressId });
        failedMessage = '修改地址失败，请稍候重试';
      } else {
        action = () => createAddress({ name, phone, address: detailAddress });
        failedMessage = '添加地址失败，请稍候重试';
      }

      try {
        await action();
        addressListShouldFresh();
        wx.navigateBack({ delta: 1 });
      } catch {
        this.toast(failedMessage);
      } finally {
        this.unsetLoading();
      }
    } else {
      this.toast(tips);
    }
  },
});
