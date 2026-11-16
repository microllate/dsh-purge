"use strict";
// Diagnostic only: never mutate prompts or expose message contents.
var KEY = "DSH_PURGE_PROMPT_PROBE_V04";
async function onPromptProbe(event) {
    var payload = event && event.eventPayload || {};
    var params = payload.modelParameters || {};
    var meta = payload.metadata || {};
    var entries = Array.isArray(params) ? params : [params];
    var keys = [];
    var modelHints = [];
    entries.forEach(function(item, index) {
      if (!item || typeof item !== "object") return;
      Object.keys(item).forEach(function(k) {
        if (!/model|provider|engine|service|name|id/i.test(k)) return;
        keys.push("modelParameters["+index+"]."+k);
        var v = item[k];
        if (typeof v === "string" && v.length <= 100 && /model|provider|engine/i.test(k)) {
          modelHints.push(k+"="+v);
        }
      });
    });
    Object.keys(meta).forEach(function(k) {
      if (!/model|provider|engine|service/i.test(k)) return;
      keys.push("metadata."+k);
      var v = meta[k];
      if (typeof v === "string" && v.length <= 100) modelHints.push(k+"="+v);
    });
    keys = keys.slice(0, 12);
    modelHints = modelHints.slice(0, 4);
    var info = {
      stage: String(payload.stage || event.eventName || "unknown"),
      modelFields: keys,
      modelHints: modelHints,
      parameterCount: entries.length,
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
        desc = "已记录 "+info.stage+"；模型："+((info.modelHints || []).join(", ") || "未识别")+"；字段："+(info.modelFields.join(", ") || "无");
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
