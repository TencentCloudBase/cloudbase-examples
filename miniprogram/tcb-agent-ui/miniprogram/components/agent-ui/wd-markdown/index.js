import MarkdownIt from './utils/markdown-it.min.js';
import highlight from './utils/highlight.min.js';
import hljsJs from './utils/hljs_javascript.min.js';
import hljsCss from './utils/hljs_css.min.js';
import { addCustomClassPlugin } from './utils/plugin'
Component({
  options: {
    virtualHost: true,
  },
  properties: {
    className: {
      type: String,
      value: '',
    },
    style: {
      type: String,
      value: '',
    },
    id: {
      type: String,
      value: '',
    },
    markdown: {
      type: String,
      value: '',
    },
    fontSize: {
      type: Number,
      value: 32
    },
    options: {
      type: Object,
      value: {},
    },
  },
  data: {
    __html: '',
    mdInstance: null,
  },
  methods: {
    init() {
      const { options } = this.data;

      const hljs = highlight();
      const javascript = hljsJs();
      const css = hljsCss();
      hljs.registerLanguage('javascript', javascript);
      hljs.registerLanguage('css', css);
      const md = new MarkdownIt({
        // 默认开启高亮
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return (
                '<pre class="_pre"><code class="hljs">' +
                hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                '</code></pre>'
              );
            } catch (__) { }
          }
          return '<pre class="_pre"><code class="hljs">' + str + '</code></pre>';
        },
        ...options,
      });
      // console.log(md.renderer.rules)
      addCustomClassPlugin(md)
      this.setData({ mdInstance: md });
      this.triggerEvent('onReady', { markdownInstance: md });
      this.setData({
        __html: md.render(this.data.markdown),
      });
    },
    updateWidgetAPI() {
      this.setReadonlyAttributes &&
        this.setReadonlyAttributes({
          value: this.properties.markdown,
          markdownInstance: this.data.mdInstance,
          updateMarkdownInstance: ({ markdownInstance }) => this.setData({ mdInstance: markdownInstance }),
        });
    },
  },
  observers: {
    markdown: function () {
      const { mdInstance } = this.data;
      if (!mdInstance) return;
      const html = mdInstance.render(this.data.markdown)
      // console.log(html)
      this.setData({
        __html: html,
      });
    },
    options: function () {
      this.init();
    },
    'markdown,mdInstance': function () {
      this.updateWidgetAPI();
    },
  },
  lifetimes: {
    attached() {
      this.init();
      this.updateWidgetAPI();
    },
  },
});
