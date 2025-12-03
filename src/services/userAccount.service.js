import UserAccountRepository from "../repositories/userAccount.repository.js";

class UserAccountService {
    async register(user) {
        try{
            return await UserAccountRepository.addUser(user);
        }catch (e) {
            throw new Error(`User already exists, login:  ${user.login}`);
        }
    }

    async getUser(login) {
        const user = await UserAccountRepository.findUser(login);
        if(!user) throw new Error(`User not found, login:${login}`);
        return user;
    }

    async removeUser(login) {
        const user = await UserAccountRepository.removeUser(login);
        if(!user) throw new Error(`User not found, login:${login}`);
        return user;
    }

    async updateUser(login, data) {
        const user = await UserAccountRepository.updateUser(login, data);
        if(!user) throw new Error(`User not found, login:${login}`);
        return user;
    }

    async changeRoles(login, role, isAddRole) {
        role = role.toUpperCase();
        const result = isAddRole ? await UserAccountRepository.addRoles(login, role) : await UserAccountRepository.removeRole(login, role);
        if(!result) throw new Error(`User not found, login:${login}`);
        return {login: result.login, roles: result.roles }


    }

    async changePassword(login, newPassword) {
        const user = await UserAccountRepository.changePassword(login, newPassword);
        if(!user) throw new Error(`User not found, login:${login}`);
        return user;
    }
}

export default new UserAccountService();