const options = {
  paragraph_open: "_p",
  bullet_list_open: "_ul",
  ordered_list_open: "_ol",
  hr: "_hr",
  link_open: "_a",
  blockquote_open: "_blockquote",
  table_open: "_table",
  thead_open: "_thead",
  tr_open: "_tr",
  th_open: "_th",
  td_open: "_td",
};
export function addCustomClassPlugin(md) {
  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    // console.log(token)
    // 判断当前标签是否为 h1
    if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(token.tag)) {
      // 给 h1 标签添加 class 属性
      token.attrJoin("class", `_${token.tag}`);
    }
    return self.renderToken(tokens, idx, options);
  };
  Object.keys(options).forEach((key) => {
    const className = options[key];
    md.renderer.rules[key] = (tokens, idx, options, env, self) => {
      tokens[idx].attrPush(["class", className]);
      return self.renderToken(tokens, idx, options);
    };
  });
}
