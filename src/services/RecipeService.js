import { Recipe } from '../models/Recipe.js';
import { User } from '../models/User.js';

export class RecipeService { 

    async setRecipe(data) {

        data.ingredients = data.ingredients.split(';');
        data.methodPreparation = data.methodPreparation.split(';');
        data.categories = data.categories.split(';');

        const createdRecipe = new Recipe(data);

        try {
            await createdRecipe.save();

            return {
                code: 201,
                status: 'success',
                msg: 'Receita criada com sucesso!'
            }

        } catch(err) {

            console.log(err);

            return {
                code: 500,
                status: 'error',
                msg: 'Um erro ocorreu, mas não foi sua culpa, tente novamente mais tarde'
            }
        }
    }

    async getAllRecipes(userId) {

        try {
            
            const recipes = await Recipe.find();

            if (recipes.length > 0) {

                const allRecipes = await this.isMyFavorite(recipes, userId)

                return {
                    code: 200,
                    status: 'success',
                    msg: 'Busca realizada com sucesso',
                    recipes: allRecipes
                };
            }

            return {
                code: 204,
                status: 'success',
                msg: 'Nenhuma receita foi encontrada!',
            };

        } catch(err) {

            console.log(err);

            return {
                code: 500,
                status: 'error',
                msg: 'Um erro ocorreu, mas não foi sua culpa, tente novamente mais tarde'
            };
        }
    }

    async getMyRecipes(userId) {

        try {

            const recipes = await Recipe.find({"creatorID": userId});

            if (recipes.length > 0) {

                const allRecipes = await this.isMyFavorite(recipes, userId)

                return {
                    code: 200,
                    status: 'success',
                    msg: 'Busca realizada com sucesso',
                    recipes: recipes
                };
            }

            return {
                code: 200,
                status: 'success',
                msg: 'Nenhuma receita foi encontrada!',
            };

        } catch(err) {

            console.log(err);

            return {
                code: 500,
                status: 'error',
                msg: 'Um erro ocorreu, mas não foi sua culpa, tente novamente mais tarde'
            };
        }
    }

    async setFavRecipe(userId, recipeId) {

        try {

            const res = await this.checkRecipeExits(recipeId);

            if (res.code) {

                return {
                    code: 500,
                    status: 'error',
                    msg: 'Um erro ocorreu, mas não foi sua culpa, tente novamente mais tarde'
                };
            } else if (res === false) {

                return {
                    code: 404,
                    status: 'error',
                    msg: 'A receita requsitada não exisite!'
                };
            }

            const resUser = await this.checkRecipeFavorite(recipeId, userId);

            if (resUser === true) {

                const res = await this.deleteFavoriteRecipe(recipeId, userId)

                if (res.status === true) {

                    return {
                        code: 200,
                        status: 'success',
                        msg: res.msg
                    };
                } else {

                    return {
                        code: 500,
                        status: 'error',
                        msg: res.msg
                    };
                }

            } else if (resUser.code) {

                return {
                    code: 500,
                    status: 'error',
                    msg: 'Um erro ocorreu, mas não foi sua culpa, tente novamente mais tarde'
                };
            }

            const favRecipe = await User.updateOne(
                {"_id": userId},
                {$push: {"favorites": recipeId}}
            );

            return {
                code: 200,
                status: 'success',
                msg: 'Receita favoritada com sucesso!',
            };

        } catch(err) {

            console.log(err);

            return {
                code: 500,
                status: 'error',
                msg: 'Um erro ocorreu, mas não foi sua culpa, tente novamente mais tarde'
            };
        }
    }

    async checkRecipeExits(recipeId) {

        try {

            const res = await Recipe.findOne({
                "_id": recipeId
            });
    
            if (res) {
    
                return true;
            } else {
                
                return false;
            }

        } catch(err) {
            
            console.log(err);

            return {
                code: 500
            };
        } 
    }

    async checkRecipeFavorite(recipeId, userId) {

        try {

            const { favorites } = await User.findOne({
                "_id": userId
            });

            let exists = false

            for (let i = 0; i < favorites.length; i++) {

                if (favorites[i] == recipeId) {

                    exists = true;
                    break;
                }
            }
            
            if (exists) {
    
                return true;
            } else {
                
                return false;
            }

        } catch(err) {
            
            console.log(err);

            return {
                code: 500
            };
        } 
    }

    async getFavRecipes(userId) {

        try {

            const { favorites } = await User.findOne({
                "_id": userId
            });

            const res = [];

            for (let i = 0; i < favorites.length; i++) {

                let recipe = await Recipe.findOne({"_id": favorites[i]});

                recipe.myFavorite = true;

                res.push(recipe);
            }

            if (res.length > 0) {

                return {
                    code: 200,
                    status: 'success',
                    msg: 'Busca realizada com sucesso',
                    recipes: res
                };
            } 

            return {
                code: 200,
                status: 'success',
                msg: 'Nenhuma receita foi encontrada!',
            };

        } catch(err) {

            console.log(err);

            return {
                code: 500,
                status: 'error',
                msg: 'Um erro ocorreu, mas não foi sua culpa, tente novamente mais tarde'
            };
        }
    }

    async isMyFavorite(recipes, userId) {

        const { favorites } = await User.findById(userId);

        const recipesEdit = recipes.map((recipe) => {

            recipe.myFavorite = favorites.includes(recipe._id)

            return recipe
        });

        return recipesEdit;
    }

    async deleteFavoriteRecipe(recipeId, userId) {

        try {

            await User.findOneAndUpdate(
                { _id: userId }, { $pull: { favorites: recipeId } }
            );

            return {
                status: true,
                msg: "Receita desfavoritada com sucesso!"
            }

        } catch(err) {

            return {
                status: false,
                msg: "Erro ao desfavoritar a receita, tente novamente!"
            }
        }
    }
}
