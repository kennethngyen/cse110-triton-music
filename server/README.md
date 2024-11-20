# Database Schema Migrations

- Changing the schema locally requires an update to the remote database to reflect the changes. 
- To do this, run npm run db:generate and then npm run db:migrate. 
- Generate generates a migration script from old schema to new schema, then second command applies migration.
