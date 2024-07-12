import supertest from "supertest";
import app from "../app";
import expect from "expect";

const request = supertest(app);

describe('Express App', () => {
    test('should return the list of users', async () => {
        const response = await request.get('/api/allNames');
        expect(response.statusCode).toBe(200);
        // expect(response.json).toHaveLength(5);
    });
    test('should return first user', async () => {
        const response = await request.get('/api/user/0');
        expect(response.statusCode).toBe(200);
        // expect(response.json).toEqual({
        //     id: 0,
        //     name:"Thomas Bebre",
        //     email:"test1@gmail.com",
        //     date:"2000-01-01",
        //     status:"active",
        //     role:"admin",
        //     friends:[1, 3, 4],
        //     news: ["Однажды в далекой стране жил молодой искатель приключений, который сталкивался с невероятными испытаниями и преодолевал все трудности на своем пути, вопреки всему.", "Привет! Спишь? А я лабу пишу."],
        //     photo: "https://avatars.dzeninfra.ru/get-zen_doc/1900011/pub_5e2171c59515ee00ae9ba62a_5e21ff365d6c4b00b0d9a13d/scale_1200"
        // })
    });
});