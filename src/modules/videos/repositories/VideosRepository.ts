import { pool } from '../../../mysql';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Request, Response} from 'express'

class VideoRepository {
	create(request: Request, response: Response) {
		const { title, description, user_id, thumbnail} = request.body;
		pool.getConnection((error: any, connection: any) => {
			connection.query(
				'INSERT INTO videos (video_id, user_id, title, description, thumbnail) VALUES (?,?,?,?,?)',
				[uuidv4(), user_id, title, description, thumbnail],
				(error: any, result: any, filds: any) => {
					connection.release();
					if (error) {
						return response.status(400).json({ error: "Erro na autentificação", message: error.message })
					}
					return response.status(200).json({ message: 'Vídeo criado com sucesso' })
				}
			)
		})
	}

	getVideos(request: Request, response: Response) {
		const { user_id } = request.query;
		pool.getConnection((error: any, connection: any) => {
			connection.query(
				'SELECT * FROM videos WHERE user_id = ?',
				[user_id],
				(error: any, results: any, filds: any) => {
					connection.release();
					if (error) {
						response.status(400).json({ error: 'Erro ao buscar os vídeos!' })
					}
					return response.status(200).json({ message: 'Vídeos retornados com sucesso', videos: results })
				}
			)
		})
	}

	searchVideos(request: Request, response: Response) {
		const { search } = request.query;
		pool.getConnection((error: any, connection: any) => {
			connection.query(
				'SELECT * FROM videos WHERE title Like ?',
				[`%${search}%`],
				(error: any, results: any, filds: any) => {
					connection.release();
					if (error) {
						response.status(400).json({ error: 'Erro ao buscar os vídeos!' })
					} else {
						const videos = results.map((video: any) => ({
							title: video.title,
							description: video.description
						}));
						response.status(200).json({ message: 'Vídeos retornados com sucesso', videos });
					}
					// response.status(200).json({ message: 'Vídeos retornados com sucesso', videos: results })
				}
			)
		})
	}

}

export { VideoRepository };