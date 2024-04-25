import * as db from '../helpers/database';

//get a single dog by its id
export const getById = async (id: any) => {
  const query = "SELECT * FROM dogs WHERE ID = ?"
  const values = [id]
  const data = await db.run_query(query, values);
  return data;
}
//list all the dogs in the database
export const getAll = async () => {
  // TODO: use page, limit, order to give pagination
  const query = "SELECT * FROM dogs;"
  const data = await db.run_query(query, null);
  return data;
}
//create a new dog in the database
export const add = async (dog: any) => {
  const keys = Object.keys(dog);
  const values = Object.values(dog);
  const key = keys.join(',');
  let param = '';
  for (let i: number = 0; i < values.length; i++) { param += '?,' }
  param = param.slice(0, -1);
  const query = `INSERT INTO dogs (${key}) VALUES (${param})`;
  try {
    await db.run_insert(query, values);
    return { status: 201 };
  } catch (err: any) {
    return err;
  }
}

// update an dog by id
export const update = async (dog: any, id: any, userId: any) => {
  const param = Object.keys(dog).map((key) => `${key} = ?`).join(', ')
  const values = Object.values(dog);
  values.push(new Date().toISOString()); // Add current time as DateModified
  values.push(id);
  values.push(userId);
  const query = `UPDATE dogs SET ${param}, DateModified = ? WHERE ID = ?`;
  try {
    await db.run_update(query, values);
    return { status: 201 };
  } catch (err: any) {
    console.log(err);
    return err;
  }
}


// delete an dog in the database
export const deleteById = async (id: any) => {
  const values = [id];
  const query = `delete from dogs where ID = ?`;
  try {
    await db.run_delete(query, values);
    return { status: 200 };
  } catch (err: any) {
    return err;
  }
}
