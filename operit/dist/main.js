"use strict";
// Diagnostic only: never mutate prompts or expose message contents.
var KEY = "DSH_PURGE_PROMPT_PROBE_V04";
async function onPromptProbe(event) {
    var payload = event && event.eventPayload || {};
    var params = payload.modelParameters || {};
    var meta = payload.metadata || {};
    var keys = Object.keys(params).map(function(k){return "modelParameters."+k;})
      .concat(Object.keys(meta).map(function(k){return "metadata."+k;}))
      .filter(function(k){return /model|provider|engine|service/i.test(k);}).slice(0,10);
    var info = {
      stage: String(payload.stage || event.eventName || "unknown"),
      modelFields: keys,
      timestamp: new Date().toISOString()
    };
    try {
      await Tools.SoftwareSettings.writeEnvironmentVariable(KEY, JSON.stringify(info));
    } catch (_) {}
    return null;
}
async function onInputMenuToggle(event) {
    if (!event || !event.eventPayload || event.eventPayload.action !== "create") return null;
    var desc = "尚无记录；发送消息后关闭并重新打开此菜单";
    try {
      var result = await Tools.SoftwareSettings.readEnvironmentVariable(KEY);
      if (result && result.exists && result.value) {
        var info = JSON.parse(result.value);
        desc = "已记录 "+info.stage+"；字段："+(info.modelFields.join(", ") || "无");
      }
    } catch (_) {desc = "诊断读取失败；请检查插件日志";}
    return {toggles:[{
      id:"dsh_purge_probe_display",
      title:"dsh-purge 诊断（只读）",
      description:desc,
      isChecked:false,
      slot:"general"
    }]};
}
function registerToolPkg() {
    ToolPkg.registerInputMenuTogglePlugin({id:"dsh_purge_probe_menu_v04",function:onInputMenuToggle});
    ToolPkg.registerPromptFinalizeHook({id:"dsh_purge_probe_finalize_v04",function:onPromptProbe});
    return true;
}
if(typeof exports!=="undefined"){
  exports.registerToolPkg=registerToolPkg;
  exports.onInputMenuToggle=onInputMenuToggle;
  exports.onPromptProbe=onPromptProbe;
}
