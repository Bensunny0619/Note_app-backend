exports.up = function (knex) {
    return knex.schema.createTable('checklist_items', (table) => {
        table.increments('id').primary();
        table.integer('note_id').unsigned().notNullable();
        table.text('text').notNullable();
        table.boolean('is_checked').defaultTo(false);
        table.integer('position').defaultTo(0);
        table.timestamps(true, true);

        table.foreign('note_id').references('id').inTable('notes').onDelete('CASCADE');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('checklist_items');
};
