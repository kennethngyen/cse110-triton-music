# Database Schema Migrations

To do this:
1) Add the column or specific table desired: i.e. say you want to add `date: int("date", { mode: "timestamp" }).notNull()`, to some table, you add it to the table

2) Changing the schema locally requires an update to the remote database to reflect the changes. 
- To do this, run `**npm run db:generate**` and then `**npm run db:migrate**`. 
- Generate generates a migration script from old schema to new schema, then second command applies migration.
