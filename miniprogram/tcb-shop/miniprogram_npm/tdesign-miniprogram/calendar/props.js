const props = {
    autoClose: {
        type: Boolean,
        value: true,
    },
    confirmBtn: {
        type: null,
        value: '',
    },
    firstDayOfWeek: {
        type: Number,
        value: 0,
    },
    format: {
        type: null,
    },
    maxDate: {
        type: Number,
    },
    minDate: {
        type: Number,
    },
    title: {
        type: String,
        value: '请选择日期',
    },
    type: {
        type: String,
        value: 'single',
    },
    usePopup: {
        type: Boolean,
        value: true,
    },
    usingCustomNavbar: {
        type: Boolean,
        value: false,
    },
    value: {
        type: null,
        value: null,
    },
    defaultValue: {
        type: null,
    },
    visible: {
        type: Boolean,
        value: false,
    },
};
export default props;
