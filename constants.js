const responseMessage = {
    internalServerError: "internal server error",
    registrationSuccess: "registered successfully. You can now login",
    userNotRegistered: "User not registered",
    missingUpdationField: "No value for qualification is sent",
    updationSuccess: "Profile updated successfully",
    userNotFound: "User not found",
    deletionSuccess: "Profile deleted successfully",
    missingRequiredFields: "Missing required fields. (Required fields are name, age, qualification, email, password)",
    invalidAge: "Invalid age",
    invalidEmail: "Invalid email",
    invalidToken: "Invalid Token",
    missingUsernamePassword: "Missing username and or password",
    userAlreadyExists: "User already exists",
    tokenNotPassed: `Token not passed`
}

const profilePictureExtension = "profilePicture.png";

const serverListeningMessage = "server is listening on port";
const userCollection = 'users';
const defaultProfilePicExt = "default-user.png";


const authorizationHeader = "Authorization";

const bearerTokenPrefix = "Bearer ";

module.exports = { responseMessage, profilePictureExtension, serverListeningMessage, userCollection , defaultProfilePicExt, authorizationHeader, bearerTokenPrefix}
