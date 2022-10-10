// 这是项目发布阶段需要用到的 babel 插件
const prodPlugins = []
if(process.env.NODE_ENV === 'production'){
  // 移除console.log
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    ...prodPlugins,
    "@babel/plugin-syntax-dynamic-import"
  ]
}