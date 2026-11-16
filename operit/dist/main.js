"use strict";
var probeState = { count: 0, stage: "" };
function onPromptProbe(event) {
    var payload = event && event.eventPayload || {};
    probeState.count += 1;
    probeState.stage = String(payload.stage || "(empty stage)");
    return null;
}
function onInputMenuToggle(event) {
    if (!event || !event.eventPayload || event.eventPayload.action !== "create") return null;
    return {toggles:[{
        id:"dsh_purge_prompt_probe",
        title:"dsh-purge 诊断",
        description:probeState.count ? ("Prompt Hook 已执行 " + probeState.count + " 次；stage=" + probeState.stage) : "菜单已注册；Prompt Hook 尚未在当前 JS 运行实例中观测到",
        isChecked:false,
        slot:"general"
    }]};
}
function registerToolPkg() {
    ToolPkg.registerInputMenuTogglePlugin({id:"dsh_purge_probe_menu",function:onInputMenuToggle});
    ToolPkg.registerPromptFinalizeHook({id:"dsh_purge_probe_finalize",function:onPromptProbe});
    return true;
}
if(typeof exports!=="undefined"){
    exports.registerToolPkg=registerToolPkg;
    exports.onInputMenuToggle=onInputMenuToggle;
    exports.onPromptProbe=onPromptProbe;
}
