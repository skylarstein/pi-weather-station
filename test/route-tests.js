'use strict';

process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../server.js');
const should   = chai.should();

chai.use(chaiHttp);

describe('GET /', () => {
  it('it should GET /', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.html;
        done();
      });
  });
});

describe('GET sensors', () => {
  it('it should GET /sensors', (done) => {
    chai.request(server)
      .get('/sensors')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('Object');

        res.body.should.contain.all.keys(['DHT22', 'BME280', 'TSL2561', 'GPS']);

        res.body.should.contain.deep.property('BME280.temperature_C');
        res.body.should.contain.deep.property('BME280.humidity');
        res.body.should.contain.deep.property('BME280.pressure_hPa');
        res.body.should.contain.deep.property('BME280.pressure_inHg');

        res.body.should.contain.deep.property('DHT22.temperature_C');
        res.body.should.contain.deep.property('DHT22.humidity');

        res.body.should.contain.deep.property('TSL2561.lux');
        res.body.should.contain.deep.property('TSL2561.timestamp');

        res.body.should.contain.deep.property('GPS.lat');
        res.body.should.contain.deep.property('GPS.lon');
        res.body.should.contain.deep.property('GPS.heading');
        res.body.should.contain.deep.property('GPS.timestamp');

        done();
      });
  });
});

describe('GET /location', () => {
  it('it should GET /location', (done) => {
    chai.request(server)
      .get('/location')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('Object');
        res.body.should.contain.all.keys(['timestamp', 'location', 'timezone']);

        res.body.should.contain.deep.property('location.lat');
        res.body.should.contain.deep.property('location.lon');
        res.body.should.contain.deep.property('location.address');

        res.body.should.contain.deep.property('timezone.dstOffset');
        res.body.should.contain.deep.property('timezone.timeZoneName');
        res.body.should.contain.deep.property('timezone.timeZoneId');

        done();
      });
  });
});
