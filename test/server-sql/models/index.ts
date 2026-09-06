// Re-exports the library's SQL model classes so the test Server's ClassLoader (rooted at
// `test/server-sql`) can discover their `@DataStore` metadata alongside the test routes that use them.
export * from "@rapidmx/restapi/sql";
