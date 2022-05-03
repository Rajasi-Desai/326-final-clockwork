import {User} from "database.js";

class users {
    constructor() {
      // we use an in-memory "database"; this isn't persistent but is easy
      // default user
      this.users = { amangalik: new User("amangalik", "Mitski")};
    }
  
    // Returns true iff the user exists.
    findUser(username) {
      if (!this.users[username]) {
        return false;
      } else {
        return true;
      }
    }
  
    // Returns true iff the password is the one we have stored (in plaintext = bad
    // but easy).
    validatePassword(name, pwd) {
      if (!this.findUser(name)) {
        return false;
      }
      if (this.users[name].password !== pwd) {
        return false;
      }
      return true;
    }
  
    // Add a user to the "database".
    addUser(name, pwd) {
      if (this.findUser(name)) {
        return false;
      }
      this.users[name] = new User(name, pwd);
      return true;
    }
  }
  
  export default new users();