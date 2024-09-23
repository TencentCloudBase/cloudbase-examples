/* eslint-disable no-param-reassign */
import { getAllAddress, deleteAddress } from '../../../../services/address/address';
import Toast from 'tdesign-miniprogram/toast/index';
import { resolveAddress, rejectAddress } from './util';
import { shouldFresh, addressListFinishFresh } from '../../../../utils/addressListFresh';
import { objectToParamString } from '../../../../utils/util';

Page({
  data: {
    addressList: [],
    deleteID: '',
    showDeleteConfirm: false,
    loading: false,
  },

  setLoading() {
    this.setData({ loading: true });
  },
  unsetLoading() {
    this.setData({ loading: false });
  },

  /**
   * 如果是 true 的话，点击后会选中并返回上一页；否则点击后会进入编辑页
   */
  selectMode: false,
  /** 是否已经选择地址，不置为 true 的话页面离开时会触发取消选择行为 */
  hasSelect: false,

  onLoad(query) {
    const { selectMode, id = '' } = query;
    this.setData({
      id,
    });
    this.selectMode = selectMode === 'true';
    this.init();
  },

  onShow() {
    shouldFresh && this.fresh();
  },

  init() {
    this.fresh();
  },
  onUnload() {
    if (this.selectMode && !this.hasSelect) {
      rejectAddress();
    }
  },
  async fresh() {
    this.setLoading();
    try {
      await this.getAddressList();
      addressListFinishFresh();
    } catch {
      this.toast('拉取地址失败，请稍后再试');
    } finally {
      this.unsetLoading();
    }
  },
  async getAddressList() {
    const addressList = await getAllAddress();
    this.setData({ addressList });
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
  async deleteAddressHandle({ detail: { _id } }) {
    try {
      this.setLoading();
      await deleteAddress({ id: _id });
      const { addressList } = this.data;
      this.setData({ addressList: addressList.filter((x) => x._id !== _id) });
    } catch {
      this.toast('删除地址失败，请稍后再试');
    } finally {
      this.unsetLoading();
    }
  },
  editAddressHandle({ detail }) {
    wx.navigateTo({ url: `/pages/usercenter/address/edit/index?${objectToParamString(detail)}` });
  },
  selectHandle({ detail }) {
    if (this.selectMode) {
      this.hasSelect = true;
      resolveAddress(detail);
      wx.navigateBack({ delta: 1 });
    } else {
      this.editAddressHandle({ detail });
    }
  },
  createHandle() {
    wx.navigateTo({ url: '/pages/usercenter/address/edit/index' });
  },
});
