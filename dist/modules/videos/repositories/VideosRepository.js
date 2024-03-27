"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRepository = void 0;
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
class VideoRepository {
	create(request, response) {
		const { title, description, user_id, user_name, thumbnail } = request.body;
		mysql_1.pool.getConnection((error, connection) => {
			 if (error) {
				  return response.status(500).json({ error: 'Internal server error' });
			 }
			 connection.query('INSERT INTO videos (video_id, user_id, user_name, title, description, thumbnail) VALUES (?,?,?,?,?,?)', [(0, uuid_1.v4)(), user_id, user_name, title, description, thumbnail], (error, result, fields) => {
				  connection.release();
				  if (error) {
						return response.status(400).json({ error: "Erro na autentificação", message: error.message });
				  }
				  return response.status(200).json({ message: 'Vídeo criado com sucesso' });
			 });
		});
  }
    getVideos(request, response) {
        const { user_id } = request.query;
        mysql_1.pool.getConnection((error, connection) => {
            connection.query('SELECT * FROM videos WHERE user_id = ?', [user_id], (error, results, filds) => {
                connection.release();
                if (error) {
                    response.status(400).json({ error: 'Erro ao buscar os vídeos!' });
                }
                return response.status(200).json({ message: 'Vídeos retornados com sucesso', videos: results });
            });
        });
    }
    getAllVideos(request, response) {
        mysql_1.pool.getConnection((error, connection) => {
            if (error) {
                response.status(400).json({ error: 'Erro ao conectar ao banco de dados!' });
                return;
            }
            connection.query('SELECT * FROM videos', (error, results, fields) => {
                connection.release();
                if (error) {
                    response.status(400).json({ error: 'Erro ao buscar os vídeos!' });
                    return;
                }
                if (results.length === 0) {
                    response.status(404).json({ error: 'Nenhum vídeo encontrado!' });
                    return;
                }
                return response.status(200).json({ message: 'Vídeos retornados com sucesso', videos: results });
            });
        });
    }
    searchVideos(request, response) {
        const { search } = request.query;
        mysql_1.pool.getConnection((error, connection) => {
            connection.query('SELECT * FROM videos WHERE title Like ?', [`%${search}%`], (error, results, filds) => {
                connection.release();
                if (error) {
                    response.status(400).json({ error: 'Erro ao buscar os vídeos!' });
                }
                else {
                    const videos = results.map((video) => ({
                        title: video.title,
                        description: video.description
                    }));
                    response.status(200).json({ message: 'Vídeos retornados com sucesso', videos });
                }
                // response.status(200).json({ message: 'Vídeos retornados com sucesso', videos: results })
            });
        });
    }
}
exports.VideoRepository = VideoRepository;
