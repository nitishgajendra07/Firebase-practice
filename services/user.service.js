const fs = require('fs/promises');
const bcrypt = require('bcrypt');
const { defaultAuth, admin } = require('../config');
const { generateToken, getHashedpassword, verifyPassword } = require('../utils/utils');
const { userCollection, responseMessage, defaultProfilePicExt } = require('../constants');

async function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
  })
}

async function encodeImageToBase64(filePath) {
  try {
    const data = await fs.readFile(filePath);
    return data.toString('base64');
  } catch (error) {
    console.error(error);
    throw error;
  }
}


async function verifyRegistered(email, password) {
  const authRecord = await getUserFromAuthByEmail(email);
  const dbRecord = await getUserFromDBByEmail(email);
  if (!authRecord && dbRecord) {
    admin.firestore().collection(userCollection).doc(dbRecord.id).delete();
    return null;
  }
  else if (authRecord && !dbRecord) {
    defaultAuth.deleteUser(authRecord.uid);
    return null;
  }
  else if (!authRecord && !dbRecord) {
    return null;
  }
  else {
    return dbRecord;
  }
}


async function verifyUser(email, password) {
  const dbRecord = await verifyRegistered(email, password);
  if (!dbRecord) {
    throw new Error(responseMessage.userNotRegistered);
  }
  const isValidPassword = await verifyPassword(password, dbRecord.data().password);
  if (!isValidPassword) {
    throw new Error(responseMessage.invalidToken);
  }
  const token = generateToken(dbRecord.id, email);
  return token;
}


async function verifyUserBeforeRegister(email) {
  const authRecord = await getUserFromAuthByEmail(email);

  const dbRecord = await getUserFromDBByEmail(email);

  if (!authRecord && dbRecord) {
    admin.firestore().collection(userCollection).doc(dbRecord.id).delete();
  }
  else if (authRecord && !dbRecord) {
    defaultAuth.deleteUser(authRecord.uid);
  }
  else if (authRecord && dbRecord) {
    throw new Error(responseMessage.userAlreadyExists);
  }
  else {

  }
}


async function getUserFromAuthByEmail(email) {
  try {
    const authRecord = await defaultAuth.getUserByEmail(email);
    return authRecord;
  } catch (err) {
    return false;
  }
}


async function getUserFromDBByEmail(email) {
  try {
    const querySnapshot = await admin.firestore().collection(userCollection).where('email', '==', email).get();
    if (querySnapshot.empty) {
      return false;
    }
    const dbRecord = querySnapshot.docs[0];
    return dbRecord;
  } catch (err) {
    console.log(err);
  }
}


async function signupUser(userData) {
  try {
    let authRecord;
    try {
      authRecord = await defaultAuth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.name
      })
    } catch (err) {
      throw err;
    }
    try {
      await admin.firestore().collection(userCollection).doc(authRecord.uid).set(userData);

    } catch (err) {
      await defaultAuth.deleteUser(authRecord.uid);
      throw err;
    }

  }
  catch (err) {
    throw err;
  }
}

async function createUserData(reqBody) {
  const { name, age, qualification, email, password } = reqBody;
  let { profilePicture } = reqBody;

  if (!profilePicture) {
    profilePicture = `${email}-${defaultProfilePicExt}`;
  }

  const hashedPassword = await getHashedpassword(password);

  const userData = {
    name,
    age,
    qualification,
    email,
    password: hashedPassword,
    profilePicture
  }
  return userData;
}

module.exports = { deleteFile, encodeImageToBase64, verifyUser, verifyUserBeforeRegister, signupUser, createUserData }