//NAMA : ARI PERDIAN
//NIM  : 20220040072
//KELAS : TI22J

const request = require('supertest');
const app = require('../index');
const connection = require('../config/connection');

describe('siswaController', () => {
    describe ('GET /siswa', () => {
        test('should get list of siswa', async () => {
            const response = await request(app).get('/siswa');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('status', true);
        });
    });

});
describe ('POST /siswa', () => {
    test('should insert new siswa', async () => {
        const response = await request(app)
            .post('/siswa')
            .query({
                nama: 'Andri',
                umur: 20,
                alamat: 'Jl. Cibolang Kaler 21',
            });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('status', true);
    });
});


describe ('Update Endpoint', () => {
    let insertId;

    beforeAll(async () => {
        const insertQuery = `INSERT INTO tbl_siswa (nama, umur, alamat) VALUES ('Samsul', 30, 'Solo')`;
        const insertResult = await new Promise((resolve) => {
            connection.query(insertQuery, (err, result) => {
                if (err) {
                    console.error('Insert Error:', err);
                }
                resolve(result);
            });
        });

        insertedId = insertResult.insertId;
    });

    afterAll(async () => {
        const deleteQuery = `DELETE FROM tbl_siswa WHERE id = ${insertedId}`;
        await new Promise((resolve) => {
            connection.query(deleteQuery, () => {
                resolve();
            });
        });
        //connection.end();
    });

    it('should update a student', async () => {
        const updatedData = {
            nama: 'Ari Perdian',
            umur: 20,
            alamat : 'Sukabumi',
        };

        const response = await request(app)
            .put(`/siswa/${insertedId}`)
            .send(updatedData);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('status', true);
        expect(response.body).toHaveProperty('msg', 'Successfull Updated');

        const selectQuery = `SELECT * FROM tbl_siswa WHERE id = ${insertedId}`;
        const selectResult = await new Promise((resolve) => {
            connection.query(selectQuery, (err, result) => {
                resolve(result);
            });
        });

        expect(selectResult.length).toBe(1);
        expect(Array.isArray(selectResult)).toBe(true);
        expect(selectResult.length).toBeGreaterThan(0);
        expect(selectResult[0].nama == updatedData.nama);
        expect(selectResult[0].umur == updatedData.umur);
        expect(selectResult[0].alamat == updatedData.alamat);
    });
});

describe('siswaController - Delete', () => {
    let insertedId;

    beforeAll(async () => {
        const insertQuery = `INSERT INTO tbl_siswa (nama, umur, alamat) VALUES ('Test', 25, 'Jl. Test')`;
        const insertResult = await new Promise((resolve) => {
            connection.query(insertQuery, (err, result) => {
                if (err) {
                    console.error('Insert Error:', err);
                }
                insertedId = result.insertId;
                resolve();
        });
    });
});

it('should delete a student', async () => {
    const response = await request(app).delete(`/siswa/${insertedId}`);

    if (response.body.status) {
        expect(response.body).toHaveProperty('status', true);
        expect(response.body).toHaveProperty('msg', 'Delete Successfull');
    } else {
        expect(response.body).toHaveProperty('status', false);
        expect(response.body).toHaveProperty('msg', 'Delete Failed');
    }

    const selectQuery = `SELECT * FROM tbl_siswa WHERE id = ${insertedId}`;
    const selectResult = await new Promise((resolve) => {
        connection.query(selectQuery, (err, result) => {
            resolve(result);
        });
    });

    expect(selectResult.length).toBe(0);
});

afterAll(() => {
    connection.end();
});
});