exports.up = function (knex) {
    return knex.schema.createTable('notes', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.string('title', 255);
        table.text('content');
        table.string('color', 50).defaultTo('#ffffff');
        table.boolean('is_archived').defaultTo(false);
        table.boolean('is_pinned').defaultTo(false);
        table.timestamps(true, true);

        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('notes');
};
