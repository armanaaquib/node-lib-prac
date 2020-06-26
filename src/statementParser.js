class ModelStatementParser {
  constructor(schema, tableName) {
    this.tableName = tableName;
    this.schema = schema;
  }

  createTable() {
    const columnData = this.schema.join(',');
    return `CREATE TABLE IF NOT EXISTS ${this.tableName}(${columnData})`;
  }

  insert({columns, values}) {
    const insertedData = values.map((statement) => `(${statement})`).join();
    return `INSERT INTO ${this.tableName} (${columns})
                  VALUES ${insertedData}`;
  }

  update({columns, where}) {
    const dataToUpdate = columns.join(',');
    return `UPDATE ${this.tableName}
              SET ${dataToUpdate}
              WHERE ${where}`;
  }

  delete(conditions) {
    return `DELETE FROM ${this.tableName} 
              WHERE ${conditions.join('OR')}`;
  }

  select({columns, where, orderBy, groupBy}) {
    let query = `SELECT ${columns.join(',')} FROM ${this.tableName}`;
    query = where ? query + ` WHERE ${where}` : query;
    query = groupBy ? query + ` GROUP BY ${groupBy}` : query;
    query = orderBy ? query + ` ORDER BY ${orderBy}` : query;
    return query;
  }
}

module.exports = {ModelStatementParser};
