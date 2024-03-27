"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRoutes = void 0;
const express_1 = require("express");
const VideosRepository_1 = require("../modules/videos/repositories/VideosRepository");
const videosRoutes = (0, express_1.Router)();
exports.videosRoutes = videosRoutes;
const videoRepository = new VideosRepository_1.VideoRepository();
videosRoutes.post('/create-video', (request, response) => {
    videoRepository.create(request, response);
});
videosRoutes.get('/get-videos', (request, response) => {
    videoRepository.getVideos(request, response);
});
videosRoutes.get('/get-all-videos', (request, response) => {
    videoRepository.getAllVideos(request, response);
});
videosRoutes.get('/search', (request, response) => {
    videoRepository.searchVideos(request, response);
});
