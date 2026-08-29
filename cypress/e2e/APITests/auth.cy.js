/// <reference types="cypress" />

describe('auth api testing', () => {

    it(' 1 - POST credentials to auth endpoint with sucess - 1º version', () => {

        cy.request({
            method: 'POST',
            url:'/auth',
            body:{
                "username": "admin",
                "password": "password123"
            },
            headers: { 'Content-Type': 'application/json'},
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token').and.to.be.a('string');
            expect(response.body).not.to.be.empty;
        });
    });


    it(' 2 - POST credentials to auth endpoint with sucess - 2º version', () => {

        let body = {
            "username": "admin",
            "password": "password123"
        };
        

        cy.postRequest(Cypress.env('auth_url'), {"Content-type": "application/json"},  body )
        .then((response) => {
            debugger
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token').and.to.be.a('string');
            expect(response.body).not.to.be.empty;
        });
    });

    it.only(' 3 - POST credentials to auth endpoint with invalid credentials', () => {

        let body = {
            "username": null,
            "password": "password123"
        };

        cy.postRequest("/auth", {"Content-type": "application/json"},  body ).then((response) => {
            expect(response.status).to.eq(200);
            //expect(response.body).to.have.property('token').and.to.be.a('string');
            expect(response.body).to.have.property('reason', 'Bad credentials');
            expect(response.body).not.to.be.empty;
        });
    });
});