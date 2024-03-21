import { pool } from '../../../mysql';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Request, Response } from 'express';

class UserRepository {

	// create(request: Request, response: Response) {
	// 	const { name, email, password } = request.body;
	// 	pool.getConnection((error: any, connection: any) => {
	// 		hash(password, 10, (err, hash) => {
	// 			if (err) {
	// 				return response.status(500).json(err);
	// 			}

	// 			connection.query(
	// 				'INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)',
	// 				[uuidv4(), name, email, hash],
	// 				(error: any, result: any, filds: any) => {
	// 					connection.release();
	// 					if (error) {
	// 						response.status(400).json({ error: 'Erro na autentificação' });
	// 					}
	// 					response
	// 						.status(200)
	// 						.json({ message: 'Usuário criado com sucesso' });
	// 				}
	// 			);
	// 		});
	// 	});
	// }

	// create(request: Request, response: Response) {
	// 	const { name, email, password } = request.body;
	// 	pool.getConnection((error: any, connection: any) => {

	// 		if (error) {
	// 			return console.log('ERROR!', error);
	// 		}

	// 		if (!connection) {
	// 			return console.log('No connection was found.');
	// 		}


	// 		hash(password, 10, (err, hash) => {
	// 			if (err) {
	// 				return response.status(500).json(err);
	// 			}

	// 			connection.query(
	// 				'INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)',
	// 				[uuidv4(), name, email, hash],
	// 				(error: any, result: any, filds: any) => {
	// 					connection.release();
	// 					if (error) {
	// 						response.status(400).json({ error: 'Erro na autentificação' });
	// 					}
	// 					response
	// 						.status(200)
	// 						.json({ message: 'Usuário criado com sucesso' });
	// 				}
	// 			);
	// 		});
	// 	});
	// }

	create(request: Request, response: Response) {
		const { name, email, password } = request.body;
		pool.getConnection((error: any, connection: any) => {
			if (error) {
				console.log('ERROR!', error);
				return response.status(500).json({ error: 'Internal Server Error' });
			}

			hash(password, 10, (err, hashedPassword) => {
				if (err) {
						console.log('Hashing Error:', err);
						connection.release();
						return response.status(500).json({ error: 'Internal Server Error' });
				}

				connection.query(
						'INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)',
						[uuidv4(), name, email, hashedPassword],
						(queryError: any, result: any, fields: any) => {
							connection.release();
							if (queryError) {
								console.log('Query Error:', queryError);
								return response.status(400).json({ error: 'Error creating user' });
							}

							return response.status(200).json({ message: 'User created successfully' });
						}
				);
			});
		});
	}


	login(request: Request, response: Response) {
		const { email, password } = request.body;
		pool.getConnection((error: any, connection: any) => {
			connection.query(
				'SELECT * FROM users WHERE email = ?',
				[email],
				(error: any, results: any, filds: any) => {
					connection.release();
					if (error) {
						response.status(400).json({ error: 'Erro na autentificação' });
					}

					compare(password, results[0].password, (err, result) => {
						if (error) {
							response.status(400).json({ error: 'Erro na autentificação' });
						}

						if (result) {
							const token = sign(
								{
									id: results[0].user_id,
									email: results[0].email,
								},
								process.env.SECRET as string,
								{ expiresIn: '1d' }
							);

							return response
								.status(200)
								.json({ token: token, message: 'Autenticado com sucesso' });
						}
					});
				}
			);
		});
	}

	getUser(request: any, response: any) {
		const decode: any = verify(request.headers.authorization, process.env.SECRET as string);
		if (decode.email) {
			pool.getConnection((error, conn) => {
				conn.query(
					'SELECT * FROM users WHERE email=?',
					[decode.email],
					(error, resultado, fields) => {
						conn.release();
						if (error) {
							return response.status(400).send({
								error: error,
								response: null
							})
						}

						return response.status(201).send({
							user: {
								nome: resultado[0].name,
								email: resultado[0].email,
								id: resultado[0].user_id,
							}
						})
					}
				)
			})
		}
	}
}



export { UserRepository };