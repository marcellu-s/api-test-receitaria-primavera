import { Router } from "express";
import jwt from 'jsonwebtoken';

import { UserController } from "../controllers/UserController.js";
import { LoginController } from "../controllers/LoginController.js";
import { RecipeController } from "../controllers/RecipeController.js";

const router = Router();

// Controlador do usuário
const userController = new UserController();
const loginController = new LoginController();

// Controlador receita
const recipeController = new RecipeController();

// Middleware - Verificar token
function checkToken(request, response, next) {

    const authHead = request.headers['authorization'];
    const token = authHead && authHead.split(" ")[1];

    if (!token) {
        return response.status(401).json({
            status: 'error',
            msg: 'Acesso negado!'
        });
    }

    try {

        const secret = process.env.SECRET;

        jwt.verify(token, secret);

        next();

    } catch(err) {

        return response.status(400).json({
            status: 'error',
            msg: 'Falha na autenticação'
        });
    }
} 

// Rota principal
router.get('/', (request, response) => {

    return response.status(200).json({
        status: 'Sucesso'
    });
});

// Rota para criar um novo usuário
router.post('/user', userController.setUser);

// Rota para logar
router.post('/login', loginController.login);

// Private Route - Pegar usuário
router.get('/user/:id', checkToken, userController.getUser);

// Private Route - Editar usuário
router.patch('/user', checkToken, userController.editUser);

// Private Route - Criar recieta
router.post('/recipe', checkToken, recipeController.setRecipe);

// Pegar todas as receitas
router.get('/recipe/all/:id', recipeController.getAllRecipes);

// Pegar todas as receitas criadas pela usuário
router.get('/recipe/user/:id', checkToken, recipeController.getMyRecipes);

// Pegar todas as receitas favoritas
router.get('/recipe/user/favorite/:id', checkToken, recipeController.getFavRecipes);

// Private Route - Favoritar receita
router.post('/recipe/favorite', checkToken, recipeController.setFavRecipe);

export default router;
