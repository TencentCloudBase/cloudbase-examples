export function addCustomClassPlugin(md) {
    // 覆盖渲染逻辑
    md.renderer.rules.p_open = (tokens, idx, options, env, self) => {
      tokens[idx].attrPush(['class', 'custom - paragraph']);
      return self.renderToken(tokens, idx, options);
    };

}