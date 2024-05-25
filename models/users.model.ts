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
  email?: string,
  accesstoken?: string,
}) => {
  const { signupcode, firstname, lastname, username, password, email, accesstoken } = userData;

  let query = 'INSERT INTO users (firstname, lastname, username, password, email, accesstoken) VALUES (?, ?, ?, ?, ?, ?)';
  let values = [firstname, lastname, username, password, email, accesstoken];

  if (signupcode) {
    const checkSignupCodeQuery = 'SELECT * FROM signup_code WHERE code = ? AND isUsed = false';
    const checkSignupCodeResult = await db.run_query(checkSignupCodeQuery, [signupcode]);

    if (checkSignupCodeResult.length > 0) {
      const updateSignupCodeQuery = 'UPDATE signup_code SET isUsed = true WHERE code = ?';
      await db.run_query(updateSignupCodeQuery, [signupcode]);

      query = 'INSERT INTO users (firstname, lastname, username, password, email, signupcode, isStaff, accesstoken) VALUES (?, ?, ?, ?, ?, ?, TRUE, ?)';
      values.push(signupcode);
    } else {
      return { success: false, message: 'Incorrect signup code or code already used.' };
    }
  }

  try {
    await db.run_insert(query, values);
    return { success: true, message: 'User created successfully' };
  } catch (error) {
    return { success: false, message: 'Error creating user' };
  }
};



export const addFavorite = async (userId: number, dogId: number) => {
  const query = 'INSERT INTO users_fav (user_id, dog_id) VALUES (?, ?)';

  try {
    await db.run_insert(query, [userId, dogId]);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};


export const getFavorites = async (userId: number) => {
  const query = 'SELECT * FROM users_fav WHERE user_id = ?';

  try {
    const favorites = await db.run_query(query, [userId]);
    return { success: true, favorites };
  } catch (error) {
    return { success: false };
  }
};


export const removeFavorite = async (userId: number, dogId: number) => {
  const query = 'delete from users_fav where user_id = ? and dog_id = ?';

  try {
    await db.run_delete(query, [userId, dogId]);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const findByAccessToken = async (accessToken: string) => {
  const query = 'SELECT * FROM users WHERE accesstoken = ?';

  try {
    await db.run_query(query, [accessToken]);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}


export const updateAccessToken = async (userId: number, accessToken: string) => {
  const query = 'UPDATE users SET accesstoken = ? WHERE id = ?';

  try {
    await db.run_update(query, [accessToken, userId]);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};