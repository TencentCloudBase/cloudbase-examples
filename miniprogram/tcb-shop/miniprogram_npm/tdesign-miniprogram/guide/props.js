const props = {
    backButtonProps: {
        type: Object,
    },
    current: {
        type: Number,
    },
    finishButtonProps: {
        type: Object,
    },
    hideCounter: {
        type: Boolean,
        value: false,
    },
    hideSkip: {
        type: Boolean,
        value: false,
    },
    highlightPadding: {
        type: Number,
        value: 16,
    },
    mode: {
        type: String,
        value: 'popover',
    },
    nextButtonProps: {
        type: Object,
    },
    showOverlay: {
        type: Boolean,
        value: true,
    },
    skipButtonProps: {
        type: Object,
    },
    steps: {
        type: Array,
    },
    usingCustomNavbar: {
        type: Boolean,
        value: false,
    },
    zIndex: {
        type: Number,
        value: 999999,
    },
};
export default props;
