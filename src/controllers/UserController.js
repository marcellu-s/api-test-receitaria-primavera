import { UserService } from "../services/UserService.js";

const userService = new UserService();

export class UserController {

    async setUser(request, response) {

        // Recepe o corpo da requisição, contendo os dados necessários
        const { name, lastName, email, password } = request.body;

        if (!name || !lastName || !email || !password) {

            // Retorna erro
            return response.status(422).json({
                status: 'error',
                msg: "Nome, Sobrenome, E-mail e senha são obrigatórios!"
            });
        }

        const res = await userService.setUser(name, lastName, email, password);

        if (res.code == 201 || res.code == 200) {

            return response.status(res.code).json({
                status: res.status,
                msg: res.msg
            });

        } else {
            return response.status(res.code).json({
                status: res.status,
                msg: res.msg
            });
        }

    }

    // Rota privada - Apenas com token
    async getUser(request, response) {

        // Recebe o id pela URL
        const id = request.params.id;

        if (!id) {

            // Retorna erro
            return response.status(404).json({
                status: 'error',
                msg: "Não foi encontrado o parâmetro em sua requisição"
            });
        }

        const res = await userService.getUser(id);

        if (res.code == 200) {
            return response.status(res.code).json(res);
        }

        return response.status(res.code).json({
            status: res.status,
            msg: res.msg
        });
    }

    // Rota privada
    async editUser(request, response) {

        const { userId, name, lastName, email, oldPassword, newPassword } = request.body;

        if (!userId || !name || !lastName || !email) {

            // Retorna erro
            return response.status(422).json({
                status: 'error',
                msg: "Dados ausentes, verifique e tente novamente!"
            });
        }

        const payload = {
            userId,
            name,
            lastName,
            email,
            oldPassword: oldPassword ? oldPassword : false,
            newPassword: newPassword ? newPassword : false
        }

        const result = await userService.editUser(payload);

        return response.status(result.code).json(result);
    }
}