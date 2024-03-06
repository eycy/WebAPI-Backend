import * as db from '../helpers/database';

//get a single article by its id
export const getById = async (id: any) => {
  let query = "SELECT * FROM articles WHERE ID = ?"
  let values = [id]
  let data = await db.run_query(query, values);
  return data;
}
//list all the articles in the database
export const getAll = async () => {
  // TODO: use page, limit, order to give pagination
  let query = "SELECT * FROM articles;"
  let data = await db.run_query(query, null);
  return data;
}
//create a new article in the database
export const add = async (article: any) => {
  let keys = Object.keys(article);
  let values = Object.values(article);
  let key = keys.join(',');
  let param = '';
  for (let i: number = 0; i < values.length; i++) { param += '?,' }
  param = param.slice(0, -1);
  let query = `INSERT INTO articles (${key}) VALUES (${param})`;
  try {
    await db.run_insert(query, values);
    return { status: 201 };
  } catch (err: any) {
    return err;
  }
}

// update an article in the database
// export const update = async (article: any, id: any) => {
//   let param = Object.keys(article).map((key) => `${key} = ?`).join(', ')
//   let values = Object.values(article);
//   values.push(id);
//   let query = `UPDATE articles set ${param} where ID = ?`;
//   try {
//     await db.run_update(query, values);
//     return { status: 201 };
//   } catch (err: any) {
//     console.log(err);
//     return err;
//   }
// }
export const update = async (article: any, id: any, userId: any) => {
  let param = Object.keys(article).map((key) => `${key} = ?`).join(', ')
  let values = Object.values(article);
  values.push(id);
  values.push(userId);
  let query = `UPDATE articles set ${param} where ID = ? and authorId = ?`;
  try {
    await db.run_update(query, values);
    return { status: 201 };
  } catch (err: any) {
    console.log(err);
    return err;
  }
}


// delete an article in the database
// delete from articles where id = 7
export const deleteById = async (id: any) => {
  let values = [id];
  let query = `delete from articles where ID = ?`;
  try {
    await db.run_delete(query, values);
    return { status: 200 };
  } catch (err: any) {
    return err;
  }
}
