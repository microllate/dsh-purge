"use strict";

// Minimal menu registration probe. No prompt mutations or external dependencies.
function onInputMenuToggle(event) {
    if (!event || !event.eventPayload || event.eventPayload.action !== "create") {
        return null;
    }
    return {
        toggles: [{
            id: "dsh_purge_menu_probe",
            title: "dsh-purge 测试",
            description: "菜单注册测试：此版本不会修改模型请求",
            isChecked: false,
            slot: "general"
        }]
    };
}
function registerToolPkg() {
    ToolPkg.registerInputMenuTogglePlugin({
        id: "dsh_purge_menu_probe_plugin",
        function: onInputMenuToggle
    });
    return true;
}
if (typeof exports !== "undefined") {
    exports.registerToolPkg = registerToolPkg;
    exports.onInputMenuToggle = onInputMenuToggle;
}
