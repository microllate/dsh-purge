"use strict";

// Operit ToolPkg diagnostic adapter: read-only until DeepSeek model identity is proven.
// No prompt, tool, memory, or agent runtime mutations are performed.

function onChatRuntime(_event) {
    return null;
}

function onPromptProbe(event) {
    if (!event || event.eventName !== "before_send_to_model") return null;
    const payload = event.eventPayload || {};
    const params = payload.modelParameters || {};
    const metadata = payload.metadata || {};
    const names = Object.keys(params).concat(Object.keys(metadata)).filter(
        key => /model|provider|api|engine|service/i.test(key)
    );
    const uniqueNames = Array.from(new Set(names)).slice(0, 20);
    // Key names only: never print API keys, prompt text, messages, or user data.
    if (typeof console !== "undefined" && typeof console.log === "function") {
        console.log("[dsh-purge-operit] model identity field names: " +
            (uniqueNames.length ? uniqueNames.join(", ") : "(none)"));
    }
    return null;
}

function registerToolPkg() {
    ToolPkg.registerChatRuntimeHook({
        id: "dsh_purge_deepseek_runtime_observer",
        function: onChatRuntime
    });
    ToolPkg.registerPromptFinalizeHook({
        id: "dsh_purge_deepseek_model_probe",
        function: onPromptProbe
    });
    return true;
}

if (typeof exports !== "undefined") {
    exports.registerToolPkg = registerToolPkg;
    exports.onChatRuntime = onChatRuntime;
    exports.onPromptProbe = onPromptProbe;
}
