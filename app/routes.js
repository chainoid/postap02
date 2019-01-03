//SPDX-License-Identifier: Apache-2.0

var parsel = require('./controller1.js');

module.exports = function(app){

  app.get('/get_parsel/:id', function(req, res){
    parsel.get_parsel(req, res);
  });
  app.get('/add_parsel/:parsel', function(req, res){
    parsel.add_parsel(req, res);
  });
  app.get('/get_all_parsels', function(req, res){
    parsel.get_all_parsels(req, res);
  });
  app.get('/delivery_parsel/:delivery', function(req, res){
    parsel.delivery_parsel(req, res);
  });
  app.get('/parsel_history/:parselId', function(req, res){
    parsel.parsel_history(req, res);
  });
  app.get('/get_sender/:name', function(req, res){
    parsel.get_sender(req, res);
  });
  app.get('/get_all_clients', function(req, res){
    parsel.get_all_clients(req, res);
  });
  app.get('/add_client/:client', function(req, res){
    parsel.add_client(req, res);
  });
  app.get('/create_parsel_order/:order', function(req, res){
    parsel.create_parsel_order(req, res);
  });
  app.get('/accept_parsel/:accept', function(req, res){
    parsel.accept_parsel(req, res);
  });
  app.get('/switch_courier/:switch', function(req, res){
    parsel.switch_courier(req, res);
  });

}
