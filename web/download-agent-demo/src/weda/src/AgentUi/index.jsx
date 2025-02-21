import * as React from "react";
import {
  generateCompositeComponent,
  useComponentProps,
  reverseUseComponentProps,
  loadRuntimeDependencies,
} from "@cloudbase/lowcode-render";
import {
  Container as GsdH5ReactContainer,
  WdMenuLayout as GsdH5ReactWdMenuLayout,
  ScrollView as GsdH5ReactScrollView,
  WdImage as GsdH5ReactWdImage,
  WdText as GsdH5ReactWdText,
  WdIcon as GsdH5ReactWdIcon,
  WdCard as GsdH5ReactWdCard,
  WdMarkdown as GsdH5ReactWdMarkdown,
  WdUnifiedLink as GsdH5ReactWdUnifiedLink,
  WdBubble as GsdH5ReactWdBubble,
  WdTextarea as GsdH5ReactWdTextarea,
  WdModal as GsdH5ReactWdModal,
  WdRating as GsdH5ReactWdRating,
  WdTagSelect as GsdH5ReactWdTagSelect,
  WdButton as GsdH5ReactWdButton,
} from "@cloudbase/weda-ui";
export default React.forwardRef((props, ref) => {
  const {
    events,
    $node,
    className,
    style,
    emit,
    $widget,
    compositeParent,
    isInComposite,
    forIndexes,
    data,
  } = reverseUseComponentProps(props);
  const [compositeComponent, setCompositeComponent] = React.useState(null);

  const item = {
    id: "index",
    name: "index",
    items: [
      {
        id: "container22",
        label: "Agent UI",
        type: "COMPLEX",
        component: "Container",
        attributes: {
          ":data":
            'Object.assign({"bot":{"botId":""},"llmConfig":{"model":"deepseek-v3","provider":"deepseek","reasonModel":"deepseek-r1","reasonModelText":""}}, $comp.props.data)',
          style: { bot: { botId: "" }, llmConfig: {} },
          class: "ai-bot-chat",
        },
        items: [
          {
            id: "menuLayout1",
            label: "聊天区",
            component: "WdMenuLayout",
            attributes: {
              defaultOpened: true,
              menu: { menuData: [] },
              outerClickClosable: true,
              template: "tab",
              type: "tab",
            },
            items: [
              {
                id: "headSlot",
                component: "",
                attributes: {},
                directives: { ":if": false },
                extra: {},
              },
              {
                id: "headRightSlot",
                component: "",
                attributes: {},
                directives: { ":if": false },
                extra: {},
              },
              {
                id: "contentSlot",
                component: "",
                items: [
                  {
                    id: "container3",
                    label: "聊天容器",
                    component: "Container",
                    attributes: {
                      data: {},
                      style: { height: "100%", padding: "0px 0px 0px" },
                    },
                    items: [
                      {
                        id: "scrollView1",
                        label: "聊天区域",
                        component: "ScrollView",
                        attributes: {
                          bounces: true,
                          enableBackToTop: false,
                          enableFlex: false,
                          enhanced: false,
                          fastDeceleration: false,
                          lowerThreshold: 50,
                          pagingEnabled: false,
                          refresherBackground: "#fff",
                          refresherDefaultStyle: "block",
                          refresherEnabled: false,
                          refresherThreshold: 50,
                          refresherTriggered: false,
                          scrollAnchoring: false,
                          ":scrollTop": "$comp.dataset.state.ai_bot_scroll_top",
                          scrollWithAnimation: false,
                          scrollX: false,
                          scrollY: true,
                          showScrollbar: false,
                          upperThreshold: 50,
                        },
                        items: [
                          {
                            id: "container1",
                            label: "智能体信息",
                            component: "Container",
                            attributes: {
                              data: {},
                              style: {
                                display: "flex",
                                padding: "20px 0px 0px",
                                alignItems: "center",
                                flexDirection: "column",
                                justifyContent: "center",
                              },
                            },
                            items: [
                              {
                                id: "image1",
                                component: "WdImage",
                                attributes: {
                                  alt: "[图片]",
                                  fit: "cover",
                                  ":src": "$comp.dataset.state.botInfo?.avatar",
                                  style: {
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "40px 40px",
                                  },
                                },
                                directives: { ":if": true },
                                extra: {
                                  staticResourceAttribute: ["src"],
                                  attributeExtraData: {},
                                },
                              },
                              {
                                id: "text1",
                                component: "WdText",
                                attributes: {
                                  inheritColor: true,
                                  maxLines: "1",
                                  ":text": "$comp.dataset.state.botInfo?.name",
                                  style: {
                                    margin: "6px 0px 0px",
                                    fontSize: "20px",
                                    fontWeight: "bolder",
                                  },
                                },
                                directives: { ":if": true },
                                extra: { attributeExtraData: {} },
                              },
                            ],
                            directives: { ":if": true },
                            extra: { attributeExtraData: {} },
                          },
                          {
                            id: "container11",
                            label: "聊天内容",
                            component: "Container",
                            attributes: {
                              data: {},
                              style: {
                                margin: "0px auto 0px",
                                padding: "0px 12px 12px",
                                maxWidth: "800px",
                              },
                            },
                            items: [
                              {
                                id: "container18",
                                label: "LLM 欢迎语句",
                                component: "Container",
                                attributes: {
                                  data: {},
                                  style: {
                                    gap: "8px",
                                    left: "50%",
                                    width: "100%",
                                    bottom: "46%",
                                    display: "flex",
                                    padding: "0 12px",
                                    position: "fixed",
                                    textAlign: "center",
                                    transform: "translateX(-50%)",
                                    alignItems: "center",
                                    flexDirection: "column",
                                  },
                                },
                                items: [
                                  {
                                    id: "container19",
                                    component: "Container",
                                    attributes: {
                                      data: {},
                                      style: {
                                        gap: "16px",
                                        display: "flex",
                                        alignItems: "center",
                                        flexDirection: "column",
                                      },
                                    },
                                    items: [
                                      {
                                        id: "icon7",
                                        component: "WdIcon",
                                        attributes: {
                                          name: "success",
                                          size: "xl",
                                          ":src":
                                            "$w.container22.data?.llmConfig?.logo\n|| ($w.container22.data?.llmConfig?.model.includes('deepseek')\n  ? 'https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/2339414f-2c0d-4537-9618-1812bd14f4af.svg'\n  : 'https://cloudcache.tencent-cloud.com/qcloud/ui/static/other_external_resource/e159ca9b-2184-488b-86c4-49ab744dbbc5.svg')",
                                          type: "custom",
                                        },
                                        directives: {
                                          ":if":
                                            "$w.container22.data?.llmConfig?.logo || ['deepseek', 'hunyuan'].some((v) => $w.container22.data?.llmConfig?.model.includes(v))",
                                        },
                                        extra: {
                                          staticResourceAttribute: ["src"],
                                          attributeExtraData: {},
                                        },
                                      },
                                      {
                                        id: "text10",
                                        component: "WdText",
                                        attributes: {
                                          inheritColor: true,
                                          level: "title-4",
                                          maxLines: "1",
                                          text: "Hi, 👋",
                                        },
                                        directives: {
                                          ":if":
                                            "!($w.container22.data?.llmConfig?.logo || ['deepseek', 'hunyuan'].some((v) => $w.container22.data?.llmConfig?.model.includes(v)))",
                                        },
                                        extra: { attributeExtraData: {} },
                                      },
                                      {
                                        id: "text7",
                                        component: "WdText",
                                        attributes: {
                                          inheritColor: true,
                                          maxLines: "1",
                                          ":text":
                                            "`我是 ${($w.container22.data?.llmConfig.reasonModel && $comp.dataset.state.enableReason) ? $w.container22.data?.llmConfig.reasonModel : $w.container22.data?.llmConfig?.model}，很高兴见到你！`",
                                          style: { fontWeight: "bolder" },
                                        },
                                        directives: { ":if": true },
                                        extra: { attributeExtraData: {} },
                                      },
                                    ],
                                    directives: { ":if": true },
                                    extra: { attributeExtraData: {} },
                                  },
                                  {
                                    id: "text8",
                                    component: "WdText",
                                    attributes: {
                                      inheritColor: true,
                                      maxLines: "1",
                                      text: "我可以帮你写代码、答疑、写作，请把你的任务交给我吧～",
                                      style: {
                                        color: "rgb(96, 96, 96)",
                                        padding: "0 12px",
                                        fontSize: "14px",
                                      },
                                    },
                                    directives: { ":if": true },
                                    extra: { attributeExtraData: {} },
                                  },
                                ],
                                directives: {
                                  ":if":
                                    "!$w.container22.data?.bot?.botId && $w.container22.data?.llmConfig?.provider\n&& $comp.dataset.state.chatRecords.length < 1",
                                },
                                extra: { attributeExtraData: {} },
                              },
                              {
                                id: "repeater1",
                                label: "聊天气泡列表",
                                component: "Repeater",
                                attributes: {
                                  ":data": "$comp.dataset.state.chatRecords",
                                  forIndex: "index_listView1",
                                  forItem: "item_listView1",
                                  key: "_id",
                                  suffix: "listView1",
                                },
                                items: [
                                  {
                                    id: "container13",
                                    label: "普通容器",
                                    component: "Container",
                                    attributes: {
                                      data: {},
                                      style: { borderRadius: "0.25rem" },
                                    },
                                    items: [
                                      {
                                        id: "container16",
                                        label: "聊天气泡",
                                        component: "Container",
                                        attributes: {
                                          data: {},
                                          style: {
                                            width: "auto",
                                            position: "relative",
                                          },
                                        },
                                        items: [
                                          {
                                            id: "card3",
                                            label: "联网搜索",
                                            component: "WdCard",
                                            attributes: {
                                              showContent: false,
                                              template: "collapse2",
                                            },
                                            items: [
                                              {
                                                id: "headerSlot",
                                                component: "",
                                                items: [
                                                  {
                                                    id: "container31",
                                                    component: "Container",
                                                    attributes: {
                                                      data: {},
                                                      style: {
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent:
                                                          "space-between",
                                                      },
                                                    },
                                                    items: [
                                                      {
                                                        id: "container39",
                                                        component: "Container",
                                                        attributes: {
                                                          data: {},
                                                        },
                                                        items: [
                                                          {
                                                            id: "text18",
                                                            label: "标题",
                                                            component: "WdText",
                                                            attributes: {
                                                              level: "title-8",
                                                              maxLines: "1",
                                                              ":text":
                                                                "$w.item_listView1.searchStatus === 1 ? '联网搜索中...' : `已参考 ${$w.item_listView1.searchResults?.length || 0} 个网页`",
                                                              style: {
                                                                color:
                                                                  "rgb(96, 96, 96)",
                                                                fontSize:
                                                                  "14px",
                                                                fontWeight:
                                                                  "normal",
                                                              },
                                                            },
                                                            directives: {
                                                              ":if": true,
                                                            },
                                                            extra: {
                                                              attributeExtraData:
                                                                {},
                                                            },
                                                          },
                                                        ],
                                                        directives: {
                                                          ":if": true,
                                                        },
                                                        extra: {
                                                          attributeExtraData:
                                                            {},
                                                        },
                                                      },
                                                      {
                                                        id: "icon18",
                                                        component: "WdIcon",
                                                        attributes: {
                                                          ":name":
                                                            "$w.card3.contentState === `show` ? `chevronup` : `chevrondown`",
                                                          size: "sm",
                                                          style: {
                                                            marginLeft:
                                                              "0.5rem",
                                                          },
                                                        },
                                                        listeners: [
                                                          {
                                                            id: "",
                                                            eventName: "tap",
                                                            type: "platform",
                                                            handler: {
                                                              params: [
                                                                {
                                                                  component:
                                                                    "card3",
                                                                  method:
                                                                    "dealContentState",
                                                                  params: {
                                                                    ":state":
                                                                      "$w.card3.contentState === `show` ? `hide` : `show`",
                                                                  },
                                                                },
                                                              ],
                                                              name: "invoke",
                                                              module:
                                                                "platform",
                                                            },
                                                            isCapturePhase: false,
                                                            noPropagation: false,
                                                          },
                                                        ],
                                                        directives: {
                                                          ":if": true,
                                                        },
                                                        extra: {
                                                          attributeExtraData:
                                                            {},
                                                        },
                                                      },
                                                    ],
                                                    directives: { ":if": true },
                                                    extra: {
                                                      attributeExtraData: {},
                                                    },
                                                  },
                                                ],
                                                directives: { ":if": true },
                                                extra: {},
                                              },
                                              {
                                                id: "contentSlot",
                                                component: "",
                                                items: [
                                                  {
                                                    id: "container38",
                                                    component: "Container",
                                                    attributes: {
                                                      data: {},
                                                      style: {
                                                        margin: "8px 0px 0px",
                                                      },
                                                    },
                                                    items: [
                                                      {
                                                        id: "repeater3",
                                                        component: "Repeater",
                                                        attributes: {
                                                          ":data":
                                                            "$w.item_listView1.searchResults",
                                                          forIndex:
                                                            "index_repeater3",
                                                          forItem:
                                                            "item_repeater3",
                                                          suffix: "repeater3",
                                                        },
                                                        items: [
                                                          {
                                                            id: "container37",
                                                            component:
                                                              "Container",
                                                            attributes: {
                                                              data: {},
                                                            },
                                                            items: [
                                                              {
                                                                id: "text22",
                                                                component:
                                                                  "WdText",
                                                                attributes: {
                                                                  level:
                                                                    "body-sm",
                                                                  maxLines: "1",
                                                                  overflow: true,
                                                                  ":text":
                                                                    "`${$w.index_repeater3 + 1}. ${$w.item_repeater3.title}`",
                                                                  style: {
                                                                    color:
                                                                      "rgb(0, 82, 217)",
                                                                    cursor:
                                                                      "pointer",
                                                                    lineHeight:
                                                                      "200%",
                                                                  },
                                                                },
                                                                directives: {
                                                                  ":if": true,
                                                                },
                                                                extra: {
                                                                  attributeExtraData:
                                                                    {},
                                                                },
                                                              },
                                                            ],
                                                            listeners: [
                                                              {
                                                                id: "wj3uyjc04ud",
                                                                eventName:
                                                                  "tap",
                                                                type: "general-func",
                                                                handler: {
                                                                  params: [{}],
                                                                  name: "iife",
                                                                  module:
                                                                    "general-func",
                                                                  ":code":
                                                                    "({event}) => {\n  if ($w.wedaContext.platforms.includes('WEB')) {\n    window.open($w.item_repeater3.url, '_blank')\n  } else if ($w.wedaContext.platforms.includes('MP')){\n    // 复制链接\n    wx.setClipboardData({\n      data: $w.item_repeater3.url,\n      success() {\n        wx.showToast({\n          title: '已复制链接',\n          icon: 'success',\n          duration: 2000\n        })\n      },\n      fail() {\n        wx.showToast({\n          title: '复制失败，请确保打开剪贴板权限',\n          icon: 'error',\n          duration: 2000\n        })\n      }\n    })\n  }\n}",
                                                                },
                                                                isCapturePhase: false,
                                                                noPropagation: false,
                                                              },
                                                            ],
                                                            directives: {
                                                              ":if": true,
                                                            },
                                                            extra: {
                                                              attributeExtraData:
                                                                {},
                                                            },
                                                          },
                                                        ],
                                                        directives: {
                                                          ":if": true,
                                                        },
                                                        extra: {
                                                          attributeExtraData:
                                                            {},
                                                        },
                                                      },
                                                    ],
                                                    directives: {
                                                      ":if":
                                                        "$w.item_listView1.searchResults?.length",
                                                    },
                                                    extra: {
                                                      attributeExtraData: {},
                                                    },
                                                  },
                                                ],
                                                directives: { ":if": true },
                                                extra: {},
                                              },
                                              {
                                                id: "footerSlot",
                                                component: "",
                                                directives: { ":if": true },
                                                extra: {},
                                              },
                                            ],
                                            directives: {
                                              ":if":
                                                "$w.item_listView1.searchStatus === 2",
                                            },
                                            scopedStyle:
                                              ":scope {\n  border: none;\n  box-shadow: none;\n  margin-bottom: 12px;\n  background-color: #f4f4f6;\n  padding: 8px 12px;\n  border-radius: 0.5rem;\n}\n:scope .wd-card__header {\n  padding: 0;\n  border: none;\n}\n:scope .wd-card__body {\n  padding: 0 !important;\n}",
                                            extra: { attributeExtraData: {} },
                                          },
                                          {
                                            id: "card4",
                                            label: "知识库",
                                            component: "WdCard",
                                            attributes: {
                                              showContent: false,
                                              showDivider: false,
                                              template: "collapse2",
                                            },
                                            items: [
                                              {
                                                id: "headerSlot",
                                                component: "",
                                                items: [
                                                  {
                                                    id: "container43",
                                                    component: "Container",
                                                    attributes: {
                                                      data: {},
                                                      style: {
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent:
                                                          "space-between",
                                                      },
                                                    },
                                                    items: [
                                                      {
                                                        id: "container41",
                                                        component: "Container",
                                                        attributes: {
                                                          data: {},
                                                          style: {
                                                            width: "100%",
                                                            display: "flex",
                                                            justifyContent:
                                                              "space-between",
                                                          },
                                                        },
                                                        items: [
                                                          {
                                                            id: "container42",
                                                            component:
                                                              "Container",
                                                            attributes: {
                                                              data: {},
                                                            },
                                                            items: [
                                                              {
                                                                id: "text27",
                                                                label: "标题",
                                                                component:
                                                                  "WdText",
                                                                attributes: {
                                                                  level:
                                                                    "title-8",
                                                                  maxLines: "1",
                                                                  ":text":
                                                                    "`已参考 ${$w.item_listView1.knowledgeBase || 0} 个知识库`",
                                                                  style: {
                                                                    color:
                                                                      "rgb(96, 96, 96)",
                                                                    fontSize:
                                                                      "14px",
                                                                    fontWeight:
                                                                      "normal",
                                                                  },
                                                                },
                                                                directives: {
                                                                  ":if": true,
                                                                },
                                                                extra: {
                                                                  attributeExtraData:
                                                                    {},
                                                                },
                                                              },
                                                            ],
                                                            directives: {
                                                              ":if": true,
                                                            },
                                                            extra: {
                                                              attributeExtraData:
                                                                {},
                                                            },
                                                          },
                                                        ],
                                                        directives: {
                                                          ":if": true,
                                                        },
                                                        extra: {
                                                          attributeExtraData:
                                                            {},
                                                        },
                                                      },
                                                      {
                                                        id: "icon19",
                                                        component: "WdIcon",
                                                        attributes: {
                                                          ":name":
                                                            "$w.card4.contentState === `show` ? `chevronup` : `chevrondown`",
                                                          size: "sm",
                                                          style: {
                                                            marginLeft:
                                                              "0.5rem",
                                                          },
                                                        },
                                                        listeners: [
                                                          {
                                                            id: "",
                                                            eventName: "tap",
                                                            type: "platform",
                                                            handler: {
                                                              params: [
                                                                {
                                                                  component:
                                                                    "card4",
                                                                  method:
                                                                    "dealContentState",
                                                                  params: {
                                                                    ":state":
                                                                      "$w.card4.contentState === `show` ? `hide` : `show`",
                                                                  },
                                                                },
                                                              ],
                                                              name: "invoke",
                                                              module:
                                                                "platform",
                                                            },
                                                            isCapturePhase: false,
                                                            noPropagation: false,
                                                          },
                                                        ],
                                                        directives: {
                                                          ":display": false,
                                                        },
                                                        extra: {
                                                          attributeExtraData:
                                                            {},
                                                        },
                                                      },
                                                    ],
                                                    directives: { ":if": true },
                                                    extra: {
                                                      attributeExtraData: {},
                                                    },
                                                  },
                                                ],
                                                directives: { ":if": true },
                                                extra: {},
                                              },
                                              {
                                                id: "contentSlot",
                                                component: "",
                                                items: [
                                                  {
                                                    id: "text26",
                                                    label: "标题",
                                                    component: "WdText",
                                                    attributes: {
                                                      maxLines: "1",
                                                      text: "",
                                                    },
                                                    directives: { ":if": true },
                                                    extra: {
                                                      attributeExtraData: {},
                                                    },
                                                  },
                                                ],
                                                directives: { ":if": true },
                                                extra: {},
                                              },
                                              {
                                                id: "footerSlot",
                                                component: "",
                                                directives: { ":if": true },
                                                extra: {},
                                              },
                                            ],
                                            directives: {
                                              ":display":
                                                "!!$w.item_listView1.knowledgeBase?.length",
                                            },
                                            scopedStyle:
                                              ":scope {\n  border: none;\n  box-shadow: none;\n  margin-bottom: 12px;\n  background-color: #f4f4f6;\n  padding: 8px 12px;\n  border-radius: 0.5rem;\n}\n:scope .wd-card__header {\n  padding: 0;\n  border: none;\n}\n:scope .wd-card__body {\n  padding: 0 !important;\n}",
                                            extra: { attributeExtraData: {} },
                                          },
                                          {
                                            id: "card2",
                                            label: "深度思考",
                                            component: "WdCard",
                                            attributes: {
                                              template: "collapse2",
                                            },
                                            items: [
                                              {
                                                id: "headerSlot",
                                                component: "",
                                                items: [
                                                  {
                                                    id: "container40",
                                                    component: "Container",
                                                    attributes: {
                                                      data: {},
                                                      style: {
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent:
                                                          "space-between",
                                                      },
                                                    },
                                                    items: [
                                                      {
                                                        id: "container12",
                                                        component: "Container",
                                                        attributes: {
                                                          data: {},
                                                          style: {
                                                            width: "100%",
                                                          },
                                                        },
                                                        items: [
                                                          {
                                                            id: "text12",
                                                            label: "标题",
                                                            component: "WdText",
                                                            attributes: {
                                                              level: "title-8",
                                                              maxLines: "1",
                                                              ":text":
                                                                "$w.item_listView1.reasoningStatus === 2\n  ? `已深度思考（用时 ${$w.item_listView1.reasoningDuration} 秒）`\n  : ($w.item_listView1.reasoningStatus === 3 ? '已停止思考' : '思考中...')",
                                                              style: {
                                                                color:
                                                                  "rgb(96, 96, 96)",
                                                                fontSize:
                                                                  "14px",
                                                                fontWeight:
                                                                  "normal",
                                                              },
                                                            },
                                                            directives: {
                                                              ":if": true,
                                                            },
                                                            extra: {
                                                              attributeExtraData:
                                                                {},
                                                            },
                                                          },
                                                        ],
                                                        directives: {
                                                          ":if": true,
                                                        },
                                                        extra: {
                                                          attributeExtraData:
                                                            {},
                                                        },
                                                      },
                                                      {
                                                        id: "icon6",
                                                        component: "WdIcon",
                                                        attributes: {
                                                          ":name":
                                                            "$w.card2.contentState === `show` ? `chevronup` : `chevrondown`",
                                                          size: "sm",
                                                          style: {
                                                            marginLeft:
                                                              "0.5rem",
                                                          },
                                                        },
                                                        listeners: [
                                                          {
                                                            id: "",
                                                            eventName: "tap",
                                                            type: "platform",
                                                            handler: {
                                                              params: [
                                                                {
                                                                  component:
                                                                    "card2",
                                                                  method:
                                                                    "dealContentState",
                                                                  params: {
                                                                    ":state":
                                                                      "$w.card2.contentState === `show` ? `hide` : `show`",
                                                                  },
                                                                },
                                                              ],
                                                              name: "invoke",
                                                              module:
                                                                "platform",
                                                            },
                                                            isCapturePhase: false,
                                                            noPropagation: false,
                                                          },
                                                        ],
                                                        directives: {
                                                          ":if": true,
                                                        },
                                                        extra: {
                                                          attributeExtraData:
                                                            {},
                                                        },
                                                      },
                                                    ],
                                                    directives: { ":if": true },
                                                    extra: {
                                                      attributeExtraData: {},
                                                    },
                                                  },
                                                ],
                                                directives: { ":if": true },
                                                extra: {},
                                              },
                                              {
                                                id: "contentSlot",
                                                component: "",
                                                items: [
                                                  {
                                                    id: "text13",
                                                    label: "标题",
                                                    component: "WdText",
                                                    attributes: {
                                                      maxLines: "1",
                                                      ":text":
                                                        "$w.item_listView1.reasoningContent",
                                                      tips: false,
                                                      userSelect: true,
                                                      style: {
                                                        color:
                                                          "rgb(96, 96, 96)",
                                                        margin: "12px 0px 0px",
                                                        fontSize: "14px",
                                                        borderLeft:
                                                          "2px solid #00000024",
                                                        fontWeight: "normal",
                                                        lineHeight: "165%",
                                                        paddingLeft: "8px",
                                                      },
                                                    },
                                                    directives: {
                                                      ":if":
                                                        "!!$w.item_listView1.reasoningContent",
                                                    },
                                                    extra: {
                                                      attributeExtraData: {},
                                                    },
                                                  },
                                                ],
                                                directives: { ":if": true },
                                                extra: {},
                                              },
                                              {
                                                id: "footerSlot",
                                                component: "",
                                                directives: { ":if": true },
                                                extra: {},
                                              },
                                            ],
                                            directives: {
                                              ":if":
                                                "!!$w.item_listView1.reasoningContent",
                                            },
                                            scopedStyle:
                                              ":scope {\n  border: none;\n  box-shadow: none;\n  margin-bottom: 12px;\n  padding: 8px 12px;\n  background-color: #f4f4f6;\n  border-radius: 0.5rem;\n}\n:scope .wd-card__header {\n  padding: 0;\n  border: none;\n}\n:scope .wd-card__body {\n  padding: 0 !important;\n}",
                                            extra: { attributeExtraData: {} },
                                          },
                                          {
                                            id: "text9",
                                            label: "用户消息",
                                            component: "WdText",
                                            attributes: {
                                              inheritColor: true,
                                              maxLines: "1",
                                              ":text":
                                                "$w.item_listView1.content",
                                              style: { userSelect: "text" },
                                            },
                                            directives: {
                                              ":if":
                                                "$w.item_listView1.role==='user'",
                                            },
                                            extra: { attributeExtraData: {} },
                                          },
                                          {
                                            id: "container44",
                                            label: "回复消息",
                                            component: "Container",
                                            attributes: {
                                              data: {},
                                              style: {
                                                display: "flex",
                                                alignItems: "center",
                                              },
                                            },
                                            items: [
                                              {
                                                id: "icon20",
                                                component: "WdIcon",
                                                attributes: {
                                                  name: "td:loading",
                                                  size: "sm",
                                                  style: {
                                                    color: "rgb(95, 114, 146)",
                                                    margin: "0px 08px 0px 0px",
                                                  },
                                                },
                                                directives: {
                                                  ":if":
                                                    "$w.item_listView1.status === 1",
                                                },
                                                extra: {
                                                  staticResourceAttribute: [
                                                    "src",
                                                  ],
                                                  attributeExtraData: {},
                                                },
                                              },
                                              {
                                                id: "markdown1",
                                                component: "WdMarkdown",
                                                attributes: {
                                                  ":options":
                                                    "{\n  html:         false,        // 在源码中启用 HTML 标签\n  xhtmlOut:     false,        // 使用 / 来闭合单标签 （比如 <br />）。\n                              // 这个选项只对完全的 CommonMark 模式兼容。\n  breaks:       false,        // 转换段落里的 换行符 到 <br>。\n  langPrefix:   'language-',  // 给围栏代码块的 CSS 语言前缀。对于额外的高亮代码非常有用。\n  linkify:      false,        // 将类似 URL 的文本自动转换为链接。\n\n  // 启用一些语言中立的替换 + 引号美化\n  typographer:  false,\n\n  // 双 + 单引号替换对，当 typographer 启用时。\n  // 或者智能引号等，可以是 String 或 Array。\n  //\n  // 比方说，你可以支持 '«»„“' 给俄罗斯人使用， '„“‚‘'  给德国人使用。\n  quotes: '“”‘’',\n\n}\n",
                                                  ":value":
                                                    "$w.item_listView1.content",
                                                  style: { padding: "0px" },
                                                  class: "agent_markdown",
                                                },
                                                directives: {
                                                  ":if":
                                                    "$w.item_listView1.role!='user'",
                                                },
                                                extra: {
                                                  attributeExtraData: {},
                                                },
                                              },
                                            ],
                                            directives: { ":if": true },
                                            extra: { attributeExtraData: {} },
                                          },
                                          {
                                            id: "container20",
                                            label: "错误提示",
                                            component: "Container",
                                            attributes: {
                                              data: {},
                                              style: {
                                                gap: "8px",
                                                margin: "8px 0px 0px",
                                                display: "flex",
                                                alignItems: "center",
                                              },
                                            },
                                            items: [
                                              {
                                                id: "icon16",
                                                component: "WdIcon",
                                                attributes: {
                                                  name: "td:error-circle",
                                                  size: "sm",
                                                },
                                                directives: { ":if": true },
                                                extra: {
                                                  staticResourceAttribute: [
                                                    "src",
                                                  ],
                                                  attributeExtraData: {},
                                                },
                                              },
                                              {
                                                id: "text11",
                                                label: "错误提示",
                                                component: "WdText",
                                                attributes: {
                                                  inheritColor: true,
                                                  maxLines: "1",
                                                  text: "出错了，请稍后再试。",
                                                },
                                                directives: { ":if": true },
                                                extra: {
                                                  attributeExtraData: {},
                                                },
                                              },
                                            ],
                                            directives: {
                                              ":if":
                                                "!!$w.item_listView1.failed",
                                            },
                                            extra: { attributeExtraData: {} },
                                          },
                                          {
                                            id: "card1",
                                            label: "参考引用",
                                            component: "WdCard",
                                            attributes: {
                                              ":showContent":
                                                "!($w.wedaContext.platforms.includes('MOBILEWEB') || $w.wedaContext.platforms.includes('MP'))",
                                              showDivider: false,
                                              template: "collapse2",
                                              style: {
                                                border: "unset",
                                                cursor: "pointer",
                                                margin: "10px 0px",
                                                padding: "0px 0px 0px",
                                                boxShadow: "unset",
                                                borderRadius: "3px",
                                                backgroundColor:
                                                  "rgba(241, 242, 245, 1)",
                                              },
                                            },
                                            items: [
                                              {
                                                id: "headerSlot",
                                                component: "",
                                                items: [
                                                  {
                                                    id: "container9",
                                                    component: "Container",
                                                    attributes: {
                                                      data: {},
                                                      style: { width: "100%" },
                                                    },
                                                    items: [
                                                      {
                                                        id: "container10",
                                                        component: "Container",
                                                        attributes: {
                                                          data: {},
                                                          style: {
                                                            display: "flex",
                                                            alignItems:
                                                              "center",
                                                            flexDirection:
                                                              "row",
                                                          },
                                                        },
                                                        items: [
                                                          {
                                                            id: "icon15",
                                                            component: "WdIcon",
                                                            attributes: {
                                                              size: "xs",
                                                              src: "https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/134223d9-1cd5-4454-b6be-7fe7cb983285.svg",
                                                              type: "custom",
                                                              style: {
                                                                margin:
                                                                  "0px 6px 0px 0px",
                                                              },
                                                            },
                                                            directives: {
                                                              ":if": true,
                                                            },
                                                            extra: {
                                                              staticResourceAttribute:
                                                                ["src"],
                                                              attributeExtraData:
                                                                {},
                                                            },
                                                          },
                                                          {
                                                            id: "text5",
                                                            label: "标题",
                                                            component: "WdText",
                                                            attributes: {
                                                              level: "title-8",
                                                              text: "基于以下文档作为参考",
                                                              userSelect: true,
                                                              style: {
                                                                color:
                                                                  "#13161B",
                                                                fontSize:
                                                                  "14px",
                                                                fontWeight: 500,
                                                                lineHeight:
                                                                  "20px",
                                                              },
                                                            },
                                                            directives: {
                                                              ":if": true,
                                                            },
                                                            extra: {
                                                              attributeExtraData:
                                                                {},
                                                            },
                                                          },
                                                        ],
                                                        listeners: [
                                                          {
                                                            id: "w0gpll936se",
                                                            eventName: "tap",
                                                            type: "general-func",
                                                            handler: {
                                                              params: [{}],
                                                              name: "iife",
                                                              module:
                                                                "general-func",
                                                              ":code":
                                                                "({event}) => {\n  $w.card1.dealContentState($w.card1.contentState === `show` ? `hide` : `show`)\n}",
                                                            },
                                                            isCapturePhase: false,
                                                            noPropagation: false,
                                                          },
                                                        ],
                                                        directives: {
                                                          ":if": true,
                                                        },
                                                        extra: {
                                                          attributeExtraData:
                                                            {},
                                                        },
                                                      },
                                                    ],
                                                    directives: { ":if": true },
                                                    extra: {
                                                      attributeExtraData: {},
                                                    },
                                                  },
                                                  {
                                                    id: "icon5",
                                                    component: "WdIcon",
                                                    attributes: {
                                                      ":name":
                                                        "$w.card1.contentState === `show` ? `chevronup` : `chevrondown`",
                                                      size: "xs",
                                                      style: {
                                                        marginLeft: "0.5rem",
                                                      },
                                                    },
                                                    listeners: [
                                                      {
                                                        id: "",
                                                        eventName: "tap",
                                                        type: "platform",
                                                        handler: {
                                                          params: [
                                                            {
                                                              component:
                                                                "card1",
                                                              method:
                                                                "dealContentState",
                                                              params: {
                                                                ":state":
                                                                  "$w.card1.contentState === `show` ? `hide` : `show`",
                                                              },
                                                            },
                                                          ],
                                                          name: "invoke",
                                                          module: "platform",
                                                        },
                                                        isCapturePhase: false,
                                                        noPropagation: false,
                                                      },
                                                    ],
                                                    directives: { ":if": true },
                                                    extra: {
                                                      staticResourceAttribute: [
                                                        "src",
                                                      ],
                                                      attributeExtraData: {},
                                                    },
                                                  },
                                                ],
                                                directives: { ":if": true },
                                                extra: {},
                                              },
                                              {
                                                id: "contentSlot",
                                                component: "",
                                                items: [
                                                  {
                                                    id: "repeater2",
                                                    component: "Repeater",
                                                    attributes: {
                                                      ":data":
                                                        "$w.item_listView1.knowledgeBase||[]",
                                                      forIndex:
                                                        "index_repeater2",
                                                      forItem: "item_repeater2",
                                                      suffix: "repeater2",
                                                    },
                                                    items: [
                                                      {
                                                        id: "unifiedLink1",
                                                        component:
                                                          "WdUnifiedLink",
                                                        attributes: {
                                                          ":options":
                                                            "({\n  target: '_blank'\n  /**\n   * 支持web端打开新窗口\n   * 例如：\n   * target:'_blank'\n   */\n\n  /**\n   * 支持小程序端传递扩展参数\n   * 例如打开其他小程序场景：\n   * env_version:'develop'\n   */\n\n})",
                                                          params: {},
                                                          ":url":
                                                            "$w.item_repeater2.url",
                                                          style: {
                                                            display: "flex",
                                                            alignItems:
                                                              "center",
                                                            flexDirection:
                                                              "row",
                                                            justifyContent:
                                                              "flex-start",
                                                          },
                                                        },
                                                        items: [
                                                          {
                                                            id: "text20",
                                                            component: "WdText",
                                                            attributes: {
                                                              level: "body-sm",
                                                              ":text":
                                                                "`[${$w.index_repeater2 + 1}] ${$w.item_repeater2.title}`",
                                                              userSelect: true,
                                                              style: {
                                                                color:
                                                                  "#000000B2",
                                                                fontSize:
                                                                  "14px",
                                                                fontWeight: 400,
                                                                lineHeight:
                                                                  "16.8px",
                                                                marginBottom:
                                                                  "12px",
                                                                textDecoration:
                                                                  "underline",
                                                              },
                                                            },
                                                            directives: {
                                                              ":if": true,
                                                            },
                                                            extra: {
                                                              attributeExtraData:
                                                                {},
                                                            },
                                                          },
                                                        ],
                                                        directives: {
                                                          ":if": true,
                                                        },
                                                        extra: {
                                                          attributeExtraData:
                                                            {},
                                                        },
                                                      },
                                                    ],
                                                    directives: { ":if": true },
                                                    extra: {
                                                      attributeExtraData: {},
                                                    },
                                                  },
                                                ],
                                                directives: { ":if": true },
                                                extra: {},
                                              },
                                              {
                                                id: "footerSlot",
                                                component: "",
                                                directives: { ":if": true },
                                                extra: {},
                                              },
                                            ],
                                            directives: {
                                              ":if":
                                                "($w.item_listView1.knowledgeBase||[]).length",
                                            },
                                            scopedStyle:
                                              ":scope .wd-card__header {\n  padding:12px;\n}\n:scope .wd-card__body  {\n  padding:0px 12px;\n}",
                                            extra: { attributeExtraData: {} },
                                          },
                                          {
                                            id: "container2",
                                            label: "普通容器操作栏",
                                            component: "Container",
                                            attributes: {
                                              data: {},
                                              style: {
                                                display: "flex",
                                                alignItems: "center",
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                              },
                                            },
                                            items: [
                                              {
                                                id: "container15",
                                                component: "Container",
                                                attributes: {
                                                  data: {},
                                                  style: {
                                                    gap: "16px",
                                                    flex: 1,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    flexDirection: "row",
                                                    justifyContent:
                                                      "flex-start",
                                                  },
                                                },
                                                items: [
                                                  {
                                                    id: "bubble1",
                                                    component: "WdBubble",
                                                    attributes: {
                                                      placement: "bottom",
                                                    },
                                                    items: [
                                                      {
                                                        id: "bubbleContent",
                                                        component: "",
                                                        items: [
                                                          {
                                                            id: "container29",
                                                            component:
                                                              "Container",
                                                            attributes: {
                                                              data: {},
                                                              style: {
                                                                textAlign:
                                                                  "center",
                                                              },
                                                            },
                                                            items: [
                                                              {
                                                                id: "text14",
                                                                component:
                                                                  "WdText",
                                                                attributes: {
                                                                  maxLines: "1",
                                                                  text: "重新生成",
                                                                  style: {
                                                                    fontSize:
                                                                      "12px",
                                                                  },
                                                                },
                                                                directives: {
                                                                  ":if": true,
                                                                },
                                                                extra: {
                                                                  attributeExtraData:
                                                                    {},
                                                                },
                                                              },
                                                            ],
                                                            directives: {
                                                              ":if": true,
                                                            },
                                                            extra: {
                                                              attributeExtraData:
                                                                {},
                                                            },
                                                          },
                                                        ],
                                                        directives: {
                                                          ":if": true,
                                                        },
                                                        extra: {},
                                                      },
                                                      {
                                                        id: "bubbleChildren",
                                                        component: "",
                                                        items: [
                                                          {
                                                            id: "container30",
                                                            component:
                                                              "Container",
                                                            attributes: {
                                                              data: {},
                                                              style: {
                                                                width: "24px",
                                                                cursor:
                                                                  "pointer",
                                                                height: "24px",
                                                                display: "flex",
                                                                alignItems:
                                                                  "center",
                                                                borderRadius:
                                                                  "12px",
                                                                justifyContent:
                                                                  "center",
                                                              },
                                                            },
                                                            items: [
                                                              {
                                                                id: "icon8",
                                                                component:
                                                                  "WdIcon",
                                                                attributes: {
                                                                  name: "nointernet",
                                                                  size: "xs",
                                                                  style: {
                                                                    color:
                                                                      "rgb(227, 77, 89)",
                                                                  },
                                                                },
                                                                directives: {
                                                                  ":if": true,
                                                                },
                                                                extra: {
                                                                  staticResourceAttribute:
                                                                    ["src"],
                                                                  attributeExtraData:
                                                                    {},
                                                                },
                                                              },
                                                            ],
                                                            listeners: [
                                                              {
                                                                id: "wg3waf8kjv6",
                                                                eventName:
                                                                  "tap",
                                                                type: "general-func",
                                                                handler: {
                                                                  params: [{}],
                                                                  name: "iife",
                                                                  module:
                                                                    "general-func",
                                                                  ":code":
                                                                    "({event}) => {\n  const i = $w.index_listView1 - 2\n  const latstContent = $comp.dataset.state.ai_bot_chat_history[i]?.content\n\n  if (latstContent) {\n    return $comp.handler.ai_bot_resend_msg({\n      data: {\n        target: {\n          content: latstContent\n        }\n      }\n    })\n  }\n}",
                                                                },
                                                                isCapturePhase: false,
                                                                noPropagation: false,
                                                              },
                                                            ],
                                                            directives: {
                                                              ":if": true,
                                                            },
                                                            scopedStyle:
                                                              ":scope:hover {\n  background-color: rgb(241, 242, 245);\n}",
                                                            extra: {
                                                              attributeExtraData:
                                                                {},
                                                            },
                                                          },
                                                        ],
                                                        directives: {
                                                          ":if": true,
                                                        },
                                                        extra: {},
                                                      },
                                                    ],
                                                    directives: {
                                                      ":if": false,
                                                    },
                                                    extra: {
                                                      attributeExtraData: {},
                                                    },
                                                  },
                                                  {
                                                    id: "container25",
                                                    component: "Container",
                                                    attributes: {
                                                      data: {},
                                                      style: {
                                                        gap: "4px",
                                                        color:
                                                          "rgb(128, 128, 128)",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        marginTop: "8px",
                                                        alignItems: "center",
                                                      },
                                                    },
                                                    items: [
                                                      {
                                                        id: "icon9",
                                                        component: "WdIcon",
                                                        attributes: {
                                                          name: "success",
                                                          size: "xs",
                                                          src: "https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/0f3a2b30-9ed5-441d-af26-2d3ee3936a2c.svg",
                                                          type: "custom",
                                                        },
                                                        directives: {
                                                          ":if": true,
                                                        },
                                                        extra: {
                                                          staticResourceAttribute:
                                                            ["src"],
                                                          attributeExtraData:
                                                            {},
                                                        },
                                                      },
                                                      {
                                                        id: "text15",
                                                        component: "WdText",
                                                        attributes: {
                                                          inheritColor: true,
                                                          maxLines: "1",
                                                          text: "复制",
                                                          style: {
                                                            fontSize: "14px",
                                                          },
                                                        },
                                                        directives: {
                                                          ":if": true,
                                                        },
                                                        extra: {
                                                          attributeExtraData:
                                                            {},
                                                        },
                                                      },
                                                    ],
                                                    listeners: [
                                                      {
                                                        id: "wut8yq2dti4",
                                                        eventName: "tap",
                                                        type: "platform",
                                                        handler: {
                                                          params: [
                                                            {
                                                              ":data":
                                                                "`${$w.item_listView1.content}\n\n${JSON.parse($w.item_listView1.refs || '[]').filter(item => item.url).map((item, index) => {\n  return `${index === 0 ? '回答基于以下参考文档\\n' : ''}${[index + 1]}. [${item.title}](${item.url})`;\n}).join('\\n')}\n\n以上回答由 AI 完成（基于微信云开发 AI 智能体）\n`",
                                                            },
                                                          ],
                                                          name: "setClipboardData",
                                                          module: "platform",
                                                        },
                                                        isCapturePhase: false,
                                                        noPropagation: false,
                                                      },
                                                      {
                                                        id: "wke2wzs8uug",
                                                        eventName:
                                                          "wut8yq2dti4.success",
                                                        type: "platform",
                                                        handler: {
                                                          params: [
                                                            {
                                                              duration: 3000,
                                                              icon: "none",
                                                              title:
                                                                "已成功复制聊天内容",
                                                            },
                                                          ],
                                                          name: "showToast",
                                                          module: "platform",
                                                        },
                                                        isCapturePhase: false,
                                                        noPropagation: false,
                                                      },
                                                    ],
                                                    directives: { ":if": true },
                                                    extra: {
                                                      attributeExtraData: {},
                                                    },
                                                  },
                                                ],
                                                directives: { ":if": true },
                                                extra: {
                                                  attributeExtraData: {},
                                                },
                                              },
                                              {
                                                id: "container23",
                                                component: "Container",
                                                attributes: {
                                                  data: {},
                                                  style: {
                                                    gap: "16px",
                                                    flex: 1,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    flexDirection: "row",
                                                    justifyContent: "flex-end",
                                                  },
                                                },
                                                items: [
                                                  {
                                                    id: "bubble5",
                                                    component: "WdBubble",
                                                    attributes: {
                                                      placement: "bottom",
                                                    },
                                                    items: [
                                                      {
                                                        id: "bubbleContent",
                                                        component: "",
                                                        items: [
                                                          {
                                                            id: "container5",
                                                            component:
                                                              "Container",
                                                            attributes: {
                                                              data: {},
                                                              style: {
                                                                textAlign:
                                                                  "center",
                                                              },
                                                            },
                                                            items: [
                                                              {
                                                                id: "text4",
                                                                component:
                                                                  "WdText",
                                                                attributes: {
                                                                  maxLines: "1",
                                                                  text: "分享聊天记录",
                                                                  style: {
                                                                    fontSize:
                                                                      "12px",
                                                                  },
                                                                },
                                                                directives: {
                                                                  ":if": true,
                                                                },
                                                                extra: {
                                                                  attributeExtraData:
                                                                    {},
                                                                },
                                                              },
                                                            ],
                                                            directives: {
                                                              ":if": true,
                                                            },
                                                            extra: {
                                                              attributeExtraData:
                                                                {},
                                                            },
                                                          },
                                                        ],
                                                        directives: {
                                                          ":if": true,
                                                        },
                                                        extra: {},
                                                      },
                                                      {
                                                        id: "bubbleChildren",
                                                        component: "",
                                                        items: [
                                                          {
                                                            id: "container6",
                                                            component:
                                                              "Container",
                                                            attributes: {
                                                              data: {},
                                                              style: {
                                                                width: "24px",
                                                                cursor:
                                                                  "pointer",
                                                                height: "24px",
                                                                display: "flex",
                                                                alignItems:
                                                                  "center",
                                                                borderRadius:
                                                                  "12px",
                                                                justifyContent:
                                                                  "center",
                                                              },
                                                            },
                                                            items: [
                                                              {
                                                                id: "icon2",
                                                                component:
                                                                  "WdIcon",
                                                                attributes: {
                                                                  name: "td:share-1",
                                                                  size: "xs",
                                                                },
                                                                directives: {
                                                                  ":if": true,
                                                                },
                                                                extra: {
                                                                  staticResourceAttribute:
                                                                    ["src"],
                                                                  attributeExtraData:
                                                                    {},
                                                                },
                                                              },
                                                            ],
                                                            directives: {
                                                              ":if": true,
                                                            },
                                                            ":style":
                                                              "$comp.dataset.params.debug === '1' ? {\n  cursor: 'not-allowed',\n  opacity: 0.6\n} : {}",
                                                            scopedStyle:
                                                              ":scope:hover {\n  background-color: rgb(241, 242, 245);\n}",
                                                            extra: {
                                                              attributeExtraData:
                                                                {},
                                                            },
                                                          },
                                                        ],
                                                        directives: {
                                                          ":if": true,
                                                        },
                                                        extra: {},
                                                      },
                                                    ],
                                                    directives: { ":if": true },
                                                    extra: {
                                                      attributeExtraData: {},
                                                    },
                                                  },
                                                  {
                                                    id: "bubble2",
                                                    component: "WdBubble",
                                                    attributes: {
                                                      placement: "bottom",
                                                    },
                                                    items: [
                                                      {
                                                        id: "bubbleContent",
                                                        component: "",
                                                        items: [
                                                          {
                                                            id: "container32",
                                                            component:
                                                              "Container",
                                                            attributes: {
                                                              data: {},
                                                              style: {
                                                                textAlign:
                                                                  "center",
                                                              },
                                                            },
                                                            items: [
                                                              {
                                                                id: "text16",
                                                                component:
                                                                  "WdText",
                                                                attributes: {
                                                                  maxLines: "1",
                                                                  text: "向小助手反馈",
                                                                  style: {
                                                                    fontSize:
                                                                      "12px",
                                                                  },
                                                                },
                                                                directives: {
                                                                  ":if": true,
                                                                },
                                                                extra: {
                                                                  attributeExtraData:
                                                                    {},
                                                                },
                                                              },
                                                            ],
                                                            directives: {
                                                              ":if": true,
                                                            },
                                                            extra: {
                                                              attributeExtraData:
                                                                {},
                                                            },
                                                          },
                                                        ],
                                                        directives: {
                                                          ":if": true,
                                                        },
                                                        extra: {},
                                                      },
                                                      {
                                                        id: "bubbleChildren",
                                                        component: "",
                                                        items: [
                                                          {
                                                            id: "container33",
                                                            component:
                                                              "Container",
                                                            attributes: {
                                                              data: {},
                                                              style: {
                                                                width: "24px",
                                                                cursor:
                                                                  "pointer",
                                                                height: "24px",
                                                                display: "flex",
                                                                alignItems:
                                                                  "center",
                                                                borderRadius:
                                                                  "12px",
                                                                justifyContent:
                                                                  "center",
                                                              },
                                                            },
                                                            items: [
                                                              {
                                                                id: "icon10",
                                                                component:
                                                                  "WdIcon",
                                                                attributes: {
                                                                  name: "success",
                                                                  size: "xs",
                                                                  src: "https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/636e9676-0fb9-431b-bc4f-593d0e209730.svg",
                                                                  type: "custom",
                                                                },
                                                                directives: {
                                                                  ":if": true,
                                                                },
                                                                extra: {
                                                                  staticResourceAttribute:
                                                                    ["src"],
                                                                  attributeExtraData:
                                                                    {},
                                                                },
                                                              },
                                                            ],
                                                            listeners: [
                                                              {
                                                                id: "w15tnc4yerz",
                                                                eventName:
                                                                  "tap",
                                                                type: "platform",
                                                                handler: {
                                                                  params: [
                                                                    {
                                                                      component:
                                                                        "modal1",
                                                                      method:
                                                                        "open",
                                                                      params: {
                                                                        ":info":
                                                                          "({\n  type: 'upvote',\n  index:$w.index_listView1\n})",
                                                                      },
                                                                    },
                                                                  ],
                                                                  name: "invoke",
                                                                  module:
                                                                    "platform",
                                                                },
                                                                isCapturePhase: false,
                                                                noPropagation: false,
                                                              },
                                                            ],
                                                            directives: {
                                                              ":if": true,
                                                            },
                                                            ":style":
                                                              "$comp.dataset.params.debug === '1' ? {\n  cursor: 'not-allowed',\n  opacity: 0.6\n} : {}",
                                                            scopedStyle:
                                                              ":scope:hover {\n  background-color: rgb(241, 242, 245);\n}",
                                                            extra: {
                                                              attributeExtraData:
                                                                {},
                                                            },
                                                          },
                                                        ],
                                                        directives: {
                                                          ":if": true,
                                                        },
                                                        extra: {},
                                                      },
                                                    ],
                                                    directives: { ":if": "" },
                                                    extra: {
                                                      attributeExtraData: {},
                                                    },
                                                  },
                                                  {
                                                    id: "bubble3",
                                                    component: "WdBubble",
                                                    attributes: {
                                                      placement: "bottom",
                                                    },
                                                    items: [
                                                      {
                                                        id: "bubbleContent",
                                                        component: "",
                                                        items: [
                                                          {
                                                            id: "container34",
                                                            component:
                                                              "Container",
                                                            attributes: {
                                                              data: {},
                                                              style: {
                                                                textAlign:
                                                                  "center",
                                                              },
                                                            },
                                                            items: [
                                                              {
                                                                id: "text17",
                                                                component:
                                                                  "WdText",
                                                                attributes: {
                                                                  maxLines: "1",
                                                                  text: "向小助手反馈",
                                                                  style: {
                                                                    fontSize:
                                                                      "12px",
                                                                  },
                                                                },
                                                                directives: {
                                                                  ":if": true,
                                                                },
                                                                extra: {
                                                                  attributeExtraData:
                                                                    {},
                                                                },
                                                              },
                                                            ],
                                                            directives: {
                                                              ":if": true,
                                                            },
                                                            extra: {
                                                              attributeExtraData:
                                                                {},
                                                            },
                                                          },
                                                        ],
                                                        directives: {
                                                          ":if": true,
                                                        },
                                                        extra: {},
                                                      },
                                                      {
                                                        id: "bubbleChildren",
                                                        component: "",
                                                        items: [
                                                          {
                                                            id: "container35",
                                                            component:
                                                              "Container",
                                                            attributes: {
                                                              data: {},
                                                              style: {
                                                                width: "24px",
                                                                cursor:
                                                                  "pointer",
                                                                height: "24px",
                                                                display: "flex",
                                                                alignItems:
                                                                  "center",
                                                                borderRadius:
                                                                  "12px",
                                                                justifyContent:
                                                                  "center",
                                                              },
                                                            },
                                                            items: [
                                                              {
                                                                id: "icon11",
                                                                component:
                                                                  "WdIcon",
                                                                attributes: {
                                                                  name: "success",
                                                                  size: "xs",
                                                                  src: "https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/ff538120-96bd-4063-bb76-41f4a615490d.svg",
                                                                  type: "custom",
                                                                },
                                                                directives: {
                                                                  ":if": true,
                                                                },
                                                                extra: {
                                                                  staticResourceAttribute:
                                                                    ["src"],
                                                                  attributeExtraData:
                                                                    {},
                                                                },
                                                              },
                                                            ],
                                                            listeners: [
                                                              {
                                                                id: "wvc9p49w0s6",
                                                                eventName:
                                                                  "tap",
                                                                type: "platform",
                                                                handler: {
                                                                  params: [
                                                                    {
                                                                      component:
                                                                        "modal1",
                                                                      method:
                                                                        "open",
                                                                      params: {
                                                                        ":info":
                                                                          "({\n    type: 'downvote',\n    index:$w.index_listView1\n})",
                                                                      },
                                                                    },
                                                                  ],
                                                                  name: "invoke",
                                                                  module:
                                                                    "platform",
                                                                },
                                                                isCapturePhase: false,
                                                                noPropagation: false,
                                                              },
                                                            ],
                                                            directives: {
                                                              ":if": true,
                                                            },
                                                            ":style":
                                                              "$comp.dataset.params.debug === '1' ? {\n  cursor: 'not-allowed',\n  opacity: 0.6\n} : {}",
                                                            scopedStyle:
                                                              ":scope:hover {\n  background-color: rgb(241, 242, 245);\n}",
                                                            extra: {
                                                              attributeExtraData:
                                                                {},
                                                            },
                                                          },
                                                        ],
                                                        directives: {
                                                          ":if": true,
                                                        },
                                                        extra: {},
                                                      },
                                                    ],
                                                    directives: {
                                                      ":if":
                                                        "$w.item_listView1.role === 'assistant' && $w.item_listView1.type !== 'welcome'",
                                                    },
                                                    extra: {
                                                      attributeExtraData: {},
                                                    },
                                                  },
                                                ],
                                                directives: {
                                                  ":if":
                                                    "false && !$w.container22.data.isPreview",
                                                },
                                                extra: {
                                                  attributeExtraData: {},
                                                },
                                              },
                                            ],
                                            directives: {
                                              ":if":
                                                "$w.item_listView1.role === 'assistant' && !($w.item_listView1.btnGroupShow === 'hidden')",
                                            },
                                            extra: { attributeExtraData: {} },
                                          },
                                        ],
                                        directives: {
                                          ":if":
                                            "!! $w.item_listView1.content\n|| $w.item_listView1.reasoningContent",
                                        },
                                        ":class":
                                          "$w.item_listView1.role === 'user' ? 'ai-bot-chat__message-user' : 'ai-bot-chat__message-system'",
                                        extra: { attributeExtraData: {} },
                                      },
                                    ],
                                    directives: { ":if": true },
                                    ":class":
                                      "$w.item_listView1.role === 'user' ? 'ai-bot-chat__message-container-user' : 'ai-bot-chat__message-container-system'",
                                    ":style":
                                      "$w.item_listView1.role === 'user' ? {\n  display: 'flex',\n  justifyContent: 'flex-end'\n} : {}",
                                    extra: { attributeExtraData: {} },
                                  },
                                ],
                                directives: { ":if": true },
                                extra: { attributeExtraData: {} },
                              },
                              {
                                id: "repeater5",
                                label: "推荐问题",
                                component: "Repeater",
                                attributes: {
                                  ":data":
                                    "$comp.dataset.state.recommendQuestions.filter(item=>!!item)",
                                  forIndex: "index_listView1",
                                  forItem: "item_listView1",
                                  key: "_id",
                                  suffix: "listView1",
                                },
                                items: [
                                  {
                                    id: "container26",
                                    component: "Container",
                                    attributes: {
                                      data: {},
                                      style: { padding: "8px 0px 0px" },
                                    },
                                    items: [
                                      {
                                        id: "container27",
                                        component: "Container",
                                        attributes: {
                                          data: {},
                                          style: {
                                            border: "1px solid #E9ECF1",
                                            cursor: "pointer",
                                            display: "inline-block",
                                            padding: "4px 16px",
                                            maxWidth: "100%",
                                            borderRadius: "18px",
                                            backgroundColor: "white",
                                          },
                                        },
                                        items: [
                                          {
                                            id: "text19",
                                            component: "WdText",
                                            attributes: {
                                              inheritColor: true,
                                              maxLines: "1",
                                              ":text": "$w.item_listView1",
                                              style: {
                                                color: "#000000B2",
                                                fontSize: "14px",
                                                maxWidth: "100%",
                                                overflow: "hidden",
                                                wordBreak: "break-all",
                                                fontWeight: 400,
                                                lineHeight: "26px",
                                                whiteSpace: "nowrap",
                                                textOverflow: "ellipsis",
                                              },
                                            },
                                            directives: { ":if": true },
                                            extra: { attributeExtraData: {} },
                                          },
                                        ],
                                        listeners: [
                                          {
                                            id: "wohl1yvtt3j",
                                            eventName: "tap",
                                            type: "general-func",
                                            handler: {
                                              params: [{}],
                                              name: "iife",
                                              module: "general-func",
                                              ":code":
                                                '({ event }) => {\n  const content = $w.item_listView1\n  $comp.dataset.state.chatRecords =[...$comp.dataset.state.chatRecords,\n    {\n      "role": "user",\n      "type": "text",\n      "content": content,\n      "bot": $comp.dataset.state.botInfo.botId\n    }]\n  $w.sendMessage.trigger(content)\n}',
                                            },
                                            isCapturePhase: false,
                                            noPropagation: false,
                                          },
                                        ],
                                        directives: { ":if": true },
                                        scopedStyle:
                                          ":scope:hover {\n  background-color: #F1F2F5 !important;\n}",
                                        extra: { attributeExtraData: {} },
                                      },
                                    ],
                                    directives: { ":if": true },
                                    extra: { attributeExtraData: {} },
                                  },
                                ],
                                directives: { ":if": true },
                                extra: { attributeExtraData: {} },
                              },
                            ],
                            directives: { ":if": true },
                            extra: { attributeExtraData: {} },
                          },
                        ],
                        listeners: [
                          {
                            id: "wk16hrnqmtc",
                            eventName: "scrolltolower",
                            type: "general-func",
                            handler: {
                              params: [{}],
                              name: "iife",
                              module: "general-func",
                              ":code":
                                "({event}) => {\n  $comp.dataset.state.ai_bot_ui_scroll_to_bottom = true\n}",
                            },
                            isCapturePhase: false,
                            noPropagation: false,
                          },
                          {
                            id: "w3wu6xo0zn8",
                            eventName: "scroll",
                            type: "general-func",
                            handler: {
                              params: [{}],
                              name: "iife",
                              module: "general-func",
                              ":code":
                                "({event}) => {\n  const scrollTop = event.detail.scrollTop;\n  const scrollHeight = event.detail.scrollHeight;\n  const scrollRatio = scrollTop / scrollHeight;\n\n  // 获取上一次的滚动位置（如果存在）\n  const previousScrollTop = $comp.dataset.state.ai_bot_ui_scroll_top || 0;\n\n  // 更新滚动位置和其他状态\n  $comp.dataset.state.ai_bot_ui_scroll_top = scrollTop\n  $comp.dataset.state.ai_bot_ui_scroll_height = scrollHeight\n  $comp.dataset.state.ai_bot_ui_scroll_ratio = scrollRatio\n\n  // 判断是否滚动到顶部\n  if (scrollTop === 0) {\n    // console.log('已滚动到顶部');\n  }\n\n  // 判断是否滚动到底部\n  if (scrollTop  >= scrollHeight) {\n    // console.log('已滚动到底部');\n  }\n\n  // 判断是否向上滚动\n  if (scrollTop + 50 < previousScrollTop + 10) {\n    // console.log('向上滚动 50 px以上');\n    $comp.dataset.state.ai_bot_ui_scroll_to_bottom = false\n  }\n}",
                            },
                            isCapturePhase: false,
                            noPropagation: false,
                          },
                        ],
                        directives: { ":if": true },
                        scopedStyle: ":scope{\n  height: 100%;\n}",
                        extra: { attributeExtraData: {} },
                      },
                    ],
                    directives: { ":if": true },
                    extra: { attributeExtraData: {} },
                  },
                ],
                directives: { ":if": true },
                extra: {},
              },
              {
                id: "footerSlot",
                component: "",
                items: [
                  {
                    id: "container28",
                    label: "输入框",
                    component: "Container",
                    attributes: {
                      data: {},
                      style: {
                        width: "100%",
                        margin: "0 auto",
                        zIndex: 200,
                        maxWidth: "800px",
                        position: "relative",
                      },
                      class: "ai-bot-chat__input-box",
                    },
                    items: [
                      {
                        id: "textarea1",
                        label: "多行输入",
                        component: "WdTextarea",
                        attributes: {
                          borderedH5: false,
                          cursorSpacing: 72,
                          focus: true,
                          label: "标题",
                          labelVisible: false,
                          maxLength: 1024,
                          name: "textarea1",
                          placeholder: "请将您遇到的问题告诉我",
                          requiredMsg: "该项为必填项",
                          status: "edit",
                          value: "",
                          class: "ai-bot-chat__textarea",
                        },
                        directives: { ":if": true },
                        scopedStyle:
                          ":scope {\n  position: relative;\n  width: 100%;\n  font-size: 14px;\n}\n:scope .wd-form-input-wrap::before {\n  content: '';\n  width: calc(100% - 32px);\n  position: absolute;\n  height: 11px;\n  left: 16px;\n  bottom: 12px;\n  background: linear-gradient(89.96deg, #A3C8FF 0.03%, #B7B5FF 58.44%, #FFDBA6 99.97%);\n  filter: blur(40px);\n  z-index: -1;\n}\n\n:scope textarea {\n  font-size: 14px;\n  max-height: 200px;\n  overflow: auto;\n}\n\n:scope.wd-form-item {\n  background: transparent;\n  padding: 0 12px;\n}\n\n/* 编辑态-输入框样式 */\n:scope .wd-form-input-wrap {\n  padding: 12px !important;\n  border-radius: 0.5rem;\n  background-color: #f6f6f8;\n  /* border-right-color: rgba(255, 192, 72, 0.7) !important;\n  border-left-color: rgba(85, 153, 255, 0.7) !important;\n  background-clip: padding-box, border-box;\n  background-image: linear-gradient(white, white), linear-gradient(101.44deg, rgba(85, 153, 255, 0.7) 14.01%, rgba(179, 154, 255, 0.7) 64.79%, rgba(234, 163, 204, 0.7) 85.55%, rgba(255, 192, 72, 0.7) 99.18%);\n  border: double 1px transparent; */\n  border: 1px solid #ebebef;\n  transition: border-color .3s;\n  /* border-color: rgba(85, 153, 255, 0.7); */\n}\n\n:scope .wd-form-input-wrap:hover {\n  /* cursor: pointer;\n  background-image: linear-gradient(white, white), linear-gradient(101.44deg, #5599FF 14.01%, #B39AFF 64.79%, #EAA3CC 85.55%, #FFC048 99.18%);\n  border-right-color: #FFC048 !important;\n  border-left-color: #5599FF !important; */\n}\n\n/* 编辑态-输入框样式（获取焦点） */\n:scope .wd-form-input-wrap.is-focused {\n  /* border-right-color: rgba(255, 192, 72, 1) !important;\n  border-left-color: rgba(85, 153, 255, 1) !important; */\n  /* border: double 1px transparent; */\n  /* background-clip: padding-box, border-box; */\n  justify-content: flex-start;\n  border: 1px solid rgba(85, 153, 255, 0.7);\n  /* background-image: linear-gradient(white, white), linear-gradient(100.88deg, rgba(85, 153, 255, 1) 8.5%, rgba(148, 122, 227, 1) 62.56%, rgba(221, 112, 175, 1) 82.34%, rgba(255, 192, 72, 1) 99.18%); */\n  /* box-shadow: 0px 0.33px 2.21px 0px rgba(184, 208, 234, 0.05),0px 0.8px 5.32px 0px rgba(184, 208, 234, 0.07),0px 1.5px 10.02px 0px rgba(184, 208, 234, 0.09),0px 2.68px 17.87px 0px rgba(184, 208, 234, 0.1),0px 5.01px 33.42px 0px rgba(184, 208, 234, 0.12),0px 12px 80px 0px rgba(184, 208, 234, 0.17); */\n}\n\n:scope.wd-pc-textarea-root {\n  padding: 16px;\n  padding-top: 0;\n}\n\n:scope.wd-h5-textarea-root .wd-form-item-wrap__control,\n:scope.wd-mp-textarea-root .wd-form-item-wrap__control {\n  padding-top: 0;\n  padding-bottom: 20px;\n}\n\n:scope textarea::-webkit-input-placeholder {\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 20px;\n  color: rgba(188, 196, 208, 1);\n}\n\n:scope .wd-form-textarea-wrap__label {\n  /* padding-right: 68px;\ncursor: pointer;\ncolor: rgba(188, 196, 208, 1); */\n  display: none;\n}",
                        extra: { attributeExtraData: {} },
                      },
                      {
                        id: "container8",
                        label: "操作栏",
                        component: "Container",
                        attributes: {
                          data: {},
                          style: {
                            left: "0",
                            width: "100%",
                            bottom: "28px",
                            height: "auto",
                            display: "flex",
                            padding: "0px calc(1rem + 12px)",
                            position: "absolute",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                          },
                        },
                        items: [
                          {
                            id: "container14",
                            label: "左侧",
                            component: "Container",
                            attributes: { data: {} },
                            items: [
                              {
                                id: "container7",
                                label: "深度思考开关",
                                component: "Container",
                                attributes: {
                                  data: {},
                                  style: {
                                    gap: "4px",
                                    border: "1px solid #d2d2d2",
                                    cursor: "pointer",
                                    zIndex: 10,
                                    display: "flex",
                                    padding: "2px 8px",
                                    alignItems: "center",
                                    background: "#fff",
                                    transition: "all 0.3s",
                                    borderRadius: "999px",
                                  },
                                },
                                items: [
                                  {
                                    id: "icon4",
                                    component: "WdIcon",
                                    attributes: {
                                      name: "td:system-sum",
                                      size: "xs",
                                    },
                                    directives: { ":if": true },
                                    extra: {
                                      staticResourceAttribute: ["src"],
                                      attributeExtraData: {},
                                    },
                                  },
                                  {
                                    id: "text6",
                                    component: "WdText",
                                    attributes: {
                                      inheritColor: true,
                                      level: "body-sm",
                                      maxLines: "1",
                                      ":text":
                                        "\"深度思考\" + ($w.container22.data?.llmConfig?.reasonModelText ? ` (${$w.container22.data?.llmConfig?.reasonModelText})` : '')",
                                      style: { fontSize: "12px" },
                                    },
                                    directives: { ":if": true },
                                    extra: { attributeExtraData: {} },
                                  },
                                ],
                                listeners: [
                                  {
                                    id: "w1tz93x0esa",
                                    eventName: "tap",
                                    type: "general-func",
                                    handler: {
                                      params: [{}],
                                      name: "iife",
                                      module: "general-func",
                                      ":code":
                                        "({event}) => {\n  $comp.dataset.state.enableReason = !$comp.dataset.state.enableReason\n}",
                                    },
                                    isCapturePhase: false,
                                    noPropagation: false,
                                  },
                                ],
                                directives: {
                                  ":if":
                                    "!$w.container22.data?.bot?.botId && !!$w.container22.data?.llmConfig?.reasonModel",
                                },
                                ":style":
                                  "$comp.dataset.state.enableReason\n? {\n  background: '#d0e5fe',\n  borderColor: 'rgba(85,153,255,0.7)',\n  color: '#0056d4'\n}\n: {\n    borderColor: '#d2d2d2'\n}",
                                scopedStyle:
                                  ":scope:hover {\n  filter: brightness(0.9);\n}",
                                extra: { attributeExtraData: {} },
                              },
                            ],
                            directives: { ":if": true },
                            extra: { attributeExtraData: {} },
                          },
                          {
                            id: "container17",
                            label: "右侧",
                            component: "Container",
                            attributes: {
                              data: {},
                              style: { gap: "12px", display: "flex" },
                            },
                            items: [
                              {
                                id: "icon1",
                                label: "清理记录",
                                component: "WdIcon",
                                attributes: {
                                  name: "td:clear",
                                  style: {
                                    color: "rgb(96, 96, 96)",
                                    cursor: "pointer",
                                  },
                                },
                                listeners: [
                                  {
                                    id: "whqz3p3qpee",
                                    eventName: "tap",
                                    type: "general-func",
                                    handler: {
                                      params: [{}],
                                      name: "iife",
                                      module: "general-func",
                                      ":code":
                                        "({event}) => {\n  $comp.dataset.state.chatRecords = $w.container22.data?.llmConfig?.provider ? [] : [$comp.dataset.state.chatRecords[0]]\n}",
                                    },
                                    isCapturePhase: false,
                                    noPropagation: false,
                                  },
                                ],
                                directives: { ":if": true },
                                extra: {
                                  staticResourceAttribute: ["src"],
                                  attributeExtraData: {},
                                },
                              },
                              {
                                id: "icon12",
                                label: "发送按钮",
                                component: "WdIcon",
                                attributes: {
                                  name: "success",
                                  src: "https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/571f3dac-cbbb-410a-bc1c-179488288059.svg",
                                  type: "custom",
                                  style: { cursor: "pointer" },
                                },
                                listeners: [
                                  {
                                    id: "wuvqtrd69gn",
                                    eventName: "tap",
                                    type: "general-func",
                                    handler: {
                                      params: [{}],
                                      name: "iife",
                                      module: "general-func",
                                      ":code":
                                        '({event}) => {\n  $comp.dataset.state.chatRecords = [...$comp.dataset.state.chatRecords,\n  {\n    "role": "user",\n    "type": "text",\n    "content": $w.textarea1.value,\n    "bot": $comp.dataset.state.botInfo.botId\n  }]\n}',
                                    },
                                    isCapturePhase: false,
                                    noPropagation: false,
                                  },
                                  {
                                    id: "wno4vtv08b5",
                                    eventName: "wuvqtrd69gn.success",
                                    type: "platform",
                                    handler: {
                                      params: [
                                        {
                                          id: "sendMessage",
                                          method: "trigger",
                                        },
                                      ],
                                      name: "callQuery",
                                      module: "platform",
                                    },
                                    isCapturePhase: false,
                                    noPropagation: false,
                                  },
                                ],
                                directives: {
                                  ":if":
                                    "$comp.dataset.state.chatStatus===0&&!!$w.textarea1.value",
                                },
                                extra: {
                                  staticResourceAttribute: ["src"],
                                  attributeExtraData: {},
                                },
                              },
                              {
                                id: "icon13",
                                label: "发送按钮--禁用",
                                component: "WdIcon",
                                attributes: {
                                  name: "success",
                                  src: "https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/7b2d0ad1-790e-49d8-99cb-08c521eac17b.svg",
                                  type: "custom",
                                  style: { cursor: "not-allowed" },
                                },
                                directives: {
                                  ":if":
                                    "$comp.dataset.state.chatStatus===1||(!$w.textarea1.value&&$comp.dataset.state.chatStatus!=2)",
                                },
                                extra: {
                                  staticResourceAttribute: ["src"],
                                  attributeExtraData: {},
                                },
                              },
                              {
                                id: "icon14",
                                label: "停止生成按钮",
                                component: "WdIcon",
                                attributes: {
                                  name: "success",
                                  src: "https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/3c33af5b-17ae-46ad-adaf-9a787b426082.svg",
                                  type: "custom",
                                  style: { cursor: "pointer" },
                                },
                                listeners: [
                                  {
                                    id: "wmr6uyfvsfp",
                                    eventName: "tap",
                                    type: "general-func",
                                    handler: {
                                      params: [{}],
                                      name: "iife",
                                      module: "general-func",
                                      ":code":
                                        "({event}) => {\n  $comp.dataset.state.chatStatus = 0\n}",
                                    },
                                    isCapturePhase: false,
                                    noPropagation: false,
                                  },
                                ],
                                directives: {
                                  ":if": "$comp.dataset.state.chatStatus===2",
                                },
                                extra: {
                                  staticResourceAttribute: ["src"],
                                  attributeExtraData: {},
                                },
                              },
                            ],
                            directives: { ":if": true },
                            extra: { attributeExtraData: {} },
                          },
                        ],
                        directives: { ":if": true },
                        extra: { attributeExtraData: {} },
                      },
                    ],
                    directives: { ":if": true },
                    scopedStyle:
                      ".ai-bot-chat__input-box .wd-form-textarea-wrap textarea {\n  margin-bottom: 22px;\n}",
                    extra: { attributeExtraData: {} },
                  },
                  {
                    id: "container4",
                    component: "Container",
                    attributes: {
                      data: {},
                      style: {
                        zIndex: 300,
                        position: "relative",
                        textAlign: "center",
                      },
                    },
                    items: [
                      {
                        id: "unifiedLink2",
                        component: "WdUnifiedLink",
                        attributes: {
                          ":options": "({\n  target: '_blank'\n})",
                          ":url": '"https://docs.cloudbase.net/ai/introduce"',
                          style: { margin: "0px", padding: "0px" },
                        },
                        items: [
                          {
                            id: "text3",
                            component: "WdText",
                            attributes: {
                              inheritColor: true,
                              maxLines: "1",
                              text: "Powered by 腾讯云开发",
                              style: {
                                color: "var(--wd-link-color-text)",
                                cursor: "pointer",
                                opacity: 0.5,
                                padding: "6px 0px",
                                fontSize: "12px",
                                textDecoration: "none",
                              },
                            },
                            directives: { ":if": true },
                            extra: { attributeExtraData: {} },
                          },
                        ],
                        directives: { ":if": true },
                        extra: { attributeExtraData: {} },
                      },
                    ],
                    directives: { ":if": true },
                    ":style": "({\n  marginTop: '-20px'\n})",
                    extra: { attributeExtraData: {} },
                  },
                ],
                directives: { ":if": true },
                extra: {},
              },
            ],
            directives: { ":if": true },
            ":style":
              "({\n  backgroundImage: 'url(https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/1165b9cc-50b7-4ca4-970e-428de8c3a6fb.png)',\n  backgroundRepeat: 'no-repeat',\n  backgroundSize: '100% auto',\n  backgroundPosition: '0px -56px',\n})",
            extra: { attributeExtraData: {} },
          },
          {
            id: "modal1",
            label: "反馈弹窗",
            component: "WdModal",
            attributes: {
              closeType: ["mask"],
              defaultMaskShow: true,
              defaultShow: false,
              position: "center",
              template: "default",
            },
            items: [
              {
                id: "headerSlot",
                component: "",
                items: [
                  {
                    id: "text2",
                    label: "弹窗标题",
                    component: "WdText",
                    attributes: {
                      level: "title-7",
                      maxLines: "1",
                      text: "感谢您的宝贵反馈，我们会不断改进服务",
                      style: {
                        color: "rgba(0, 0, 0, 0.9)",
                        fontSize: "16px",
                        fontWeight: 600,
                        lineHeight: "24px",
                      },
                    },
                    directives: { ":if": true },
                    extra: { attributeExtraData: {} },
                  },
                  {
                    id: "icon3",
                    label: "关闭按钮",
                    component: "WdIcon",
                    attributes: {
                      name: "success",
                      size: "xs",
                      src: "https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/3f535fd9-84e1-4a6b-8f9f-8905d1f60b1b.svg",
                      type: "custom",
                      style: { cursor: "pointer" },
                    },
                    listeners: [
                      {
                        id: "wdModal500",
                        eventName: "tap",
                        type: "platform",
                        handler: {
                          params: [
                            {
                              component: "modal1",
                              method: "close",
                              params: { info: "icon" },
                            },
                          ],
                          name: "invoke",
                          module: "platform",
                        },
                        isCapturePhase: false,
                        noPropagation: false,
                      },
                    ],
                    directives: { ":if": true },
                    extra: {
                      staticResourceAttribute: ["src"],
                      attributeExtraData: {},
                    },
                  },
                ],
                directives: { ":if": true },
                extra: {},
              },
              {
                id: "contentSlot",
                component: "",
                items: [
                  {
                    id: "rating1",
                    component: "WdRating",
                    attributes: {
                      callbacks: {
                        ":tooltip":
                          "props => {\n  // return props.value + '分';\n  return props.value;\n}",
                      },
                      label: "评分",
                      labelAlign: "left",
                      layout: "horizontal",
                      name: "rating",
                      ":value":
                        "$w.modal1.openInfo.type === 'downvote' ? 1 : 5",
                    },
                    directives: { ":if": true },
                    scopedStyle:
                      ":scope .wd-form-item-wrap__label-text {\n  line-height: 20px;\n  font-size: 14px;\n}\n:scope .wd-form-item-wrap__control-wrap {\n  min-height: 20px;\n}\n:scope .wd-rating__full-icons-container .t-icon-star-filled:before {\n  color: rgba(237, 123, 47, 1);\n}\n\n:scope .wd-rating__full-icons-container,\n:scope .wd-rating__empty-icons-container {\n  gap: 8px;\n}\n\n:scope .wd-form-item-wrap {\n  border-bottom: unset;\n  flex-direction: column;\n}\n\n:scope .wd-form-item--weui .wd-form-item-wrap__label {\n  padding-bottom: 0px;\n}\n\n:scope .wd-form-item-wrap__label {\n  padding-bottom: 8px;\n}",
                    extra: { attributeExtraData: {} },
                  },
                  {
                    id: "tagSelect1",
                    component: "WdTagSelect",
                    attributes: {
                      label: "回答内容",
                      layout: "vertical",
                      name: "tags",
                      ":range":
                        "($w.modal1.openInfo.type === 'upvote' ? ['准确有效', '回答全面', '立场正确', '格式规范', '专业性强', '富有创意', '表达清晰', '值得信赖', '高效', '满意'] : ['理解错误', '未识别问题', '事实错误', '推理错误', '内容不完整', '不专业', '违法有害', '格式错误', '乱码', '内容重复']).map(item => {\n  return {\n    lable: item,\n    value: item\n  };\n})",
                      requiredMsg: "该项为必填项",
                      size: "md",
                      status: "edit",
                      tagStyleColor: "rgba(0, 82, 217, 1)",
                      tagStyleType: "light",
                      tagStyleWidthCols: 4,
                      ":value": "[]",
                    },
                    directives: { ":if": true },
                    scopedStyle:
                      ":scope .wd-tag__text {\n  font-size: 12px;\n  line-height: 18px;\n  font-weight: 400;\n}\n\n:scope .wd-form-item-wrap__label-text {\n  font-size: 14px;\n}\n:scope.wd-form-item--weui .wd-form-item-wrap__control {\n  padding-top:16px;\n}\n:scope .wd-form-item-wrap {\n  border-bottom: unset;\n}\n\n:scope .wd-tag-item  {\nbackground-color: rgba(243, 243, 243, 1);\nborder-radius: 36px;\npadding: 6px 16px;\n}",
                    extra: { attributeExtraData: {} },
                  },
                  {
                    id: "textarea2",
                    label: "反馈内容",
                    component: "WdTextarea",
                    attributes: {
                      label: "反馈建议",
                      layout: "vertical",
                      name: "comment",
                      placeholder: "请输入其他反馈建议",
                      requiredFlag: false,
                      requiredMsg: "该项为必填项",
                      status: "edit",
                      value: "",
                    },
                    directives: { ":if": true },
                    scopedStyle:
                      ":scope .wd-form-item-wrap__label-text {\n  font-size: 14px;\n}\n:scope .wd-form-item-wrap {\n  border-bottom: unset;\n}\n\n:scope .wd-form-input-wrap {\n    padding: 5px 8px;\n    border: 1px solid rgba(220, 220, 220, 1);\n    border-radius: 6px;\n}\n\n:scope textarea::-webkit-input-placeholder {\nfont-size:14px;\n}",
                    extra: { attributeExtraData: {} },
                  },
                ],
                directives: { ":if": true },
                extra: {},
              },
              {
                id: "footerSlot",
                component: "",
                items: [
                  {
                    id: "container36",
                    component: "Container",
                    attributes: {
                      data: {},
                      style: {
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      },
                    },
                    items: [
                      {
                        id: "button1",
                        label: "确认按钮",
                        component: "WdButton",
                        attributes: {
                          icon: "success",
                          size: "lg",
                          text: "取消",
                          variant: "outline",
                          style: {
                            border: "1px solid rgba(220, 220, 220, 1)",
                            height: "32px",
                            padding: "5px 16px 5px 16px",
                            minHeight: "unset",
                            marginRight: "8px",
                            borderRadius: "4px",
                          },
                        },
                        listeners: [
                          {
                            id: "wnrd0l79xxa",
                            eventName: "tap",
                            type: "platform",
                            handler: {
                              params: [
                                {
                                  component: "modal1",
                                  method: "close",
                                  params: { info: "" },
                                },
                              ],
                              name: "invoke",
                              module: "platform",
                            },
                            isCapturePhase: false,
                            noPropagation: false,
                          },
                        ],
                        directives: { ":if": true },
                        scopedStyle:
                          ":scope .wd-btn__text {\n  font-size: 14px;\n  color:rgba(0, 0, 0, 0.9);\n}\n:scope:hover {\n  background-color: rgba(0, 82, 217, 0.1);\n}",
                        extra: { attributeExtraData: {} },
                      },
                      {
                        id: "button4",
                        label: "确认按钮",
                        component: "WdButton",
                        attributes: {
                          icon: "success",
                          size: "lg",
                          text: "提交反馈",
                          style: {
                            height: "32px",
                            padding: "5px 16px 5px 16px",
                            minHeight: "unset",
                            marginRight: "0px",
                            borderRadius: "3px",
                            backgroundColor: "rgba(0, 82, 217, 1)",
                          },
                        },
                        listeners: [
                          {
                            id: "wscsodi8evw",
                            eventName: "tap",
                            type: "platform",
                            handler: {
                              params: [
                                { id: "submitFeedback", method: "trigger" },
                              ],
                              name: "callQuery",
                              module: "platform",
                            },
                            isCapturePhase: false,
                            noPropagation: false,
                          },
                          {
                            id: "wjrvxp2k7vf",
                            eventName: "wscsodi8evw.success",
                            type: "platform",
                            handler: {
                              params: [
                                {
                                  duration: 1500,
                                  icon: "success",
                                  title: "反馈成功",
                                },
                              ],
                              name: "showToast",
                              module: "platform",
                            },
                            isCapturePhase: false,
                            noPropagation: false,
                          },
                          {
                            id: "wj2iphgbkyn",
                            eventName: "wscsodi8evw.success",
                            type: "platform",
                            handler: {
                              params: [
                                {
                                  component: "modal1",
                                  method: "close",
                                  params: {},
                                },
                              ],
                              name: "invoke",
                              module: "platform",
                            },
                            isCapturePhase: false,
                            noPropagation: false,
                          },
                        ],
                        directives: { ":if": true },
                        scopedStyle:
                          ":scope .wd-btn__text {\n  font-size: 14px;\n  color:white;\n}\n:scope:hover {\n  background-color: rgba(0, 82, 217, 0.5);\n}",
                        extra: { attributeExtraData: {} },
                      },
                    ],
                    directives: { ":if": true },
                    extra: { attributeExtraData: {} },
                  },
                ],
                directives: { ":if": true },
                extra: {},
              },
            ],
            directives: { ":if": true },
            scopedStyle:
              ":scope .wd-modal-bd__hd,\n:scope .wd-modal-bd__hd ._wa-comp-slot-wrapper {\nalign-items: flex-start;\nmargin-bottom: 8px;\ngap:8px;\n}\n\n:scope .wd-modal-bd {\n  max-width: 496px;\n  min-width: unset !important;\n}\n\n:scope .wd-tag-item:hover {\n  cursor:pointer;\n}",
            extra: { attributeExtraData: {} },
          },
          {
            id: "container21",
            label: "错误遮罩",
            component: "Container",
            attributes: {
              data: {},
              style: {
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                zIndex: 9999,
                display: "flex",
                position: "fixed",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
              },
            },
            items: [
              {
                id: "container24",
                component: "Container",
                attributes: {
                  data: {},
                  style: {
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  },
                },
                items: [
                  {
                    id: "icon17",
                    component: "WdIcon",
                    attributes: {
                      name: "td:error-circle",
                      style: { color: "rgb(95, 114, 146)", fontSize: "5rem" },
                    },
                    directives: { ":if": true },
                    extra: {
                      staticResourceAttribute: ["src"],
                      attributeExtraData: {},
                    },
                  },
                  {
                    id: "text21",
                    component: "WdText",
                    attributes: {
                      inheritColor: true,
                      maxLines: "1",
                      ":text": "$comp.dataset.state.errorState.message",
                      style: {
                        color: "rgb(95, 114, 146)",
                        padding: "0 24px",
                        fontSize: "14px",
                        marginTop: "16px",
                        textAlign: "center",
                        lineHeight: "175%",
                      },
                    },
                    directives: { ":if": true },
                    extra: { attributeExtraData: {} },
                  },
                ],
                directives: { ":if": true },
                extra: { attributeExtraData: {} },
              },
            ],
            directives: { ":if": "!!$comp.dataset.state.errorState.message" },
            extra: { attributeExtraData: {} },
          },
        ],
        directives: { ":if": true },
        extra: { xIndex: 0, attributeExtraData: {} },
        name: "Agent-UI",
      },
    ],
    dataset: {
      state: {
        ai_bot_scroll_top: {
          name: "ai_bot_scroll_top",
          label: "",
          varType: "state",
          dataType: "number",
          initialValue: 999,
          enableSyncLocal: false,
        },
        botInfo: {
          name: "botInfo",
          label: "当前选中智能体信息",
          varType: "state",
          dataType: "object",
          initialValue: {},
          enableSyncLocal: false,
        },
        chatRecords: {
          name: "chatRecords",
          label: "聊天记录，包含历史聊天记录和对话记录",
          varType: "state",
          dataType: "array",
          initialValue: [],
          enableSyncLocal: false,
        },
        enableReason: {
          name: "enableReason",
          label: "",
          varType: "state",
          dataType: "boolean",
          initialValue: false,
          enableSyncLocal: false,
        },
        recommendQuestions: {
          name: "recommendQuestions",
          label: "建议问题",
          varType: "state",
          dataType: "array",
          initialValue: [],
          enableSyncLocal: false,
        },
        chatStatus: {
          name: "chatStatus",
          label: "0-可输入，1-待响应，2-响应中",
          varType: "state",
          dataType: "number",
          initialValue: 0,
          enableSyncLocal: false,
        },
        errorState: {
          name: "errorState",
          label: "",
          varType: "state",
          dataType: "object",
          initialValue: { message: "" },
          enableSyncLocal: false,
        },
        ai_bot_ui_scroll_top: {
          name: "ai_bot_ui_scroll_top",
          label: "",
          varType: "state",
          dataType: "number",
          initialValue: 999,
          enableSyncLocal: false,
        },
        ai_bot_ui_scroll_to_bottom: {
          name: "ai_bot_ui_scroll_to_bottom",
          label: "",
          varType: "state",
          dataType: "boolean",
          initialValue: true,
          enableSyncLocal: false,
        },
      },
      params: {},
      query: {
        queryBotById: {
          id: "queryBotById",
          name: "queryBotById",
          type: "general-func",
          trigger: "auto",
          description: "",
          handler: {
            module: "general-func",
            name: "iife",
            ":code":
              "async () => {\n  const { isPreview, bot = {}, llmConfig } = $w.container22?.data || {}\n  if (!bot?.botId && llmConfig?.provider) {\n    return;\n  }\n  if (isPreview) {\n    $comp.dataset.state.botInfo = bot\n     $comp.dataset.state.recommendQuestions = bot.initQuestions\n    // 将欢迎语作为第一条聊天记录\n    $comp.dataset.state.chatRecords = [{\n      role: \"assistant\",\n      content: bot.welcomeMessage,\n      btnGroupShow: 'hidden'\n    }]\n    return\n  }\n  // 从区块获取botId\n  const botId = bot.botId\n  // 如果id为空，展示提示\n  if (!botId) {\n    return\n  }\n  const data = await $w.app.ai.bot.get({ botId });\n  if (data.code) {\n    $comp.dataset.state.errorState.message = data.message;\n    console.error(data.message);\n  }\n\n  $comp.dataset.state.botInfo = { ...data }\n  // 查询聊天记录\n  await $w.queryChatRecords.trigger()\n  // 将初始的提示问题展示到聊天页面的最下面\n  $comp.dataset.state.recommendQuestions = data.initQuestions\n  // 滚动到底部\n  if ($comp.dataset.state.ai_bot_ui_scroll_to_bottom) {\n    setTimeout(() => {\n      $comp.handler.ai_bot_scroll_to_bottom({});\n    }, 500)\n  }\n  return true\n}\n",
            params: {},
          },
          listeners: [],
        },
        sendMessage: {
          id: "sendMessage",
          name: "sendMessage",
          type: "general-func",
          trigger: "manual",
          description: "",
          handler: {
            module: "general-func",
            name: "iife",
            ":code":
              "async ({ params }) => {\n  // 获取输入框消息，params是外面传进来的，不传就使用输入框的值\n  const bot = $comp.dataset.state.botInfo || {};\n  const message = params || $w.textarea1.value; // 清空输入框\n\n  $w.textarea1.setValue({\n    value: '',\n  }); // 清空建议问题\n\n  $comp.dataset.state.recommendQuestions = []; // 修改聊天状态\n\n  $comp.dataset.state.chatStatus = 1; // 手动插入一回复消息，后面的返回都使用这条消息来实现打字机效果\n\n  $comp.dataset.state.chatRecords = [\n    ...$comp.dataset.state.chatRecords,\n    {\n      role: 'assistant',\n      content: '请稍等，正在卖力思考中🤔...',\n      btnGroupShow: 'hidden',\n      botId: bot?.botId,\n      searchStatus: bot.searchEnable ? 1 : 0,\n    },\n  ]; // 滚动到底部\n\n  if ($comp.dataset.state.ai_bot_ui_scroll_to_bottom) {\n    $comp.handler.ai_bot_scroll_to_bottom({});\n  } // 如果是智能体预览状态，走预览接口\n\n  const { isPreview } = $w.container22?.data || {};\n  const llmConfig = $w.container22?.data.llmConfig || {};\n  const record = $comp.dataset.state.chatRecords[$comp.dataset.state.chatRecords.length - 1]; // 请求参数\n  record.status = 1;\n\n  const sendMessage = () => {\n    if (!bot.botId && llmConfig.provider) {\n      return $w.ai.LLM.chat({\n        provider: llmConfig.provider,\n        model: $comp.dataset.state.enableReason ? llmConfig.reasonModel : llmConfig.model,\n        temperature: llmConfig.temperature ?? 1,\n        top_p: llmConfig.top_p ?? 1,\n        messages: $comp.dataset.state.chatRecords.slice(0, -1),\n        stream: true,\n      });\n    } else {\n      return isPreview\n        ? $w.app.ai.bot.getPreview({\n            name: bot.name,\n            model: bot.model,\n            modelValue: bot.modelValue,\n            introduction: bot.introduction,\n            agentSetting: bot.agentSetting,\n            knowledgeBase: bot.knowledgeBase,\n            searchEnable: bot.searchEnable,\n            msg: message,\n            history: $comp.dataset.state.chatRecords,\n          })\n        : $w.app.ai.bot.sendMessage({\n            botId: bot?.botId,\n            msg: message,\n            history: $comp.dataset.state.chatRecords,\n          });\n    }\n  };\n\n  let result = '';\n  let reasoningResult = '';\n\n  /**\n   * record.reasoningStatus 0 未思考 1 思考中 2 已思考\n   * record.searchStatus 0 未搜索 1 搜索中 2 搜索完毕\n   */\n\n  try {\n    const res = await sendMessage();\n    // const stream = (!llmConfig.provider && isPreview) ? res.dataStream : res.eventStream;\n    const stream = isPreview && bot?.model ? res.dataStream : res.eventStream;\n    const reasoningStartTime = Date.now();\n    record.reasoningStatus = 0;\n\n    for await (let json of stream) {\n      if ($comp.dataset.state.chatStatus === 1) {\n        $comp.dataset.state.chatStatus = 2;\n        record.status = 2;\n      }\n      let content = '';\n      let reasoningContent = '';\n\n      if (json.choices?.length) {\n        content = json.choices.reduce((acc, item) => (acc += item.delta.content || ''), '');\n        reasoningContent = json.choices.reduce((acc, item) => (acc += item.delta.reasoning_content || ''), '');\n        result += content;\n        reasoningResult += reasoningContent;\n        record.recordId = json.id;\n      } else {\n        result += json.content || '';\n        reasoningResult += json.reasoning_content || '';\n        record.recordId = json.record_id;\n\n        if (json.knowledge_base?.length) {\n          record.knowledgeBase = json.knowledge_base;\n        }\n        if (json.knowledge_meta?.length) {\n          record.knowledgeMeta = json.knowledge_meta\n            .map((item) => (typeof item === 'string' ? JSON.parse(item) : item))\n            .filter((i) => Object.keys(i).length);\n        }\n        if (json.search_info?.search_results?.length) {\n          record.searchResults = json.search_info.search_results;\n          record.searchStatus = 2;\n        }\n      }\n      record.content = result;\n      record.reasoningContent = reasoningResult.trim();\n\n      if (reasoningResult && record.reasoningStatus === 0) {\n        record.reasoningStatus = 1;\n      } else if (result && record.reasoningStatus === 1) {\n        record.reasoningStatus = 2;\n        record.reasoningDuration = Math.round((Date.now() - reasoningStartTime) / 1000);\n      }\n\n      if ($comp.dataset.state.ai_bot_ui_scroll_to_bottom) {\n        $comp.handler.ai_bot_scroll_to_bottom({});\n      }\n      if ($comp.dataset.state.chatStatus != 2) {\n        if (record.reasoningStatus === 1) {\n          record.reasoningStatus = 3;\n        }\n        break;\n      }\n    } // 显示按钮组\n  } catch (err) {\n    console.log(err);\n  }\n  /**\n   * 应该判断错误码 先这样处理\n   */\n  if (!(result || reasoningResult)) {\n    record.failed = true;\n    record.content = '';\n  }\n\n  delete record.btnGroupShow; // 切回聊天状态\n\n  $comp.dataset.state.chatStatus = 0;\n  record.status = 3;\n\n  if (bot.isNeedRecommend) {\n    $comp.handler.queryRecommendQuestions({\n      data: {\n        target: {\n          botId: bot?.botId,\n          message,\n        },\n      },\n    });\n  }\n\n  return true;\n};\n",
            params: {},
          },
          listeners: [],
        },
        addEnterEvent: {
          id: "addEnterEvent",
          name: "addEnterEvent",
          type: "general-func",
          trigger: "auto",
          description: "",
          handler: {
            module: "general-func",
            name: "iife",
            ":code":
              "({ params }) => {\n  if ($w.wedaContext.platforms.includes('WEB')) {\n    let $textarea = document?.querySelector?.('.ai-bot-chat__textarea textarea')\n    let isComposing = false;\n    $textarea.addEventListener('compositionstart', function () {\n      isComposing = true;\n    });\n    $textarea.addEventListener('compositionend', function () {\n      isComposing = false;\n    });\n    $textarea.addEventListener('keydown', function (event) {\n      if (!($w.textarea1.value?.trim())?.length || [1, 2].includes($comp.dataset.state.chatStatus)) {\n        return\n      }\n      if (event.key === 'Enter' && !event.shiftKey) {\n        // 判断输入法是否正在输入中文字符\n        if (!event.target.isComposing && !isComposing) {\n          event.preventDefault();\n          // 如果不是中文输入过程中，执行提交操作\n          $comp.dataset.state.chatRecords = [...$comp.dataset.state.chatRecords,\n          {\n            \"role\": \"user\",\n            \"type\": \"text\",\n            \"content\": $w.textarea1.value,\n            \"bot\": $comp.dataset.state.botInfo.botId\n          }]\n          $w.sendMessage.trigger()\n        }\n      }\n    });\n  }\n  if ($w.wedaContext.platforms.includes('MP')) {\n    const minSDKVersion = '3.7.1';\n    const { version, SDKVersion } = wx.getAppBaseInfo();\n    if (compareVersions(minSDKVersion, SDKVersion) === 1) {\n      $comp.dataset.state.errorState.message = `当前微信版本过低，请更新到最新版\\n当前微信版本: ${version}, 基础库版本: ${SDKVersion}`;\n    }\n  }\n\n  function compareVersions(v1, v2) {\n    const arr1 = v1.split('.');\n    const arr2 = v2.split('.');\n    \n    for (var i = 0; i < Math.max(arr1.length, arr2.length); i++) {\n      const num1 = parseInt(arr1[i] || 0);\n      const num2 = parseInt(arr2[i] || 0);\n      \n      if (num1 < num2) {\n        return -1;\n      } else if (num1 > num2) {\n        return 1;\n      }\n    }\n    return 0;\n  }\n}\n",
            params: {},
          },
          listeners: [],
        },
        submitFeedback: {
          id: "submitFeedback",
          name: "submitFeedback",
          type: "general-func",
          trigger: "manual",
          description: "",
          handler: {
            module: "general-func",
            name: "iife",
            ":code":
              'async ({ params }) => {\n  // 当前拉起反馈弹窗的聊天记录索引\n  const index = $w.modal1.openInfo.index\n  const type = $w.modal1.openInfo.type\n\n  const raw = {\n    "recordId": $comp.dataset.state.chatRecords[index].recordId,\n    "type": type,\n    "botId": $comp.dataset.state.chatRecords[index].botId,\n    "comment": $w.textarea2.value,\n    "rating": $w.rating1.value,\n    "tags": $w.tagSelect1.value,\n    "input": $comp.dataset.state.chatRecords[index - 1].content,\n    "aiAnswer": $comp.dataset.state.chatRecords[index].content\n  };\nconst res=await $w.app.ai.bot.sendFeedback({userFeedback:raw})\n\n  const { status } = res\n  if (status === \'success\') {\n    return true\n  }\n  return false\n}\n',
            params: {},
          },
          listeners: [],
        },
        queryChatRecords: {
          id: "queryChatRecords",
          name: "queryChatRecords",
          type: "general-func",
          trigger: "manual",
          description: "",
          handler: {
            module: "general-func",
            name: "iife",
            ":code":
              'async ({ params }) => {\n//   const { bot = {} } = $w.container22.data;\n//   const botInfo = $comp.dataset.state.botInfo\n  // 聊天记录\n//   const { botId } = botInfo\n//   const data = botId ? await $w.app.ai.bot.getChatRecords({\n//     botId,\n//     pageNumber: 1,\n//     pageSize: 20,\n//     sort: "desc",\n//   }) : {};\n\n//   const { recordList = [] } = data\n  const recordList = [];\n  //将欢迎语作为第一条聊天记录\n//   const name = llmConfig?.provider\n//     ? `${($comp.dataset.state.enableReason ? llmConfig.reasonModel : llmConfig.model)} 模型`\n//     : (bot.name || botInfo?.name)\n\n  const welcomMessage = $comp.dataset.state.botInfo?.welcomeMessage\n\n  $comp.dataset.state.chatRecords = [{\n    role: "assistant",\n    content: welcomMessage,\n    btnGroupShow: \'hidden\'\n  }, ...recordList.reverse()]\n}\n',
            params: {},
          },
          listeners: [],
        },
      },
    },
    resources: [
      {
        code: "\n/**\n * \n * 可通过 $page 获取或修改当前页面的 变量 状态 handler lifecycle 等信息\n * 可通过 app 获取或修改全局应用的 变量 状态 等信息\n * 具体可以console.info 在编辑器Console面板查看更多信息\n * 注意：该方法仅在所属的页面有效\n * 如果需要 async-await，请修改成 export default async function() {}\n * 帮助文档 https://cloud.tencent.com/document/product/1301/57912\n **/\n/**\n * @param {Object} event - 事件对象\n * @param {string} event.type - 事件名\n * @param {any} event.detail - 事件携带自定义数据\n *\n * @param {Object} data\n * @param {any} data.target - 获取事件传参的数据\n **/\nexport default debounce(function({event, data}) {\n  // console.log('ai_bot_scroll_to_bottom',$comp.dataset.state.ai_bot_ui_scroll_to_bottom)\n   if (!$comp.dataset.state.ai_bot_ui_scroll_to_bottom) return \n   \n    setTimeout(() => {\n      if (!$comp.dataset.state.ai_bot_scroll_top) {\n          $comp.dataset.state.ai_bot_scroll_top = 1\n      }\n      $comp.dataset.state.ai_bot_scroll_top += ($comp.dataset.state.ai_bot_ui_scroll_height || 9999) + Math.random() * 100\n      $comp.dataset.state.ai_bot_ui_scroll_to_bottom = true\n    }, 0)\n}, 100)\nfunction debounce(func, wait) {\n  let timeout;\n  return function() {\n    const context = this;\n    const args = arguments;\n    clearTimeout(timeout);\n    timeout = setTimeout(() => {\n      func.apply(context, args);\n    }, wait);\n  };\n}",
        name: "ai_bot_scroll_to_bottom",
        path: "$comp/handler/ai_bot_scroll_to_bottom",
        codeType: "handler-fn",
        type: "CODE",
      },
      {
        code: '/**\n * \n * 可通过 $page 获取或修改当前页面的 变量 状态 handler lifecycle 等信息\n * 可通过 app 获取或修改全局应用的 变量 状态 等信息\n * 具体可以console.info 在编辑器Console面板查看更多信息\n * 注意：该方法仅在所属的页面有效\n * 如果需要 async-await，请修改成 export default async function() {}\n * 帮助文档 https://cloud.tencent.com/document/product/1301/57912\n **/\n/**\n * @param {Object} event - 事件对象\n * @param {string} event.type - 事件名\n * @param {any} event.detail - 事件携带自定义数据\n *\n * @param {Object} data\n * @param {any} data.target - 获取事件传参的数据\n **/\nexport default async function ({ event, data }) {\n  const { target: { message, botId } } = data\n  const raw = {\n    "botId": botId,\n    "msg": message,\n    "name": $comp.dataset.state.botInfo.name,\n    "introduction": $comp.dataset.state.botInfo.introduction,\n    "agentSetting": $comp.dataset.state.botInfo.agentSetting,\n  };\n  const res = await $w.app.ai.bot.getRecommendQuestions(raw)\n  let result = \'\'\n  for await (let str of res.textStream) {\n    result += str\n    $comp.dataset.state.recommendQuestions = result.split(\'\\n\')\n    if ($comp.dataset.state.ai_bot_ui_scroll_to_bottom) {\n      $comp.handler.ai_bot_scroll_to_bottom({});\n    }\n  }\n}',
        name: "queryRecommendQuestions",
        path: "$comp/handler/queryRecommendQuestions",
        codeType: "handler-fn",
        type: "CODE",
      },
      {
        code: ".ai-bot-chat__message-user {\n  color: white;\n  background-color: #3970FB;\n  font-size: 14px;\n  line-height: 26px;\n  padding: 9px 16px;\n  border-radius: 8px 0px 8px 8px;\n  margin: 10px 0;\n  font-weight: 400;\n}\n.ai-bot-chat__message-system {\n  background-color: #fff;\n  padding: 12px 16px;\n  border-radius: 0px 8px 8px 8px;\n  margin: 10px 0;\n  border: 1px solid #E9ECF1;\n  box-shadow: 0px 12px 48px -12px #0000000D;\n}\n::-webkit-scrollbar {\n  width: 0px;\n}\n.wd-menulayout--tab .wd-menulayout-body__left-slot {\n  z-index: 299;\n}\n.ai-bot-chat .wd-form-input-wrap.wd-input-input-search.template.search-box.color-grey.is-pc-bordered {\n  margin: unset;\n}\n.agent_markdown{\n  font-family: var(--wd-font-family);\n}\n.agent_markdown p{\n  margin-bottom: 0px;\n}\n.agent_markdown .markdown-body li > p {\n  margin-top: 0px;\n}\n.agent_markdown h1 {\n  font-size: 1.2em;\n}\n.agent_markdown h2 {\n  font-size: 1.1em;\n}\n.agent_markdown h3 {\n  font-size: 1em;\n}\n.agent_markdown h4 {\n  font-size: 0.8em;\n}\n.agent_markdown h5 {\n  font-size: 0.75em;\n}\n.agent_markdown h6 {\n  font-size: 0.7em;\n}",
        name: "style",
        path: "$comp/style",
        codeType: "style",
        type: "CODE",
      },
    ],
    data: { properties: {} },
  };
  const componentsMap = {
    "gsd-h5-react:Container": React.forwardRef((props, ref) => {
      const processedProps = useComponentProps(props, 1);
      return <GsdH5ReactContainer {...processedProps} ref={ref} />;
    }),

    "gsd-h5-react:WdMenuLayout": React.forwardRef((props, ref) => {
      const processedProps = useComponentProps(props, 1);
      return <GsdH5ReactWdMenuLayout {...processedProps} ref={ref} />;
    }),

    "gsd-h5-react:ScrollView": React.forwardRef((props, ref) => {
      const processedProps = useComponentProps(props, 1);
      return <GsdH5ReactScrollView {...processedProps} ref={ref} />;
    }),

    "gsd-h5-react:WdImage": React.forwardRef((props, ref) => {
      const processedProps = useComponentProps(props, 1);
      return <GsdH5ReactWdImage {...processedProps} ref={ref} />;
    }),

    "gsd-h5-react:WdText": React.forwardRef((props, ref) => {
      const processedProps = useComponentProps(props, 1);
      return <GsdH5ReactWdText {...processedProps} ref={ref} />;
    }),

    "gsd-h5-react:WdIcon": React.forwardRef((props, ref) => {
      const processedProps = useComponentProps(props, 1);
      return <GsdH5ReactWdIcon {...processedProps} ref={ref} />;
    }),

    "gsd-h5-react:WdCard": React.forwardRef((props, ref) => {
      const processedProps = useComponentProps(props, 1);
      return <GsdH5ReactWdCard {...processedProps} ref={ref} />;
    }),

    "gsd-h5-react:WdMarkdown": React.forwardRef((props, ref) => {
      const processedProps = useComponentProps(props, 1);
      return <GsdH5ReactWdMarkdown {...processedProps} ref={ref} />;
    }),

    "gsd-h5-react:WdUnifiedLink": React.forwardRef((props, ref) => {
      const processedProps = useComponentProps(props, 1);
      return <GsdH5ReactWdUnifiedLink {...processedProps} ref={ref} />;
    }),

    "gsd-h5-react:WdBubble": React.forwardRef((props, ref) => {
      const processedProps = useComponentProps(props, 1);
      return <GsdH5ReactWdBubble {...processedProps} ref={ref} />;
    }),

    "gsd-h5-react:WdTextarea": React.forwardRef((props, ref) => {
      const processedProps = useComponentProps(props, 1);
      return <GsdH5ReactWdTextarea {...processedProps} ref={ref} />;
    }),

    "gsd-h5-react:WdModal": React.forwardRef((props, ref) => {
      const processedProps = useComponentProps(props, 1);
      return <GsdH5ReactWdModal {...processedProps} ref={ref} />;
    }),

    "gsd-h5-react:WdRating": React.forwardRef((props, ref) => {
      const processedProps = useComponentProps(props, 1);
      return <GsdH5ReactWdRating {...processedProps} ref={ref} />;
    }),

    "gsd-h5-react:WdTagSelect": React.forwardRef((props, ref) => {
      const processedProps = useComponentProps(props, 1);
      return <GsdH5ReactWdTagSelect {...processedProps} ref={ref} />;
    }),

    "gsd-h5-react:WdButton": React.forwardRef((props, ref) => {
      const processedProps = useComponentProps(props, 1);
      return <GsdH5ReactWdButton {...processedProps} ref={ref} />;
    }),
  };
  const componentActionsMap = {};

  const componentsInfoMap = {
    "gsd-h5-react:WdMarkdown": {
      isComposite: false,
      name: "WdMarkdown",
      title: "Markdown",
      platform: ["H5", "小程序"],
      shortcut: { props: ["value"] },
      emitEvents: [
        {
          eventName: "onReady",
          name: "markdown Ready",
          detail: {
            type: "object",
            properties: {
              markdownInstance: {
                title: "markdown实例",
                type: "object",
                properties: {},
              },
            },
            required: ["markdownInstance"],
          },
        },
      ],
      dataForm: { value: { type: "string" }, options: { type: "object" } },
      properties: {
        type: "object",
        properties: {
          id: { type: "string", title: "组件 ID" },
          module: { type: "string", title: "组件库名" },
          component: { type: "string", title: "组件名" },
          value: { type: "string", title: "内容" },
          markdownInstance: { type: "object", title: "markdown实例" },
        },
        required: ["value", "markdownInstance"],
      },
      _version: "3.14.4",
    },
    "gsd-h5-react:WdUnifiedLink": {
      isComposite: false,
      name: "WdUnifiedLink",
      title: "高级链接",
      platform: ["H5", "小程序"],
      shortcut: { props: ["url"] },
      emitEvents: [{ eventName: "tap", name: "点击链接" }],
      isContainer: true,
      dataForm: {
        url: { type: "string" },
        options: { type: "object" },
        params: { type: "object" },
      },
      properties: {
        type: "object",
        properties: {
          id: { type: "string", title: "组件 ID" },
          module: { type: "string", title: "组件库名" },
          component: { type: "string", title: "组件名" },
          url: { type: "string", title: "链接地址" },
          options: { type: "object", title: "扩展参数" },
        },
        required: ["url", "options"],
      },
      _version: "3.14.4",
    },
    "gsd-h5-react:WdRating": {
      isComposite: false,
      name: "WdRating",
      title: "评分",
      platform: ["H5", "小程序"],
      shortcut: { props: ["name", "label"] },
      emitEvents: [
        {
          eventName: "change",
          name: "值改变",
          detail: {
            type: "object",
            properties: { value: { description: "评分值", type: "number" } },
            required: ["value"],
          },
        },
      ],
      compConfig: { componentType: "formField" },
      dataForm: {
        name: { type: "string" },
        value: { type: "number" },
        size: { type: "string" },
        label: { type: "string" },
        labelVisible: { type: "boolean" },
        labelAlign: { type: "string" },
        labelWrap: { type: "boolean" },
        layout: { type: "string" },
        labelWidth: { type: "string" },
        labelTips: { type: "string" },
        min: { type: "number" },
        max: { type: "number" },
        step: { type: "number" },
        icon: { type: "string" },
        iconSrc: { type: "string" },
        backgroundIcon: { type: "string" },
        backgroundIconSrc: { type: "string" },
        foregroundColor: { type: "string" },
        backgroundColor: { type: "string" },
        borderedH5: { type: "boolean" },
        callbacks: { type: "object" },
        status: { type: "string" },
        required: { type: "boolean" },
        requiredFlag: { type: "boolean" },
        requiredMsg: { type: "string" },
      },
      properties: {
        type: "object",
        properties: {
          id: { type: "string", title: "组件 ID" },
          module: { type: "string", title: "组件库名" },
          component: { type: "string", title: "组件名" },
          name: { type: "string", title: "绑定字段" },
          value: { type: "number", title: "评分值" },
          label: { type: "string", title: "标题内容" },
          min: { type: "number", title: "最小值" },
          max: { type: "number", title: "最大值" },
          step: { type: "number", title: "数值调整步长" },
          visible: { type: "boolean", title: "是否展示" },
          disabled: { type: "boolean", title: "是否禁用" },
          readOnly: { type: "boolean", title: "是否只读" },
        },
        required: ["name", "label", "min", "max", "step"],
      },
      _version: "3.14.4",
    },
    "gsd-h5-react:WdModal": {
      isComposite: false,
      name: "WdModal",
      title: "弹窗",
      platform: ["H5", "小程序"],
      emitEvents: [
        {
          eventName: "open",
          name: "弹窗打开时",
          detail: {
            type: "object",
            properties: {
              info: {
                description:
                  "透传信息，在触发弹窗打开时接收该信息，信息来自于调用组件open方法的info",
              },
            },
          },
        },
        {
          eventName: "close",
          name: "弹窗关闭时",
          detail: {
            type: "object",
            properties: {
              info: {
                description:
                  "透传信息，在触发弹窗关闭时接收该信息，信息来自于调用组件close方法的info",
              },
            },
          },
        },
      ],
      dataForm: {
        defaultShow: { type: "boolean" },
        template: { type: "string" },
        position: { type: "string" },
        closeType: { type: "array" },
        defaultMaskShow: { type: "boolean" },
        headerSlot: { type: "slot" },
        contentSlot: { type: "slot" },
        footerSlot: { type: "slot" },
      },
      properties: {
        type: "object",
        properties: {
          id: { type: "string", title: "组件 ID" },
          module: { type: "string", title: "组件库名" },
          component: { type: "string", title: "组件名" },
          modalState: { type: "string", title: "弹窗状态" },
          openInfo: {},
          closeInfo: {},
        },
        required: ["modalState", "openInfo", "closeInfo"],
      },
      _version: "3.14.4",
    },
    "gsd-h5-react:Container": {
      isComposite: false,
      name: "Container",
      title: "普通容器",
      platform: ["H5", "小程序"],
      emitEvents: [
        { eventName: "tap", name: "点击" },
        { eventName: "longpress", name: "长按/contextmenu" },
        { eventName: "touchstart", name: "触摸开始" },
        { eventName: "touchmove", name: "触摸后移动" },
        { eventName: "touchcancel", name: "触摸取消" },
        { eventName: "touchend", name: "触摸结束" },
      ],
      isContainer: true,
      dataForm: { title: { type: "string" }, data: { type: "object" } },
      properties: {
        type: "object",
        properties: {
          id: { type: "string", title: "组件 ID" },
          module: { type: "string", title: "组件库名" },
          component: { type: "string", title: "组件名" },
          data: { type: "object", title: "数据" },
        },
      },
      _version: "3.14.4",
    },
    "gsd-h5-react:ScrollView": {
      isComposite: false,
      name: "ScrollView",
      title: "滚动容器",
      platform: ["H5", "小程序"],
      emitEvents: [
        { eventName: "scroll", name: "滚动时触发" },
        { eventName: "scrolltolower", name: "滚动到底部/右边时触发" },
        { eventName: "scrolltoupper", name: "滚动到顶部/左边时触发" },
        {
          eventName: "dragstart",
          name: "滑动开始事件(同时开启 enhanced 属性后生效)",
        },
        {
          eventName: "dragging",
          name: "滑动事件(同时开启 enhanced 属性后生效)",
        },
        {
          eventName: "dragend",
          name: "滑动结束事件(同时开启 enhanced 属性后生效)",
        },
        { eventName: "refresherpulling", name: "自定义下拉刷新控件被下拉" },
        { eventName: "refresherrefresh", name: "自定义下拉刷新被触发" },
        { eventName: "refresherrestore", name: "自定义下拉刷新被复位" },
        { eventName: "refresherabort", name: "自定义下拉刷新被中止" },
      ],
      isContainer: true,
      dataForm: {
        showScrollbar: { type: "boolean" },
        scrollX: { type: "boolean" },
        scrollY: { type: "boolean" },
        scrollIntoView: { type: "string" },
        scrollLeft: { type: "number" },
        scrollTop: { type: "number" },
        lowerThreshold: { type: "number" },
        upperThreshold: { type: "number" },
        enhanced: { type: "boolean" },
        bounces: { type: "boolean" },
        pagingEnabled: { type: "boolean" },
        fastDeceleration: { type: "boolean" },
        refresherEnabled: { type: "boolean" },
        refresherThreshold: { type: "number" },
        refresherDefaultStyle: { type: "string" },
        refresherBackground: { type: "string" },
        refresherTriggered: { type: "boolean" },
        scrollAnchoring: { type: "boolean" },
        enableFlex: { type: "boolean" },
        enableBackToTop: { type: "boolean" },
        scrollWithAnimation: { type: "boolean" },
      },
      _version: "3.14.4",
    },
    "gsd-h5-react:WdButton": {
      isComposite: false,
      name: "WdButton",
      title: "按钮",
      platform: ["H5", "小程序"],
      shortcut: { props: ["text", "theme", "size"] },
      emitEvents: [
        { eventName: "tap", name: "点击" },
        {
          eventName: "contact",
          name: "客服会话",
          detail: {
            type: "object",
            properties: {
              errMsg: {
                title: "错误信息",
                description: "错误信息",
                type: "string",
              },
              path: {
                title: "小程序消息指定的路径",
                description: "小程序消息指定的路径",
                type: "string",
              },
              query: {
                title: "小程序消息指定的查询参数",
                description: "小程序消息指定的查询参数",
                type: "object",
                properties: {},
              },
            },
            required: ["errMsg", "path", "query"],
          },
        },
        { eventName: "launchApp", name: "打开App" },
        { eventName: "openSetting", name: "打开授权设置" },
      ],
      dataForm: {
        text: { type: "string" },
        theme: { type: "string" },
        variant: { type: "string" },
        size: { type: "string" },
        block: { type: "boolean" },
        loading: { type: "boolean" },
        iconType: { type: "string" },
        iconSource: { type: "string" },
        icon: { type: "string" },
        iconSrc: { type: "string" },
        iconPosition: { type: "string" },
        disabled: { type: "boolean" },
        formType: { type: "string" },
        openType: { type: "string" },
        sessionFrom: { type: "string" },
        sendMessageTitle: { type: "string" },
        sendMessagePath: { type: "string" },
        sendMessageImg: { type: "string" },
        showMessageCard: { type: "boolean" },
        appParameter: { type: "string" },
      },
      properties: {
        type: "object",
        properties: {
          id: { type: "string", title: "组件 ID" },
          module: { type: "string", title: "组件库名" },
          component: { type: "string", title: "组件名" },
          text: { type: "string", title: "内容" },
          theme: { type: "string", title: "颜色" },
          variant: { type: "string", title: "类型" },
          size: { type: "string", title: "尺寸" },
          block: { type: "boolean", title: "是否通栏" },
          disabled: { type: "boolean", title: "是否禁用" },
          formType: { type: "string", title: "表单类型" },
          openType: { type: "string", title: "微信开放能力" },
        },
      },
      _version: "3.14.4",
    },
    "gsd-h5-react:WdCard": {
      isComposite: false,
      name: "WdCard",
      title: "卡片",
      platform: ["H5", "小程序"],
      emitEvents: [
        { eventName: "tap", name: "点击" },
        { eventName: "contentShow", name: "卡片内容面板显示时" },
        { eventName: "contentHide", name: "卡片内容面板隐藏时" },
      ],
      dataForm: {
        template: { type: "string" },
        showHeader: { type: "boolean" },
        showContent: { type: "boolean" },
        showFooter: { type: "boolean" },
        showDivider: { type: "boolean" },
        headerSlot: { type: "slot" },
        contentSlot: { type: "slot" },
        footerSlot: { type: "slot" },
      },
      properties: {
        type: "object",
        properties: {
          id: { type: "string", title: "组件 ID" },
          module: { type: "string", title: "组件库名" },
          component: { type: "string", title: "组件名" },
          showHeader: { type: "boolean", title: "显示卡片顶部" },
          showContent: { type: "boolean", title: "默认显示卡片内容" },
          showFooter: { type: "boolean", title: "显示卡片底部" },
          showDivider: { type: "boolean", title: "显示分割线" },
          contentState: { type: "string", title: "内容面板状态" },
        },
        required: ["contentState"],
      },
      _version: "3.14.4",
    },
    "gsd-h5-react:WdIcon": {
      isComposite: false,
      name: "WdIcon",
      title: "图标",
      platform: ["H5", "小程序"],
      shortcut: { props: ["type", "name", "src", "size"] },
      emitEvents: [{ eventName: "tap", name: "点击" }],
      dataForm: {
        type: { type: "string" },
        name: { type: "string" },
        src: { type: "string" },
        size: { type: "string" },
        color: { type: "string" },
        sizeSelfAdaptive: { type: "boolean" },
      },
      properties: {
        type: "object",
        properties: {
          id: { type: "string", title: "组件 ID" },
          module: { type: "string", title: "组件库名" },
          component: { type: "string", title: "组件名" },
          type: { type: "string", title: "图标类型" },
          name: { type: "string", title: "图标样式" },
          src: { type: "string", title: "自定义图标" },
          size: { type: "string", title: "图标尺寸" },
        },
        required: ["name"],
      },
      _version: "3.14.4",
    },
    "gsd-h5-react:WdText": {
      isComposite: false,
      name: "WdText",
      title: "文本",
      platform: ["H5", "小程序"],
      shortcut: { props: ["text", "level"] },
      emitEvents: [{ eventName: "tap", name: "点击" }],
      dataForm: {
        text: { type: "string" },
        level: { type: "string" },
        overflow: { type: "boolean" },
        maxLines: { type: "string" },
        tips: { type: "boolean" },
        space: { type: "boolean" },
        userSelect: { type: "boolean" },
        inheritColor: { type: "boolean" },
      },
      properties: {
        type: "object",
        properties: {
          id: { type: "string", title: "组件 ID" },
          module: { type: "string", title: "组件库名" },
          component: { type: "string", title: "组件名" },
          text: { type: "string", title: "文本内容" },
          level: { type: "string", title: "文本格式" },
          overflow: { type: "boolean", title: "溢出省略" },
          maxLines: { type: "string", title: "最大行数" },
          tips: { type: "boolean", title: "展示文本气泡" },
          space: { type: "boolean", title: "连续空格" },
          userSelect: { type: "boolean", title: "是否可选中" },
        },
        required: ["text"],
      },
      _version: "3.14.4",
    },
    "gsd-h5-react:WdBubble": {
      isComposite: false,
      name: "WdBubble",
      title: "气泡提示",
      platform: ["MOBILEWEB", "PCWEB"],
      shortcut: { props: ["trigger", "placement"] },
      emitEvents: [
        { eventName: "open", name: "打开气泡" },
        { eventName: "close", name: "关闭气泡" },
      ],
      dataForm: {
        trigger: { type: "string" },
        placement: { type: "string" },
        promptTheme: { type: "string" },
        openDelay: { type: "number" },
        closeDelay: { type: "number" },
        arrowPointAtCenter: { type: "boolean" },
        bubbleContent: { type: "slot" },
        bubbleChildren: { type: "slot" },
      },
      properties: {
        type: "object",
        properties: {
          id: { type: "string", title: "组件 ID" },
          module: { type: "string", title: "组件库名" },
          component: { type: "string", title: "组件名" },
          trigger: { type: "string", title: "触发行为" },
          placement: { type: "string", title: "弹出方向" },
          promptTheme: { type: "string", title: "气泡风格" },
        },
        required: ["trigger", "placement", "promptTheme"],
      },
      _version: "3.14.4",
    },
    "gsd-h5-react:WdImage": {
      isComposite: false,
      name: "WdImage",
      title: "图片",
      platform: ["H5", "小程序"],
      shortcut: { props: ["src"] },
      emitEvents: [
        { eventName: "load", name: "加载成功" },
        { eventName: "error", name: "加载失败" },
        { eventName: "tap", name: "点击" },
      ],
      dataForm: {
        src: { type: "string" },
        fit: { type: "string" },
        imgPreview: { type: "boolean" },
        maskClosable: { type: "boolean" },
        alt: { type: "string" },
        showMenuByLongpress: { type: "boolean" },
        lazyLoad: { type: "boolean" },
      },
      properties: {
        type: "object",
        properties: {
          id: { type: "string", title: "组件 ID" },
          module: { type: "string", title: "组件库名" },
          component: { type: "string", title: "组件名" },
          src: { type: "string", title: "地址" },
          fit: { type: "string", title: "布局模式" },
          alt: { type: "string", title: "替代文字" },
        },
        required: ["alt"],
      },
      _version: "3.14.4",
    },
    "gsd-h5-react:WdTextarea": {
      isComposite: false,
      name: "WdTextarea",
      title: "多行输入",
      platform: ["H5", "小程序"],
      shortcut: { props: ["name", "label"] },
      emitEvents: [
        {
          eventName: "change",
          name: "值改变",
          detail: {
            type: "object",
            properties: { value: { description: "输入值", type: "string" } },
            required: ["value"],
          },
        },
        {
          eventName: "focus",
          name: "聚焦",
          detail: {
            type: "object",
            properties: { value: { description: "输入值", type: "string" } },
            required: ["value"],
          },
        },
        {
          eventName: "blur",
          name: "失焦",
          detail: {
            type: "object",
            properties: { value: { description: "输入值", type: "string" } },
            required: ["value"],
          },
        },
        {
          eventName: "confirm",
          name: "确认",
          detail: {
            type: "object",
            properties: { value: { description: "输入值", type: "string" } },
            required: ["value"],
          },
        },
      ],
      compConfig: { componentType: "formField" },
      dataForm: {
        name: { type: "string" },
        value: { type: "string" },
        placeholder: { type: "string" },
        size: { type: "string" },
        label: { type: "string" },
        labelVisible: { type: "boolean" },
        labelAlign: { type: "string" },
        labelWrap: { type: "boolean" },
        layout: { type: "string" },
        labelWidth: { type: "string" },
        labelTips: { type: "string" },
        autoHeight: { type: "boolean" },
        cursorSpacing: { type: "number" },
        extra: { type: "string" },
        counterVisible: { type: "boolean" },
        focus: { type: "boolean" },
        borderedH5: { type: "boolean" },
        borderedPc: { type: "boolean" },
        maxLength: { type: "number" },
        rules: { type: "array" },
        status: { type: "string" },
        required: { type: "boolean" },
        requiredMsg: { type: "string" },
        requiredFlag: { type: "boolean" },
      },
      properties: {
        type: "object",
        properties: {
          id: { type: "string", title: "组件 ID" },
          module: { type: "string", title: "组件库名" },
          component: { type: "string", title: "组件名" },
          name: { type: "string", title: "绑定字段" },
          value: { type: "string", title: "输入值" },
          label: { type: "string", title: "标题内容" },
          required: { type: "boolean", title: "必填" },
          visible: { type: "boolean", title: "是否展示" },
          disabled: { type: "boolean", title: "是否禁用" },
          readOnly: { type: "boolean", title: "是否只读" },
        },
      },
      _version: "3.14.4",
    },
    "gsd-h5-react:WdTagSelect": {
      isComposite: false,
      name: "WdTagSelect",
      title: "标签选择",
      platform: ["H5", "小程序"],
      shortcut: { props: ["name", "label"] },
      emitEvents: [
        {
          eventName: "change",
          name: "值改变",
          detail: {
            type: "object",
            properties: { value: { description: "输入值" } },
            required: ["value"],
          },
        },
      ],
      compConfig: { componentType: "formField" },
      dataForm: {
        name: { type: "string" },
        range: { type: "array" },
        checkType: { type: "string" },
        value: {},
        size: { type: "string" },
        borderedH5: { type: "boolean" },
        extra: { type: "string" },
        direction: { type: "string" },
        tagStyleType: { type: "string" },
        tagStyleColor: { type: "string" },
        tagStyleRadius: { type: "string" },
        tagStyleWidthType: { type: "string" },
        tagStyleWidthCols: { type: "number" },
        tagStyleSpace: { type: "string" },
        label: { type: "string" },
        labelVisible: { type: "boolean" },
        labelAlign: { type: "string" },
        labelWrap: { type: "boolean" },
        layout: { type: "string" },
        labelWidth: { type: "string" },
        labelTips: { type: "string" },
        status: { type: "string" },
        required: { type: "boolean" },
        requiredFlag: { type: "boolean" },
        requiredMsg: { type: "string" },
      },
      properties: {
        type: "object",
        properties: {
          id: { type: "string", title: "组件 ID" },
          module: { type: "string", title: "组件库名" },
          component: { type: "string", title: "组件名" },
          name: { type: "string", title: "绑定字段" },
          range: { type: "array", title: "选项" },
          value: { title: "默认选中标签" },
          label: { type: "string", title: "标题内容" },
          required: { type: "boolean", title: "必填" },
          visible: { type: "boolean", title: "是否展示" },
          disabled: { type: "boolean", title: "是否禁用" },
          readOnly: { type: "boolean", title: "是否只读" },
          selectedLabel: { type: "string", title: "选中项名称" },
          item: { type: "object", title: "选中项" },
        },
      },
      _version: "3.14.4",
    },
    "gsd-h5-react:WdMenuLayout": {
      isComposite: false,
      name: "WdMenuLayout",
      title: "布局导航",
      platform: ["H5", "小程序"],
      emitEvents: [
        {
          eventName: "menuClick",
          name: "点击菜单项",
          detail: {
            type: "object",
            properties: {
              item: {
                $id: "Node",
                type: "object",
                properties: {
                  title: { title: "名称", type: "string" },
                  key: { title: "key值", type: "string" },
                  iconUrl: { title: "图标", type: "string" },
                  iconPath: { title: "自定义未选中图标", type: "string" },
                  selectedIconPath: { title: "自定义选中图标", type: "string" },
                  disabled: { title: "禁用菜单", type: "boolean" },
                  visible: { title: "显示菜单", type: "boolean" },
                  type: {
                    type: "string",
                    enum: ["link", "route"],
                    "x-component-props": {
                      options: [
                        { text: "外部链接", value: "link", label: "外部链接" },
                        { text: "内部链接", value: "route", label: "内部链接" },
                      ],
                    },
                    title: "链接类型",
                  },
                  path: { title: "跳转内部链接", type: "string" },
                  linkUrl: { title: "跳转外部链接", type: "string" },
                  linkTargetBlank: { title: "跳转开启新窗口", type: "boolean" },
                  children: { type: "array", items: { $ref: "Node" } },
                  subPackageName: { title: "子包名称", type: "string" },
                },
                required: ["title", "key", "disabled", "visible"],
                title: "选中菜单项",
              },
            },
            required: ["item"],
          },
        },
      ],
      dataForm: {
        headSlot: { type: "slot" },
        headRightSlot: { type: "slot" },
        contentSlot: { type: "slot" },
        footerSlot: { type: "slot" },
        template: { type: "string" },
        menu: { type: "object" },
        type: { type: "string" },
        defaultOpened: { type: "boolean" },
        outerClickClosable: { type: "boolean" },
        selectedMenuKey: { type: "string" },
      },
      properties: {
        type: "object",
        properties: {
          id: { type: "string", title: "组件 ID" },
          module: { type: "string", title: "组件库名" },
          component: { type: "string", title: "组件名" },
        },
      },
      _version: "3.14.4",
    },
  };

  React.useEffect(() => {
    const loadAndGenerateComponent = async () => {
      try {
        // 加载运行时依赖
        const { componentsMap: repeaterComponentsMap } =
          await loadRuntimeDependencies();
        Object.assign(componentsMap, repeaterComponentsMap);

        // 生成复合组件
        const compositeComponent = await generateCompositeComponent({
          sourceKey: "",
          comp: item,
          module: "block",
          componentsMap,
          componentActionsMap,
          componentsInfoMap,
          options: {
            enablePageRootId: true,
            lowcodeContext: {},
            looseError: true,
            processCssUnit: "px",
            disablePageComponentInvoke: true,
          },
        });

        // 设置复合组件
        setCompositeComponent(compositeComponent);
      } catch (error) {
        console.error("Error loading and generating component:", error);
      }
    };

    loadAndGenerateComponent();
  }, []);

  if (!compositeComponent) {
    return <></>;
  }
  const CompositeComponent = compositeComponent;

  return (
    <CompositeComponent
      events={events}
      $node={$node}
      $widget={$widget}
      compositeParent={compositeParent}
      isInComposite={isInComposite}
      forIndexes={forIndexes}
      className={className}
      style={style}
      data={data}
      ref={ref}
      emit={emit}
    ></CompositeComponent>
  );
});
