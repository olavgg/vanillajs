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
		this.subscribers = this.subscribers.filter( it => it !== fn );
	}

	/**
	 * Notify subscribers
	 *
	 * @return null
	 */
	notifySubscribers() {
		this.subscribers.forEach( fn => fn() );
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
		if(obj.name) this.name = obj.name;
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
		if(obj.author) this.author = obj.author;
		if(obj.title) this.title = obj.title;
		if(obj.isbn) this.isbn = obj.isbn;
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
		return this.books.find( it => it.id === id);
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

/**
 * GreyModalElement is a singleton
 */
const GreyModalElement = function() {
	const element = document.getElementById('grey-modal-background');
	return {

		/**
		 * Show the modal.
		 *
		 * @return void
		 */
		show: function() {
			element.classList.remove('hidden');
		},

		/**
		 * Hide the modal and clear its content.
		 *
		 * @return void
		 */
		hide: function() {
			element.innerHTML = "";
			element.classList.add('hidden');
		},

		/**
		 * Append child element to the modal.
		 *
		 * @return void
		 */
		appendChild: function(childElement) {
			element.appendChild(childElement);
		}
	}
}();

/**
 * Book table component. We call this a component as its behaviour is a
 * reusable component for web composition.
 *
 * With this design it is also easier to map it over to a true web-component,
 * which will hopefully soon become a standard in all the major browsers.
 */
class BookTableComponent{

	constructor(obj){
		this.containerElement = obj.containerElement;
		this.fields = BookModel.getFields();
		this.updateProperties(obj);

		this.showCreateBookModalFn = () => {
			const createBookForm =
				new CreateBookFormComponent({}, this.booksCollection);
			createBookForm.render();

			GreyModalElement.appendChild(createBookForm.formElement);
			GreyModalElement.show();
			createBookForm.inputFieldForTitle.focus();
		};

		this.showEditBookModalFn = event => {
			// This make sure that we always get the row element even if we
			// click the td element
			const rowElement = event.target.closest('tr');
			const bookId =
				Number(rowElement.querySelector('td:first-child').textContent);

			const editBookForm =
				new EditBookFormComponent(
					{},
					this.booksCollection,
					this.booksCollection.getBook(bookId)
				);
			editBookForm.render();

			GreyModalElement.show();
			GreyModalElement.appendChild(editBookForm.formElement);
			editBookForm.inputFieldForTitle.focus();
		};

		this.buildDOMElements();
		this.render();
	}

	updateProperties(obj) {
		this.booksCollection = new BookCollectionModel(obj.books);
		this.booksCollection.subscribe(()=>{
			this.render();
		});
	}

	buildDOMElements() {
		this.tableElement = document.createElement('TABLE');

		this.tableHeaderElement = this.tableElement.createTHead();

		// There is no createTBody function
		this.tableBodyElement = document.createElement('TBODY');
		this.tableElement.appendChild(this.tableBodyElement);

		this.createAddBookBtn();
	}

	createAddBookBtn(){
		// Add book button element
		this.createBookBtnElement = document.createElement('BUTTON');
		this.createBookBtnElement.textContent = "Create Book";

		this.createBookBtnElement
			.addEventListener('click', this.showCreateBookModalFn);
	}

	renderHead(){
		// map() will loop the fields property and create the <th> elements
		this.tableHeaderElement.innerHTML = `
			<tr>
				${this.fields.map(item => `<th>${item}</th>`).join('')}
			</tr>
		`;
	}

	renderBody(){
		this.tableBodyElement.innerHTML = `
			${this.booksCollection.books.map(book => `
				<tr>
					<td>${book.id}</td>
					<td>${book.title}</td>
					<td>${book.isbn}</td>
					<td>${book.author.name}</td>
				</tr>
			`).join('')}
		`;

		for(let i = 0; i < this.tableBodyElement.children.length; i++){
			const rowElement = this.tableBodyElement.children[i];
			rowElement.addEventListener('click', this.showEditBookModalFn);
		}
	}

	render(){
		this.renderHead();
		this.renderBody();

		this.containerElement.innerHTML = "";
		this.containerElement.appendChild(this.tableElement);

		// Append add book button element to the container
		this.containerElement.appendChild(this.createBookBtnElement);
	}

}

/**
 * Abstract class BaseForm
 * This class contains business logic for the form and the submit button.
 */
class BaseFormAbstract{

	constructor(obj){
		if (new.target === BaseFormAbstract) {
			throw new TypeError("Cannot construct Abstract instances directly");
		}
		this.method = obj.method || 'POST';
		this.action = obj.action || null;
		this.enctype = obj.enctype || null;

		this.buildDOMElements();
		this.updateAttributes();
	}

	buildDOMElements() {
		this.formElement = document.createElement('FORM');

		this.submitButtonElement = document.createElement('BUTTON');
		this.submitButtonElement.type = "submit";
		this.submitButtonElement.textContent = 'Submit';
	}

	updateAttributes() {
		this.formElement.method = this.method;
		this.formElement.action = this.action;
		if(this.enctype){
			this.formElement.enctype = this.enctype;
		}
	}

	submit(){
		this.formElement.submit();
	}
}

/**
 * Abstract class BookFormAbstract
 * This class contains business logic for the book form.
 */
class BookFormAbstract extends BaseFormAbstract{

	constructor(obj){
		super(obj);
		if (new.target === BookFormAbstract) {
			throw new TypeError("Cannot construct Abstract instances directly");
		}

		this.destroyFormFn = () => {
			GreyModalElement.hide();
		};

		this.submitEventFn = event => {
			event.preventDefault();
			this.submit();
		};

		this.updateFormElement();
		this.updateSubmitButtonElement();
		this.buildCancelButton();
	}

	updateFormElement() {
		this.formElement.name = "create-book";
		this.formElement.className = "modal";
	}

	updateSubmitButtonElement() {
		this.submitButtonElement.textContent = "Add book";
		this.submitButtonElement.classList.add('green');
		this.submitButtonElement.addEventListener('click', this.submitEventFn);
	}

	buildCancelButton(){
		this.cancelButtonElement = document.createElement('BUTTON');
		this.cancelButtonElement.textContent = "Cancel";
		this.cancelButtonElement.addEventListener('click', this.destroyFormFn);
	}

	validate(){
		let isValid = true;

		const formFields =
			this.formElement.querySelectorAll('input[type="text"]');
		for(let i = 0; i < formFields.length; i++){
			if(formFields[i].value === ""){
				isValid = false;
				// Add error class to input field
				if(!formFields[i].classList.contains('error')){
					formFields[i].classList.add('error');
				}
			} else {
				// If no error, remove error class if exists
				if(formFields[i].classList.contains('error')){
					formFields[i].classList.remove('error');
				}
			}
		}
		return isValid;
	}

	submit(){
		if(this.validate()){
			this.formElement.submit();
		}
	}

	render(){
		this.formElement.innerHTML = `
			<label>Title:</label>
			<input type="text" name="title" value="" tabindex="10"/>
			<label>ISBN:</label>
			<input type="text" name="isbn" value="" tabindex="20"/>
			<label>Author:</label>
			<input type="text" name="author.name" value="" tabindex="30"/>
		`;

		this.cancelButtonElement.tabIndex = 100;
		this.submitButtonElement.tabIndex = 110;

		this.formElement.appendChild(this.submitButtonElement);
		this.formElement.appendChild(this.cancelButtonElement);

		// assign input elements to this object,
		// so it is easier to reference them in code
		this.inputFieldForTitle =
			this.formElement.querySelector('input[name="title"]');
		this.inputFieldForAuthor =
			this.formElement.querySelector('input[name="author.name"]');
		this.inputFieldForISBN =
			this.formElement.querySelector('input[name="isbn"]');
	}
}

/**
 * Create book form component
 * This class contains business logic creating a book.
 */
class CreateBookFormComponent extends BookFormAbstract{

	constructor(obj, booksCollection){
		super(obj);
		this.booksCollection = booksCollection;
	}

	submit(){
		if(this.validate()){
			let book = new BookModel({
				id: this.booksCollection.books.length + 1,
				title: this.inputFieldForTitle.value,
				author: new AuthorModel({
					name: this.inputFieldForAuthor.value
				}),
				isbn: this.inputFieldForISBN.value
			});
			this.booksCollection.addBook(book);
			this.destroyFormFn();
		}
	}

}

/**
 * Create book form component
 * This class contains business logic updating a book.
 */
class EditBookFormComponent extends BookFormAbstract{

	constructor(obj, booksCollection, book){
		super(obj);
		this.booksCollection = booksCollection;
		this.book = book;

		this.submitButtonElement.textContent = "Update book";
		this.buildInputFieldForId();
	}

	buildInputFieldForId(){
		this.inputFieldForId = document.createElement('INPUT');
		this.inputFieldForId.name = "id";
		this.formElement.appendChild(this.inputFieldForId);
	}

	bindBookToForm() {
		this.inputFieldForTitle.value = this.book.title;
		this.inputFieldForAuthor.value = this.book.author.name;
		this.inputFieldForISBN.value = this.book.isbn;
		this.inputFieldForId.value = this.book.id;
	}

	submit(){
		if(this.validate()){
			const bookProperties = {
				id: Number(this.inputFieldForId.value),
				title: this.inputFieldForTitle.value,
				// I just create a new author here for the sake of simplicity
				author: new AuthorModel({
					name: this.inputFieldForAuthor.value
				}),
				isbn: this.inputFieldForISBN.value
			};
			this.booksCollection.updateBook(bookProperties);
			this.destroyFormFn();
		}
	}

	render(){
		super.render();
		this.bindBookToForm();
	}
}