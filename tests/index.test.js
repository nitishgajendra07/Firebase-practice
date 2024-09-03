const { app } = require('../index.js');
const request = require('supertest');

let token;
let name = 'Nitish'
let age = '21'
let qualification = 'BE'
let email = 'nitish@gmail.com'
let password = 'nitish@123'
let profilePicture = "C:/Users/nitish.gajendra/OneDrive - InTimeTec Visionsoft Pvt. Ltd.,/Pictures/Saved Pictures/images/image1.png"


describe('CRUD operations', () => {
    beforeAll( async () => {
        const signupResponse = await request(app)
            .post('/user/signup')
            .field('name', name)
            .field('age', age)
            .field('qualification', qualification)
            .field('email', email)
            .field('password', password)
            .attach('profilePicture', profilePicture);
        expect(signupResponse.statusCode).toEqual(201);
        expect(signupResponse.body).toEqual({ "message": "registered successfully. You can now login" });


        const signinResponse = await request(app)
            .post('/user/signin')
            .field('email', email)
            .field('password', password);
        expect(signinResponse.statusCode).toEqual(200);
        expect(signinResponse.body).toEqual({
            "token": expect.any(String)
        })
        token = signinResponse.body.token;
    },10000);



    test('Should return the status code 200 and user details in body', async () => {
        const response = await request(app)
            .get('/user/profile')
            .set('Authorization', `Bearer ${token}`)
        expect(response.statusCode).toEqual(200);

        expect(response.body.name).toEqual(name);
        expect(response.body.age).toEqual(age);
        expect(response.body.email).toEqual(email);
        expect(response.body.qualification).toEqual(qualification);
        expect(response.body.password).toEqual(password)
        expect(response.body.profilePictureString).toBeDefined();
        expect(typeof response.body.profilePictureString).toBe('string');

    });

    test('Should return the status code 400 and error message in body', async () => {
        const response = await request(app)
            .get('/user/profile')
            .set('Authorization', `Bearer invalidTokenString`)
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual({
            "error": "Invalid token"
        })

    });

    test('Should return the status code 200 and update', async () => {
        const response = await request(app)
            .patch('/user/profile')
            .field('qualification', 'MBBS')
            .set('Authorization', `Bearer ${token}`)
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            "message": "Profile updated successfully"
        })
    });

    test('Should return the status code 400 and error message in body', async () => {
        const response = await request(app)
            .patch('/user/profile')
            .field('qualification', 'MBBS')
            .set('Authorization', `Bearer invalidTokenString`)
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual({
            "error": "Invalid token"
        })

    });

    test('Should return the status code 200 and delete', async () => {
        const response = await request(app)
            .delete('/user/profile')
            .set('Authorization', `Bearer ${token}`)
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({ "message": "Profile deleted successfully" });

    });

    test('Should return the status code 400 and error message in body', async () => {
        const response = await request(app)
            .delete('/user/profile')
            .set('Authorization', `Bearer invalidTokenString`)
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual({
            "error": "Invalid token"
        })

    });

});