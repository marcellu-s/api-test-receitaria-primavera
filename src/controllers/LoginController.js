import { UserService } from "../services/UserService.js";

const userService = new UserService();

export class LoginController {

    async login(request, response) {

        // Recepe o corpo da requisição, contendo os dados necessários
        const { email, password } = request.body;

        if (!email || !password) {

            // Retorna erro
            return response.status(422).json({
                status: 'error',
                msg: "E-mail e senha são obrigatórios!"
            });
        }

        const res = await userService.getToken(email, password);

        if (res.code == 200) {

            return response.status(res.code).json({
                status: res.status,
                msg: res.msg,
                token: res.token,
                name: res.name,
                lastName: res.lastName,
                email: res.email,
                id: res.id
            });
        } else {

            return response.status(res.code).json({
                status: res.status,
                msg: res.msg
            });
        }

    }
}
