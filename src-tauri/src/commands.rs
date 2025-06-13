use tauri::AppHandle;
use tauri_plugin_clipboard_manager::ClipboardExt;

#[tauri::command]
pub fn copy_to_clipboard(app: AppHandle, character: char) {
    app.clipboard().write_text(character.to_string()).unwrap();
}
