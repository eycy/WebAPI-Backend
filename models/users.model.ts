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