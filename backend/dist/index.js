"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
const auth_1 = __importDefault(require("./routes/auth"));
const profile_1 = __importDefault(require("./routes/profile"));
const address_1 = __importDefault(require("./routes/address"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Database setup
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'jewel_flow',
    synchronize: true,
    logging: false,
    entities: [__dirname + '/entities/*.ts'],
    migrations: [],
    subscribers: [],
});
exports.AppDataSource.initialize()
    .then(() => {
    console.log('Data Source has been initialized!');
})
    .catch((err) => {
    console.error('Error during Data Source initialization:', err);
});
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/profile', profile_1.default);
app.use('/api/addresses', address_1.default);
// Basic route
app.get('/', (req, res) => {
    res.send('Jewel Flow Backend API');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
