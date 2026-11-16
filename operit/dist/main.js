"use strict";

const DIAG_KEY = "DSH_PURGE_OPERIT_PROBE";
const TOGGLE_ID = "dsh_purge_probe_status";
function readStatus() {
    try {
        const value = typeof getEnv === "function" ? getEnv(DIAG_KEY) : "";
        return String(value || "尚未收到 Prompt Hook 事件");
    } catch (_) {
        return "诊断状态读取失败";
    }
}
async function onPromptProbe(event) {
    const stage = event && (event.eventName || event.event);
    if (stage !== "before_send_to_model") return null;
    const payload = event.eventPayload || {};
    const params = payload.modelParameters || {};
    const metadata = payload.metadata || {};
    const keys = Object.keys(params).map(k => "params." + k)
        .concat(Object.keys(metadata).map(k => "metadata." + k))
        .filter(k => /model|provider|engine|service/i.test(k))
        .slice(0, 8);
    const status = "Hook已触发；字段：" + (keys.length ? keys.join(", ") : "无模型标识字段");
    try {
        if (typeof Tools !== "undefined" && Tools.SoftwareSettings &&
            typeof Tools.SoftwareSettings.writeEnvironmentVariable === "function") {
            await Tools.SoftwareSettings.writeEnvironmentVariable(DIAG_KEY, status);
        }
    } catch (_) {
        // Diagnostic storage is optional; do not affect model requests.
    }
    return null;
}
function onInputMenuToggle(event) {
    const payload = (event && event.eventPayload) || {};
    if (payload.action === "create") {
        return {toggles: [{
            id: TOGGLE_ID,
            title: "dsh-purge 诊断",
            description: readStatus(),
            isChecked: false
        }]};
    }
    return null;
}
function registerToolPkg() {
    ToolPkg.registerPromptFinalizeHook({
        id: "dsh_purge_deepseek_model_probe",
        function: onPromptProbe
    });
    ToolPkg.registerInputMenuTogglePlugin({
        id: "dsh_purge_probe_menu",
        function: onInputMenuToggle
    });
    return true;
}
if (typeof exports !== "undefined") {
    exports.registerToolPkg = registerToolPkg;
    exports.onPromptProbe = onPromptProbe;
    exports.onInputMenuToggle = onInputMenuToggle;
}
