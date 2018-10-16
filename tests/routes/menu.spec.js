import chai from 'chai';
import 'chai/register-should';
import chaiHttp from 'chai-http';

import app from '../../server/index';
import { users, generateValidToken } from '../seed/seed';

chai.use(chaiHttp);

describe('POST /menu', () => {
  it('should not allow non admin users add new food to menu', (done) => {
    chai.request(app)
      .post('/api/v1/menu')
      .set('x-auth', generateValidToken(users.validUser))
      .send({
        foodName: 'Steak',
        foodImage: 'https://i.imgur.com/7itOeyG.jpg',
        price: 1200,
      })
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(403);
        done();
      });
  });

  it('should not accept an incomplete request body', (done) => {
    chai.request(app)
      .post('/api/v1/menu')
      .set('x-auth', generateValidToken(users.admin))
      .send({ foodName: 'Pizza' })
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(400);
        res.body.message.should.eql('you\'re missing some important fields');
        done();
      });
  });

  it('should not accept an improperly formatted price', (done) => {
    chai.request(app)
      .post('/api/v1/menu')
      .set('x-auth', generateValidToken(users.admin))
      .send({ foodName: 'Smoked bread', price: 'cheap' })
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(400);
        res.body.message.should.eql('food price should be a number');
        done();
      });
  });

  it('should add new food items to the menu successfully', (done) => {
    chai.request(app)
      .post('/api/v1/menu')
      .set('x-auth', generateValidToken(users.admin))
      .send({
        foodName: 'Tasty Chicken',
        foodImage: 'https://i.imgur.com/z490cis.jpg',
        price: '1200',
      })
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(201);
        res.body.should.be.an('object').which.has.all.keys(['status', 'message', 'food']);
        res.body.food.should.have.all.keys(['id', 'food_name', 'food_image', 'price']);
        res.body.food.food_name.should.eql('Tasty Chicken');
        res.body.food.price.should.eql(1200);
        done();
      });
  });

  it('should add another new food item to the menu successfully', (done) => {
    chai.request(app)
      .post('/api/v1/menu')
      .set('x-auth', generateValidToken(users.admin))
      .send({
        foodName: 'Turkey Wings',
        foodImage: 'https://i.imgur.com/Bfn1CxC.jpg',
        price: '1200',
      })
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(201);
        res.body.should.be.an('object').which.has.all.keys(['status', 'message', 'food']);
        res.body.food.should.have.all.keys(['id', 'food_name', 'food_image', 'price']);
        res.body.food.food_name.should.eql('Turkey Wings');
        res.body.food.price.should.eql(1200);
        done();
      });
  });
});

describe('GET /menu', () => {
  const { validUser } = users;

  it('should get menu successfully if user is logged in', (done) => {
    chai.request(app)
      .get('/api/v1/menu')
      .set('x-auth', generateValidToken(validUser))
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(200);
        res.body.message.should.eql('menu fetched successfully');
        res.body.menu.should.be.an('array');
        res.body.menu.length.should.eql(2);
        done();
      });
  });

  it('should still get menu if user not logged in', (done) => {
    chai.request(app)
      .get('/api/v1/menu')
      .set('x-auth', '')
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(200);
        res.body.message.should.eql('menu fetched successfully');
        res.body.menu.should.be.an('array');
        res.body.menu.length.should.eql(2);
        done();
      });
  });
});
