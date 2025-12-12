exports.up = function (knex) {
    return knex.schema.createTable('shared_notes', (table) => {
        table.increments('id').primary();
        table.integer('note_id').unsigned().notNullable();
        table.integer('shared_with_user_id').unsigned().notNullable();
        table.enum('permission', ['read', 'write']).defaultTo('read');
        table.timestamps(true, true);

        table.foreign('note_id').references('id').inTable('notes').onDelete('CASCADE');
        table.foreign('shared_with_user_id').references('id').inTable('users').onDelete('CASCADE');
        table.unique(['note_id', 'shared_with_user_id']); // Prevent duplicate shares
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('shared_notes');
};
