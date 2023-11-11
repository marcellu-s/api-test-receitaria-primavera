import { RecipeService } from "../services/RecipeService.js";

const recipeService = new RecipeService();

export class RecipeController {

    // Criar receita
    async setRecipe(request, response) {

        const {
            title,
            about,
            author,
            image,
            duration,
            difficult,
            portion,
            additionalInformation,
            ingredients,
            methodPreparation,
            categories,
            creatorID
        } = request.body;

        if (!title || !about || !author || !image || !duration || !difficult || !portion || !additionalInformation || !ingredients || !methodPreparation || !categories || !creatorID) {

            // Retorna erro
            return response.status(404).json({
                code: 404,
                status: 'error',
                msg: "Dados estão faltando, verifique e tente novamente!"
            });
        }

        const data = {
            title,
            about,
            author,
            image,
            duration,
            difficult,
            portion,
            additionalInformation,
            ingredients,
            methodPreparation,
            categories,
            creatorID,
            myFavorite: false
        }

        const res = await recipeService.setRecipe(data);

        return response.status(res.code).json(res);
    }

    // Pegar todas as receitas
    async getAllRecipes(request, response) {

        // Recebe o id pela URL
        const userId = request.params.id;

        if (!userId) {

            return response.status(404).json({
                status: 'error',
                msg: 'Dados estão faltando, verifique e tente novamente!'
            });
        }

        const res = await recipeService.getAllRecipes(userId)

        return response.status(res.code).json(res);
    }

    // Pegar receitas criadas por tal usuário
    async getMyRecipes(request, response) {

        const userId = request.params.id

        if (!userId) {

            // Retorna erro caso não venha o id do usuário
            return response.status(404).json({
                code: 404,
                status: 'error',
                msg: "Dados estão faltando, verifique e tente novamente!"
            });
        }

        const res = await recipeService.getMyRecipes(userId);

        return response.status(res.code).json(res);
    }

    async getFavRecipes(request, response) {

        const userId = request.params.id;

        if (!userId) {

            // Retorna erro caso não venha o id do usuário
            return response.status(404).json({
                code: 404,
                status: 'error',
                msg: "Dados estão faltando, verifique e tente novamente!"
            });
        }

        const res = await recipeService.getFavRecipes(userId);

        return response.status(res.code).json(res);
    }

    async setFavRecipe(request, response) {

        const { userId, recipeId } = request.body;

        if (!userId || !recipeId) {

            // Retorna erro
            return response.status(404).json({
                code: 404,
                status: 'error',
                msg: "Dados estão faltando, verifique e tente novamente!"
            });
        }

        const res = await recipeService.setFavRecipe(userId, recipeId);

        return response.status(res.code).json(res);
    }
}
