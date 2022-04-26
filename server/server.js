import express from 'express';
import logger from 'morgan';
import expressSession from 'express-session';
import auth from './auth.js';

//ENDPOINT FUNCTIONS//
//LOGIN 

async function registerUser(name, password, id, cart) {
    response.status(200);
}

//async???
async function loginUser(name, password) {
    response.status(200);
}

async function updatePassword(user, new_password){
    response.status(200);
}


//CART

async function addItemCart(response, item, cart) {
    cart.add(item);
    response.status(200).json({ message: `${item} added to cart` });
}

async function incrementItemCart(response, item, cart) {
    cart.increment(item);
    response.status(200).json({ message: `${item} incremented` });
}

async function decrementItemCart(response, item, cart) {
    cart.decrement(item);
    response.status(200).json({ message: `${item} decremented` });
}

async function deleteItemCart(response, item, cart) {
    cart.remove(item);
    response.status(200).json({ message: `${item} deleted` });
}

async function emptyCart(response, cart) {
    cart.empty();
    response.status(200).json({ message: `Cart emptied` });
}

//CHECKOUT

async function displayItems(response) {
    response.status(200);
}

// //running the server
const app = express();
const port = process.env.PORT || 3000;

// Session configuration
const sessionConfig = {
    // set this encryption key in Heroku config (never in GitHub)!
    secret: process.env.SECRET || 'SECRET',
    resave: false,
    saveUninitialized: false,
};

app.use(expressSession(sessionConfig));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', express.static('client'));

auth.configure(app);

// //LOGIN ENDPOINTS
// /*
// 1. `/user/register`: Register new user
// 2. `/user/login`: Login existing user
// 3. `/user/id/update?password=<new_password>`: Update user's password
// */

app.get('/', function(req, res){
    res.redirect('/html/');
});

app.post('/user/register', async (request, response) => {
    response.send("Work in progress, will add data to database");
});

//ALL GETs work in the browser
app.get('/user/login', async (request, response) => {
    response.send("Work in progress");
});

app.put('/user/id/update', async (request, response) => {
    //await reload(JSONfile); Reload old stuff
    const options = request.body;
    response.send("Work in progress");
    //options.password
    //addItem(response, options.item);
    //await saveRecords(); //save stuff
});


//CART ENDPOINTS
/*
1. `/user/id/cart/add?item=<item_name>` : To add the item to the user's cart
2. `/user/id/cart/increment?item=<item_name>` : To increment the item in the user's cart
3. `/user/id/cart/decrement?item=<item_name>` : To decrement the item in the user's cart
4. `/user/id/cart/delete?item=<item_name>` : Completely removes an item from the user's cart
5. `/user/id/cart/empty` : Removes all items from the user's cart
*/

app.post('/user/id/cart/add', async (request, response) => {
    //await reload(JSONfile); Reload old stuff
    const options = request.body;
    addItemCart(response, options.item, options.cart);
    //await saveRecords(); //save stuff
});

app.put('/user/id/cart/increment', async (request, response) => {
    //await reload(JSONfile); Reload old stuff
    const options = request.body;
    incrementItemCart(response, options.item, options.cart);
    //await saveRecords(); //save stuff
});

app.put('/user/id/cart/decrement', async (request, response) => {
    //await reload(JSONfile); Reload old stuff
    const options = request.body;
    decrementItemCart(response, options.item, options.cart);
    //await saveRecords(); //save stuff
});

app.delete('/user/id/cart/delete', async (request, response) => {
    //await reload(JSONfile); Reload old stuff
    const options = request.body;
    deleteItemCart(response, options.item, options.cart);
    //await saveRecords(); //save stuff
});

app.get('/user/id/cart/empty', async (request, response) => {
    //await reload(JSONfile); Reload old stuff
    const options = request.body;
    emptyCart(response, options.cart);
    //await saveRecords(); //save stuff
});


//CHECKOUT ENDPOINTS
/*
1. `/user/id/checkout/view`: Allows user to view items and checkout
2. `/user/id/cart`: Allows user to view their cart
*/

app.get('/user/id/checkout/view', async (request, response) => {
    response.send("Work in progress");
    //await reload(JSONfile); Reload old stuff
    //const options = request.query;
    //emptyCart(response);
    //await saveRecords(); //save stuff
});

app.get('/user/id/cart', async (request, response) => {
    response.send("Work in progress");
    //await reload(JSONfile); Reload old stuff
    //const options = request.query;
    //emptyCart(response);
    //await saveRecords(); //save stuff
});


//start the port and listen commands
 app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});