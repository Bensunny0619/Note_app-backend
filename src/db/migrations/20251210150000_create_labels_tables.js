exports.up = function (knex) {
    return knex.schema
        .createTable('labels', (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable();
            table.string('name', 100).notNullable();
            table.string('color', 50).defaultTo('#808080');
            table.timestamps(true, true);

            table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
            table.unique(['user_id', 'name']); // User can't have duplicate label names
        })
        .createTable('note_labels', (table) => {
            table.increments('id').primary();
            table.integer('note_id').unsigned().notNullable();
            table.integer('label_id').unsigned().notNullable();
            table.timestamps(true, true);

            table.foreign('note_id').references('id').inTable('notes').onDelete('CASCADE');
            table.foreign('label_id').references('id').inTable('labels').onDelete('CASCADE');
            table.unique(['note_id', 'label_id']); // Prevent duplicate label assignments
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTable('note_labels')
        .dropTable('labels');
};
