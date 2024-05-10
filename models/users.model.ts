import * as db from '../helpers/database';

export const findByUserName = async (username: string) => {
  const query = 'SELECT * FROM users WHERE username = ?'
  const user = await db.run_query(query, [username]);
  return user;
}

// To create user. If sign up code is provided, staff is created.
export const createUser = async (userData: {
  signupcode?: string,
  firstname?: string,
  lastname?: string,
  username?: string,
  password?: string,
  email?: string
}) => {
  const { signupcode, firstname, lastname, username, password, email } = userData;

  let query = 'INSERT INTO users (firstname, lastname, username, password, email) VALUES (?, ?, ?, ?, ?)';
  let values = [firstname, lastname, username, password, email];

  if (signupcode) {
    const checkSignupCodeQuery = 'SELECT * FROM signup_code WHERE code = ? AND isUsed = false';
    const checkSignupCodeResult = await db.run_query(checkSignupCodeQuery, [signupcode]);

    if (checkSignupCodeResult.length > 0) {
      const updateSignupCodeQuery = 'UPDATE signup_code SET isUsed = true WHERE code = ?';
      await db.run_query(updateSignupCodeQuery, [signupcode]);

      query = 'INSERT INTO users (firstname, lastname, username, password, email, signupcode, isStaff) VALUES (?, ?, ?, ?, ?, ?, TRUE)';
      values.push(signupcode);
    } else {
      return { success: false, message: 'Incorrect signup code or code already used.' };
    }
  }

  try {
    await db.run_query(query, values);
    return { success: true, message: 'User created successfully' };
  } catch (error) {
    return { success: false, message: 'Error creating user' };
  }
};



export const addFavorite = async (userId: number, dogId: number) => {
  const query = 'INSERT INTO users_fav (user_id, dog_id) VALUES (?, ?)';

  try {
    await db.run_query(query, [userId, dogId]);
    return { success: true, message: 'Added to favorites successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to add to favorites' };
  }
};


export const getFavorites = async (userId: number) => {
  const query = 'SELECT * FROM users_fav WHERE user_id = ?';

  try {
    const favorites = await db.run_query(query, [userId]);
    return { success: true, favorites };
  } catch (error) {
    return { success: false, message: 'Failed to retrieve favorites' };
  }
};

