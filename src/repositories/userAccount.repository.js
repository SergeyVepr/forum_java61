import User from '../models/userAccount.model.js';

class UserAccountRepository {
    async addUser(user) {
        const userAccount = new User(user);
        return userAccount.save();
    }

    async findUser(login){
        return User.findById(login);
    }

    async removeUser(login){
        return User.findByIdAndDelete(login)
    }

    async updateUser(login, date){
        return User.findByIdAndUpdate(login,date, {returnDocument: "after"})
    }

    async addRoles(login, role){
        return User.findByIdAndUpdate(login, {$addToSet: {roles: role}}, {returnDocument: 'after'})
    }

    async removeRole(login, role){
        return User.findByIdAndUpdate(login, {$pull: {roles: role}}, {returnDocument: 'after'})
    }

    async changePassword(login, password){
        return User.findByIdAndUpdate(login, password, {returnDocument: 'after'})
    }
}

export default new UserAccountRepository();