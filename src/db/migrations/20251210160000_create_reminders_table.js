exports.up = function (knex) {
    return knex.schema.createTable('reminders', (table) => {
        table.increments('id').primary();
        table.integer('note_id').unsigned().notNullable();
        table.timestamp('reminder_time').notNullable();
        table.boolean('is_sent').defaultTo(false);
        table.timestamps(true, true);

        table.foreign('note_id').references('id').inTable('notes').onDelete('CASCADE');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('reminders');
};
