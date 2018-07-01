'use strict';

class Observable{

	constructor(){
		this.subscribers = [];
	}

	/**
	 * Subscribe for changes
	 * Add a function you want to be executed whenever this model changes.
	 *
	 * @params Function fn
	 * @return null
	 */
	subscribe(fn) {
		this.subscribers.push(fn);
	}

	/**
	 * Unsubscribe from being notified when this model changes.
	 *
	 * @params Function fn
	 * @return null
	 */
	unsubscribe(fn) {
		this.subscribers = this.subscribers.filter(
			function(item){
				return item !== fn;
			}
		);
	}

	/**
	 * Notify subscribers
	 *
	 * @return null
	 */
	notifySubscribers() {
		for(let i = 0; i < this.subscribers.length; i++){
			this.subscribers[i]();
		}
	}

}

class AuthorModel{

	/**
	 * @param {id: Number, name: String}
	 * @return AuthorModel
	 */
	constructor(obj){
		this.updateProperties(obj);
	}

	/**
	 * Map properties to this instance
	 *
	 * @param {id: Number, name: String}
	 * @return void
	 */
	updateProperties(obj){
		this.id = obj.id;
		this.name = obj.name;
	}

}

class BookModel{

	/**
	 * @param {id: Number, author: String, title: String, isbn: String}
	 * @return AuthorModel
	 */
	constructor(obj){
		this.updateProperties(obj);
	}

	/**
	 * Map properties to this instance
	 *
	 * @param {id: Number, author: String, title: String, isbn: String}
	 * @return void
	 */
	updateProperties(obj){
		this.id = obj.id;
		this.author = obj.author;
		this.title = obj.title;
		this.isbn = obj.isbn;
	}

	/**
	 * Get a list of properties for this class
	 *
	 * @returns {string[]}
	 */
	static getFields(){
		return ['id', 'title', 'isbn', 'author'];
	}

}

class BookCollectionModel extends Observable{

	/**
	 * Map properties to this instance
	 *
	 * @param [BookModel]
	 * @return void
	 */
	constructor(books){
		super();
		this.books = books;
	}

	/**
	 * Loop through all registered books and return
	 * the book object that matches the id.
	 *
	 * @params Number id
	 * @return BookModel
	 */
	getBook(id){
		for(let i = 0; i < this.books.length; i++){
			if(this.books[i].id === id){
				return this.books[i];
			}
		}
	}

	/**
	 * Register a new book to this collection.
	 * Notify the subscribers.
	 *
	 * @params BookModel book
	 * @return void
	 */
	addBook(book){
		this.books.push(book);
		this.notifySubscribers();
	}

	/**
	 * Update a book object.
	 * Notify the subscribers.
	 *
	 * @params Object obj
	 * @return void
	 */
	updateBook(obj){
		const book = this.getBook(obj.id);
		book.updateProperties(obj);
		this.notifySubscribers();
	}
}
