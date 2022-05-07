import 'dotenv/config';
import express from 'express';
import logger from 'morgan';
import expressSession from 'express-session';
import auth from './auth.js';
import { Database } from './database.js';

class Server {
  constructor(dburl) {
    this.dburl = dburl;
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(logger('dev'));
    this.app.use('/', express.static('client'));
    const sessionConfig = {
      // set this encryption key in Heroku config (never in GitHub)!
      secret: process.env.SECRET || 'SECRET',
      resave: false,
      saveUninitialized: false,
    }
    this.app.use(expressSession(sessionConfig));
    auth.configure(this.app);
  }
  
  async initRoutes() {
    const self = this;
/*
    // Our own middleware to check if the user is authenticated
    function checkLoggedIn(req, res, next) {
      if (req.isAuthenticated()) {
        console.log("yo")
        // If we are authenticated, run the next route.
        next();
      } else {
        console.log("go")
        // Otherwise, redirect to the login page.
        res.redirect('/html/login.html');
      }
      }
    */

    //USER ENDPOINTS

    // Handle post data from the login.html form.
    this.app.post('/login',
      auth.authenticate('local', {
        // use username/password authentication
        successRedirect: '/html/checkout.html', // when we login, go to /private
        failureRedirect: '/html/login.html', // otherwise, back to login
      })
    );

      // Handle logging out (takes us back to the login page).
    this.app.get('/logout', (req, res) => {
      req.logout(); // Logs us out!
      res.redirect('/html/login.html'); // back to login
    });

    this.app.post("/register", async (req, res) =>
    {
      await self.db.registerUser(req.body.username, req.body.password);
      res.status(200).redirect("/html/checkout.html");
    })

    this.app.get('/private', (req, res) => {
        if(req.isAuthenticated())
        {
          res.status(200).json({username: req.user.username});
        }
        else
        {
          res.status(200).json({username: null});
        }
      }
    );

    //CART ENDPOINTS
    
    this.app.get('/', function(req, res){
      res.redirect('/html/');
    });
    
    //Add item to the user's cart
    this.app.post('/addItemCart', async (request, response) => {
      const options = request.body;
      await self.db.addItemCart(options.item, options.user);
      response.status(200).json({ status: 'success' });
    });

    //Increments stock of item in user's cart
    this.app.put('/incrementItemCart', async (request, response) => {
      const options = request.body;
      await self.db.incrementItemCart(options.item, options.user);
      response.status(200).json({ status: 'success' });
    });

    //Decrements stock of item in user's cart
    this.app.put('/decrementItemCart', async (request, response) => {
      const options = request.body;
      await self.db.decrementItemCart(options.item, options.user);
      response.status(200).json({ status: 'success' });
    });

    //Deletes item in user's cart
    this.app.delete('/deleteItemCart', async (request, response) => {
      const options = request.body;
      await self.db.deleteItemCart(options.item, options.user);
      response.status(200).json({ status: 'success' });
    });

    //Empties all items from user's cart
    this.app.get('/emptyCart', async (request, response) => {
      const options = request.body;
      await self.db.emptyCart(options.user);
      response.status(200).json({ status: 'success' });
    });


    //Gets user's cart
    this.app.get('/getCart', async (request, response) => {
      const options = request.body;
      const cart = await self.db.getCart(options.name);
      response.status(200).json({ status: 'success' });
      return cart;
    });

    //Gets all items from database
    this.app.get('/getAllItems', async (request, response) => {
      let items = await self.db.getAllItems();
      response.status(200).json(items);
    });
  }

  async initDb() {
    this.db = new Database(this.dburl);
    await this.db.connect();
  }

  async start() {
    await this.initRoutes();
    await this.initDb();
    const port = process.env.PORT || 8080;
    this.app.all('*', async (request, response) => {
      response.status(404).send(`Not found: ${request.path}`);
    });
    this.app.listen(port, () => {
      console.log(`Server started on http://localhost:${port}`);
    });
  }
}

const server = new Server(process.env.DB_URL);
server.start();