'use strict'
var Book = require('../models/bookModel');
var Category = require('../models/categoryModel');

module.exports = function(router){
	//Get the Index page of cart
	router.get('/', function(req, res, next){
		//Get The Cart from the session
		var cart = req.session.cart;
		var displayCart = {
			items:[],
			totalAmount: 0
		};
		var totalAmount = 0;

		//Calculate the Total Amount of all items and assign to cart totals
		for(var item in cart){
			displayCart.items.push(cart[item]);
			totalAmount += (cart[item].qty * cart[item].price);
		}
		
		displayCart.totalAmount = totalAmount;
		


		//Render Cart
		res.render('cart/index', {
			cart: displayCart
		});
	});

	//Handles the Route for the items added to cart
	router.post('/:id', function(req, res, next){
		var id = req.params.id;
		req.session.cart = req.session.cart || {};
		var cart = req.session.cart;
		Book.findOne({_id: id}, function(error, book){
			if(error){
				console.log('Cart Error', error);
			}
			/*If the id is already in the cart increase the cart item quantity*/
			if(cart[id]){
				cart[id].qty++;
			}else{
				cart[id] = {
					item: book._id,
					title: book.title,
					price: book.price,
					qty: 1
				};
			}
			res.redirect('/cart');
		});
	});

	//Removes the Certain items in the Cart
	router.get('/remove/:id', function(req, res, next){
		var id = req.params.id;
		req.session.cart = req.session.cart || {};
		var cart = req.session.cart;
		Book.findOne({_id: id}, function(error, book){
			if(error){
				console.log('Remove Item From Cart Error', error);
			}
			if(cart[id]){
				if(cart[id].qty > 1){
					cart[id].qty--;	
				}
				cart[id].qty =0;
			}

			res.redirect('/cart');
		});
	});
	//Removes all the  items in the Cart
	router.get('/remove', function(req, res, next){
		req.session.cart = {};
		res.redirect('/cart');
	});


};