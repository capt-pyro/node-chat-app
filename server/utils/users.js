class Users {
  constructor() {
    this.users = [];
  }
  addUser (id, name, room) {
    var user = {id,room,name};
    this.users.push(user);
    return user;
  }
  getUser (id) {
    return this.users.filter((user) => user.id === id)[0];//only one the first
  }
  removeUser (id) {
    var user = this.users.filter((user) => user.id === id)[0];;
    if(user) {
      this.users = this.users.filter((user) => user.id !== id);
    }
    return user;
  }

  getUserList (room) {
    var users = this.users.filter((user) => user.room === room);
    var namesArray = users.map((user) => user.name );
    return namesArray;
  }
}

var n = new Users();

module.exports = {Users};
