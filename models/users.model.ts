import * as db from '../helpers/database';

export const findByUserName = async (username: string) => {
  const query = 'SELECT * FROM users WHERE username = ?'
  const user = await db.run_query(query, [username]);
  return user;
}