"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    id;
    email;
    firstName;
    lastName;
    age;
    createdAt;
    updatedAt;
    constructor(id, email, firstName, lastName, age, createdAt, updatedAt) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map