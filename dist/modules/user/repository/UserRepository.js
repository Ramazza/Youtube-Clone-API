"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
class UserRepository {
    create(request, response) {
        const { name, email, password } = request.body;
        mysql_1.pool.getConnection((error, connection) => {
            if (error) {
                console.log('ERROR!', error);
                return response.status(500).json({ error: 'Internal Server Error' });
            }
            (0, bcrypt_1.hash)(password, 10, (err, hashedPassword) => {
                if (err) {
                    console.log('Hashing Error:', err);
                    connection.release();
                    return response.status(500).json({ error: 'Internal Server Error' });
                }
                connection.query('INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)', [(0, uuid_1.v4)(), name, email, hashedPassword], (queryError, result, fields) => {
                    connection.release();
                    if (queryError) {
                        console.log('Query Error:', queryError);
                        return response.status(400).json({ error: 'Error creating user' });
                    }
                    return response.status(200).json({ message: 'User created successfully' });
                });
            });
        });
    }
    login(request, response) {
        const { email, password } = request.body;
        mysql_1.pool.getConnection((error, connection) => {
            connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results, filds) => {
                connection.release();
                if (error) {
                    response.status(400).json({ error: 'Erro na autentificação' });
                }
                (0, bcrypt_1.compare)(password, results[0].password, (err, result) => {
                    if (error) {
                        response.status(400).json({ error: 'Erro na autentificação' });
                    }
                    if (result) {
                        const token = (0, jsonwebtoken_1.sign)({
                            id: results[0].user_id,
                            email: results[0].email,
                        }, process.env.SECRET, { expiresIn: '1d' });
                        return response
                            .status(200)
                            .json({ token: token, message: 'Autenticado com sucesso' });
                    }
                });
            });
        });
    }
    getUser(request, response) {
        const decode = (0, jsonwebtoken_1.verify)(request.headers.authorization, process.env.SECRET);
        if (decode.email) {
            mysql_1.pool.getConnection((error, conn) => {
                conn.query('SELECT * FROM users WHERE email=?', [decode.email], (error, resultado, fields) => {
                    conn.release();
                    if (error) {
                        return response.status(400).send({
                            error: error,
                            response: null
                        });
                    }
                    return response.status(201).send({
                        user: {
                            nome: resultado[0].name,
                            email: resultado[0].email,
                            id: resultado[0].user_id,
                        }
                    });
                });
            });
        }
    }
}
exports.UserRepository = UserRepository;
