"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
	return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const mysql_1 = __importDefault(require("mysql"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
console.log('SECRET:', process.env.SECRET);
console.log('USER_DATABASE:', process.env.USER_DATABASE);
console.log('PASSWORD_DATABASE:', process.env.PASSWORD_DATABASE);
console.log('DATABASE:', process.env.DATABASE);
console.log('HOST_DATABASE:', process.env.HOST_DATABASE);
console.log('PORT_DATABASE:', process.env.PORT_DATABASE);
const pool = mysql_1.default.createPool({
	"user": process.env.USER_DATABASE,
	"password": process.env.PASSWORD_DATABASE,
	"database": process.env.DATABASE,
	"host": process.env.HOST_DATABASE,
	"port": Number(process.env.PORT_DATABASE)
});
exports.pool = pool;
