# Operit / DeepSeek adapter

This directory is reserved for porting dsh-purge into an **Operit ToolPkg**, without changing either host application's internal code.

## Scope
- Target: Operit with DeepSeek provider only.
- Preserve the original DSH entry points, package metadata and behavior.
- Use public Operit ToolPkg APIs and package resources only.
- Do not assume Node.js, Electron, DSH Cordis, or host file patching is available inside Operit's QuickJS runtime.
- Do not alter Operit's conversation summary, memory or tool execution behavior unless an explicit public Hook supports the change.

## Verified public integration points
| Feature | Operit ToolPkg API | Porting status |
| --- | --- | --- |
| Prompt presets and composition | registerSystemPromptComposeHook | API confirmed; provider scoping to verify |
| Final request prompt mutation | registerPromptFinalizeHook | API confirmed; provider scoping to verify |
| Tool lifecycle observation | registerToolLifecycleHook | API confirmed; control capability not established |
| Agent runtime observation | registerChatRuntimeHook | API confirmed; events are observational |
| Settings UI | registerToolboxUiModule | API confirmed; UI implementation pending |
| Message processing | registerMessageProcessingPlugin | API confirmed; behavior and compatibility to test |
| DSH-specific host patching | No equivalent established | Not portable as-is |
| Automatic retry / permission changes | No equivalent established | Do not claim support |

## Next implementation gate
1. Inspect an actual Operit distributable ToolPkg manifest and main.js registration pattern.
2. Verify whether the prompt Hook payload exposes a reliable DeepSeek provider/model identifier.
3. Implement a minimal installable ToolPkg that is inert for non-DeepSeek models.
4. Test install, enable/disable, prompt mutation, and preservation of summary/memory behavior.
5. Port individual dsh-purge features, marking unsupported host-specific behavior explicitly.

References:
- Operit docs: `docs/doc-src/package-dev/toolpkg.md`
- Operit runtime: `ToolPkgPromptHookBridge.kt`, `ToolPkgChatRuntimeHookBridge.kt`
- dsh-purge source: `lib/presets.js`, `lib/preset-injection.js`, `lib/boost.js`
