import {Cart} from './cart.js';

/**
 * @property {string} id
 * @property {string} password
 * @property {Cart} cart
 */
class User {
    #id;
    #password;
    #cart;

    constructor(id, password) {
        if (typeof id !== 'string') {
            console.error(`Cannot create user with identifier of type ${typeof id}`);
        }
        if (typeof password !== 'string') {
            console.error(`Cannot create user with password of type ${typeof password}`);
        }

        this.#id = id;
        this.#password = password;
        this.#cart = new Cart(id);
    }

    get id() {
        return this.#id;
    }

    get password() {
        return this.#password;
    }

    get cart() {
        return this.#cart;
    }

    /** @param {string} password */
    set password(password) {
        if (typeof password !== 'string') {
            console.error(`Cannot set password to ${typeof password}`);
        }
        this.#password = password;
    }
}

// 1. /user/register`: Register new user
// 2. `/user/login`: Login existing user
// 3. `/user/id/update?password=<new_password>`: Update user's password
export {User};