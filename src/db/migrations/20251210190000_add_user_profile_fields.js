exports.up = function (knex) {
    return knex.schema.table('users', (table) => {
        table.string('name', 255);
        table.string('avatar_url', 500);
        table.jsonb('preferences').defaultTo('{}');
    });
};

exports.down = function (knex) {
    return knex.schema.table('users', (table) => {
        table.dropColumn('name');
        table.dropColumn('avatar_url');
        table.dropColumn('preferences');
    });
};
