import * as db from '../helpers/database';

//get a single article by its id
export const getById = async (id: any) => {
  const query = "SELECT * FROM articles WHERE ID = ?"
  const values = [id]
  const data = await db.run_query(query, values);
  return data;
}
//list all the articles in the database
export const getAll = async () => {
  // TODO: use page, limit, order to give pagination
  const query = "SELECT * FROM articles;"
  const data = await db.run_query(query, null);
  return data;
}
//create a new article in the database
export const add = async (article: any) => {
  const keys = Object.keys(article);
  const values = Object.values(article);
  const key = keys.join(',');
  let param = '';
  for (let i: number = 0; i < values.length; i++) { param += '?,' }
  param = param.slice(0, -1);
  const query = `INSERT INTO articles (${key}) VALUES (${param})`;
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
  const param = Object.keys(article).map((key) => `${key} = ?`).join(', ')
  const values = Object.values(article);
  values.push(id);
  values.push(userId);
  const query = `UPDATE articles set ${param} where ID = ? and authorId = ?`;
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
  const values = [id];
  const query = `delete from articles where ID = ?`;
  try {
    await db.run_delete(query, values);
    return { status: 200 };
  } catch (err: any) {
    return err;
  }
}
