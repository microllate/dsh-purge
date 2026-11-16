"use strict";

// Operit ToolPkg entry point. DSH/Cordis and Node.js are not loaded here.
// All hooks are observational until a reliable DeepSeek-only provider guard is verified.

function onChatRuntime(event) {
    // Runtime notifications do not grant control over the host agent loop.
    return null;
}

function registerToolPkg() {
    ToolPkg.registerChatRuntimeHook({
        id: "dsh_purge_deepseek_runtime_observer",
        function: onChatRuntime
    });
    return true;
}

if (typeof exports !== "undefined") {
    exports.registerToolPkg = registerToolPkg;
    exports.onChatRuntime = onChatRuntime;
}
