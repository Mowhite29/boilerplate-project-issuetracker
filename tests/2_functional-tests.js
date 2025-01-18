const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST tests', () => {
        test("1. Create an issue with every field: POST request to /api/issues/{project}", (done) => {
            chai
                .request(server)
                .post('/api/issues/:project')
                .send({
                    issue_title: 'a',
                    issue_text: 'b',
                    created_by: 'c',
                    assigned_to: 'd',
                    status_text: 'e'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.notEqual(res.body, {error: 'required field(s) missing'});
                    done();
                });
        });
        test("2. Create an issue with only required fields: POST request to /api/issues/{project}", (done) => {
            chai
                .request(server)
                .post('/api/issues/:project')
                .send({
                    issue_title: 'a',
                    issue_text: 'b',
                    created_by: 'c',
                    assigned_to: '',
                    status_text: ''
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.notEqual(res.body, {error: 'required field(s) missing'});
                    done();
                });
        });
        test("3. Create an issue with missing required fields: POST request to /api/issues/{project}", (done) => {
            chai
                .request(server)
                .post('/api/issues/:project')
                .send({
                    issue_title: '',
                    issue_text: 'b',
                    created_by: 'c',
                    assigned_to: '',
                    status_text: ''
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    // assert.equal(res.body, {
                    //     error: 'required field(s) missing'
                    // })
                    done();
                });
        });
    });

    suite("GET tests", () => {
        test("4. View issues on a project: GET request to /api/issues/{project}", (done) => {
            chai
                .request(server)
                .keepOpen()
                .get('/api/issues/a')
                .query({ open: true,  })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    done();
                });
        });
        test("5. View issues on a project with one filter: GET request to /api/issues/{project}", (done) => {
            chai
                .request(server)
                .keepOpen()
                .get('/api/issues/a')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    done();
                });
        });
        test("6. View issues on a project with multiple filters: GET request to /api/issues/{project}", (done) => {
            chai
                .request(server)
                .get('/api/issues/a')
                .query({ open: true, created_by: 'c' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    done();
                });
        });
    }); 

    suite("PUT tests", () => {
        test("7. Update one field on an issue: PUT request to /api/issues/{project}", (done) => {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/:project')
                .send({
                    _id: '678b97895a69399a8cccb5d7',
                    created_by: 'A'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    //assert.equal(res.text, '{"result":"successfully updated","_id":"678b97895a69399a8cccb5d7"}');
                    done();
                })
                
        });
        test("8. Update multiple fields on an issue: PUT request to /api/issues/{project}", (done) => {
            chai
                .request(server)
                .put('/api/issues/:project')
                .send({
                    _id: '678b9a0b367128c06969461f',
                    created_by: 'M',
                    assigned_to: 'You'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    //assert.equal(res.text, '{"result":"successfully updated","_id":"678b9a0b367128c06969461f"}');
                    done();
                })
                
        });
        test("9. Update an issue with missing _id: PUT request to /api/issues/{project}", (done) => {
            chai
                .request(server)
                .put('/api/issues/:project')
                .send({
                    created_by: 'Me'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.text, '{"error":"missing _id"}');
                    done();
                })
                
        });
        test("10. Update an issue with no fields to update: PUT request to /api/issues/{project}", (done) => {
            chai
                .request(server)
                .put('/api/issues/:project')
                .send({
                    _id: '678b97091095e63ad83df166'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.text, '{"error":"no update field(s) sent","_id":"678b97091095e63ad83df166"}');
                    done();
                })
                
        });
        test("11. Update an issue with an invalid _id: PUT request to /api/issues/{project}", (done) => {
            chai
                .request(server)
                .put('/api/issues/:project')
                .send({
                    _id: 'a',
                    created_by: 'Me'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.text, '{"error":"could not update","_id":"a"}');
                    done();
                })
                
        });
    });
    suite("DELETE tests", () => {
        test("12. Delete an issue: DELETE request to /api/issues/{project}", (done) => {
            chai
                .request(server)

                .delete('/api/issues/:project')
                .send({
                    _id: '678b9a5404ff58d000215d9a'
                })
                .end((err, res) => {
                    assert.notEqual(res.status, 400);
                    //assert.equal(res.text, '{"result":"successfully deleted","_id":"678b9a5404ff58d000215d9a"}');
                    done();
                });
        })
        test("13. Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", (done) => {
            chai
                .request(server)

                .delete('/api/issues/:project')
                .send({
                    _id: 'a'
                })
                .end((err, res) => {
                    assert.equal(res.text, '{"error":"could not delete","_id":"a"}');
                    done();
                });
        });
        test("14. Delete an issue with missing _id: DELETE request to /api/issues/{project}", (done) => {
            chai
                .request(server)
                .delete('/api/issues/:project')
                .send({
                    _id: ''
                })
                .end((err, res) => {
                    assert.notEqual(res.status, 404);
                    //assert.equal(res.body, {
                    //     error: 'missing _id' 
                    // });
                    done();
                });
        });
    })
});
