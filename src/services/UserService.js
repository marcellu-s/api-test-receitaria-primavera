import bcryptjs from 'bcryptjs'

import jwt from 'jsonwebtoken';

import { User } from "../models/User.js";

export class UserService {

    // Verifica se já existe um usuário com o mesmo e-mail
    async userExists(email, password) {

        try {

            const res = await User.findOne({
                email: email,
            });
    
            if (res) {

                if (password) {

                    if (await bcryptjs.compare(password, res.password)) {

                        return res;
                    }
                    
                    return false;
                }
                
                // Caso exista alguém com o mesmo email
                return true;

            } else {
                
                return false;
            }

        } catch(err) {
            
            console.log(err);

            return false;
        }   
    }

    async getUserByID(id) {

        try {

            const user = await User.findById(id, '-password');

            if (!user) {

                return {
                    code: 404,
                    status: 'error',
                    msg: 'Usuário não encontrado'
                };
            }   
    
            return {
                code: 200,
                status: 'success',
                msg: 'Busca realizada com sucesso',
                user: user
            };;

        } catch(err) {
            
            console.log(err);

            return {
                code: 500,
                status: 'error',
                msg: 'Um erro ocorreu, mas não foi sua culpa, tente novamente mais tarde'
            };
        }   
    }

    // Cria um usuário no banco de dados
    async setUser(name, lastName, email, password) {

        // Verifica se já existe um usuário com o mesmo e-mail
        const res = await this.userExists(email);

        if (res === true) {

            return {
                code: 422,
                status: 'error',
                msg: 'Já existe um usuário usando este e-mail'
            }
        }

        // Criptografia da senha do usuário, antes de salvar no banco de dados
        const salt = await bcryptjs.genSalt(12);
        const passwordhashSync = await bcryptjs.hash(password, salt);

        // Preparando os dados do usuário
        const userData = {
            name,
            lastName, 
            email, 
            password: passwordhashSync,
            favorites: []
        };

        // Salvando no banco de dados
        const createdUser = new User(userData);

        try {

            await createdUser.save();

            return {
                code: 201,
                status: 'success',
                msg: 'Usuário criado com sucesso!'
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

    async getUser(id) {

        // Verifica se o usuário existe
        const res = await this.getUserByID(id);

        return res;

    }

    // Pegar o token de autenticação para o usuário
    async getToken(email, password) {
        
        // Verifica se o usuário existe
        const user = await this.userExists(email, password);

        if (user === false) {

            return {
                code: 404,
                status: 'error',
                msg: 'E-mail ou senha incorretos'
            }
        }

        // Processo para gerar o Token
        try {

            const secret = process.env.SECRET;

            const token = jwt.sign(
                {
                    name: user.name,
                    email: user.email
                },
                secret
            );

            return {
                code: 200,
                status: 'success',
                msg: 'Login efetuado com sucesso!',
                token: token,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                id: user._id
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

    async editUser(payload) {

        try {

            const user = await User.findById(payload.userId);

            if (user) {

                if (payload.newPassword && payload.oldPassword) {

                    if (await bcryptjs.compare(payload.oldPassword, user.password)) {

                        // Criptografia da senha do usuário, antes de salvar no banco de dados
                        const salt = await bcryptjs.genSalt(12);
                        const passwordhashSync = await bcryptjs.hash(payload.newPassword, salt);

                        await User.findByIdAndUpdate(payload.userId, {
                            name: payload.name,
                            lastName: payload.lastName,
                            email: payload.email,
                            password: passwordhashSync
                        })

                        return {
                            code: 200,
                            msg: "Usuário editado com sucesso!"
                        }

                    } else {

                        return {
                            code: 422,
                            msg: "A senha antiga não condiz com a armazenada! Verifique e tente novamente."
                        }
                    }

                } else {

                    await User.findByIdAndUpdate(payload.userId, {
                        name: payload.name,
                        lastName: payload.lastName,
                        email: payload.email
                    });

                    return {
                        code: 200,
                        msg: "Usuário editado com sucesso!"
                    }
                }

            } else {

                return {
                    code: 404,
                    msg: "Erro ao tentar encontrar o usuário, tente fazer Log In novamente!"
                }
            }

        } catch(err) {

            return {
                code: 500,
                msg: "Erro ao tentar editar o usuário, tente novamente em instantes."
            }
        }
    }
};
