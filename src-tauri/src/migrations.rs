use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "create_table",
        sql: "
        CREATE TABLE characters (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            character NVARCHAR(15) NOT NULL UNIQUE
        );
        ",
        kind: MigrationKind::Up,
    }]
}
