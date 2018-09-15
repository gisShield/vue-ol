import VueOpenlayers from './vue-openlayers.js';
const MyPlugin = {}
MyPlugin.install = function (Vue, options) {
  // 4. 添加实例方法
  Vue.prototype.$VueOpenlayers = VueOpenlayers;

}
export default MyPlugin
