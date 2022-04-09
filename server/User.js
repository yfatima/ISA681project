const users = [];

const data = ["Y", "U", "R", "D", "K", "S"];

const addUser = ({id, name, game, words}) => {
    name = name.trim().toLowerCase();
    game = game.trim().toLowerCase();
 
    const existingUser = users.find((user) => {
        user.game === game && user.name === name
    });
 
    if(existingUser) {
        return{error: "Username is taken"};
    }
    words = [];
    const user = {id,name,game, words};
 
    users.push(user);
    return {user};
}

const addWord = (id, word) => {
    const index = users.findIndex((user) => {
        user.id === id
    });
    users[index].words.push(word);
    //check if word already exists in the words list of other user
    return 1;
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        user.id === id
    });
 
    if(index !== -1) {
        return users.splice(index,1)[0];
    }
}

const getUser = (id) => users
        .find((user) => user.id === id);

const getWords = (id) => {
    const index = users.findIndex((user) => {
        user.id === id
    });
    return users[index].words;
}

const getData = () => {
    return data;
}
 
const getUsersInGame = (game) => users
        .filter((user) => user.game === game);
 
module.exports = {addUser, removeUser,
        getUser, getUsersInGame, addWord, getWords, getData};