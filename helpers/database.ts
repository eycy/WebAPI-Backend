import { Sequelize, QueryTypes } from 'sequelize';
import { config } from '../config';

// define an async utility function to get a connection
// run an SQL query then end the connection
export const run_query = async (query, values) => {
  try {
    const sequelize = new Sequelize(`postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`);
    await sequelize.authenticate();
    const data = await sequelize.query(query, {
      replacements: values,
      type: QueryTypes.SELECT
    });
    await sequelize.close();
    return data;
  } catch (err: any) {
    console.error(err, query, values);
    throw 'Database query error';
  }
}

export const run_insert = async function run_insert(sql: string, values: any) {
  try {
    const sequelize = new Sequelize(`postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`);
    await sequelize.authenticate();
    const data = await sequelize.query(sql, {
      replacements: values,
      type: QueryTypes.INSERT
    });
    await sequelize.close();
    console.log('run_insert:');
    console.log(data);
    return data;
  } catch (err: any) {
    console.error(err, values);
    throw 'Database query error';
  }
}

export const run_update = async function run_update(sql: string, values: any) {
  try {
    const sequelize = new Sequelize(`postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`);
    await sequelize.authenticate();
    const data = await sequelize.query(sql, {
      replacements: values,
      type: QueryTypes.UPDATE
    });
    await sequelize.close();
    return data;
  } catch (err: any) {
    console.error(err, sql, values);
    throw 'Database query error';
  }
}

export const run_delete = async function run_update(sql: string, values: any) {
  try {
    const sequelize = new Sequelize(`postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`);
    await sequelize.authenticate();
    const data = await sequelize.query(sql, {
      replacements: values,
      type: QueryTypes.DELETE
    });
    await sequelize.close();
    return data;
  } catch (err: any) {
    console.error(err, sql, values);
    throw 'Database query error';
  }
}

