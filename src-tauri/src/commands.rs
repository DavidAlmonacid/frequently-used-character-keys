use tauri::AppHandle;
use tauri_plugin_clipboard_manager::ClipboardExt;

#[tauri::command]
pub fn copy_to_clipboard(app: AppHandle, character: char) {
    if let Err(e) = app.clipboard().write_text(character.to_string()) {
        eprintln!("Failed to write to clipboard: {}", e);
    }
}

#[tauri::command]
pub fn read_from_clipboard(app: AppHandle) -> Result<String, String> {
    app.clipboard().read_text().map_err(|e| e.to_string())
}
