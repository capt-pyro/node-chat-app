const {Users} = require('./users.js');
const expect = require('expect');

describe('Users', () => {
  var users;
  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Joe',
      room: 'course'
    }, {
      id: '2',
      name: 'Micheal',
      room: 'c'
    }, {
      id: '3',
      name: 'Dory',
      room: 'course'
    }]
  });
  it('should add new user', () => {
    var users = new Users();
    var name = 'Joe';
    var id = "123erfr43";
    var room = "tellmenot" ;
    var combinedUser = {
      id, name, room
    }
    var resultUser = users.addUser(id,name,room);
    expect(users.users).toEqual([combinedUser]);
    expect(resultUser).toEqual(combinedUser);
  });

  it('should remove user', () => {
    var user = users.removeUser('1');
    expect(user.name).toEqual('Joe');
    expect(users.users.length).toEqual(2);
  });

  it('should NOT remove user', () => {
    var user = users.removeUser('500');
    expect(user).toNotExist();
    expect(users.users.length).toEqual(3);
  });

  it('should return user', () => {
    var user = users.getUser('1');
    expect(user).toEqual(users.users[0]);
  });

  it('should NOT return user', () => {
    var user = users.getUser('500');
    expect(user).toNotExist();
  });

  it('should return name list of people in a room', () => {
    var  roomName = 'course';
    var nameArray = users.getUserList(roomName);
    expect(nameArray).toEqual([users.users[0].name,users.users[2].name]);
  });
});
