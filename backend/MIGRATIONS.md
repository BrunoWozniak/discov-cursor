# Database Migrations with Knex.js

This project uses [Knex.js](https://knexjs.org/) for database schema migrations.

**All migration commands run inside the backend container—no local install needed!**

---

## How to Change the Database Schema (Development Workflow)

### 1. Create a Migration File

```bash
docker-compose exec backend npx knex migrate:make your_migration_name
```

- Replace `your_migration_name` with a descriptive name (e.g., `add_due_date_to_todos`).

---

### 2. Edit the Migration File

- Open the new file in `backend/migrations/`.
- In `exports.up`, write the schema change (e.g., add a column).
- In `exports.down`, write how to undo the change.

**Example:**

```js
exports.up = function (knex) {
  return knex.schema.table("todos", function (table) {
    table.date("due_date");
  });
};

exports.down = function (knex) {
  return knex.schema.table("todos", function (table) {
    table.dropColumn("due_date");
  });
};
```

---

### 3. Apply the Migration (Automatic)

- **No manual command needed!**
- When you run or restart your backend container (e.g., with `docker-compose up -d`), the backend will:
  1. Automatically run `npm run migrate` (see `package.json` scripts).
  2. Apply any new migrations to the database.
  3. Start your backend server.

---

### 4. (Optional) Check Migration Status

```bash
docker-compose exec backend npx knex migrate:status
```

---

## Notes

- You never need to install Knex or pg on your host—everything runs inside the backend container.
- Only create/edit migration files manually; migration application is automated.
- For production, you can use the same workflow or run migrations as part of your CI/CD pipeline.
