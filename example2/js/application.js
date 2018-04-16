'use strict';

class EventSubscription{

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

class Author{

	constructor(obj){
		this.updateProperties(obj);
	}

	updateProperties(obj){
		this.id = obj.id;
		this.name = obj.name;
	}

}

class Book{

	constructor(obj){
		this.updateProperties(obj);
	}

	updateProperties(obj){
		this.id = obj.id;
		this.author = obj.author;
		this.title = obj.title;
		this.isbn = obj.isbn;
	}

	static getFields(){
		return ['id', 'title', 'isbn', 'author'];
	}

}

class BooksCollection extends EventSubscription{

	constructor(obj){
		super();
		this.books = obj.books || [];
	}

	getBook(id){
		for(let i = 0; i < this.books.length; i++){
			if(this.books[i].id === id){
				return this.books[i];
			}
		}
	}

	addBook(book){
		this.books.push(book);
		this.notifySubscribers();
	}

	deleteBook(book){
		for(let i = 0; i < this.books.length; i++){
			if(this.books[i] === book){
				this.books.splice(i, 1);
				break;
			}
		}
		this.notifySubscribers();
	}

	updateBook(obj){
		const book = this.getBook(obj.id);
		book.updateProperties(obj);
		this.notifySubscribers();
	}
}

const GreyModalElement = function() {
	const element = document.getElementById('grey-modal-background');
	return {
		show: function() {
			element.classList.remove('hidden');
		},
		hide: function() {
			element.innerHTML = "";
			element.classList.add('hidden');
		},
		appendChild: function(childElement) {
			element.appendChild(childElement);
		}
	}
}();

class BooksTable{

	constructor(obj){
		this.containerElement = obj.containerElement;
		this.fields = Book.getFields();
		this.updateProperties(obj);

		this.showCreateBookModalFn = () => {
			const createBookForm =
				new CreateBookFormForTable({}, this.booksCollection);
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
				new EditBookFormForTable(
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
		this.booksCollection = new BooksCollection(obj);
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

		this.buildAddBookBtn();
	}

	buildAddBookBtn(){
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

class CreateBookForm extends BaseFormAbstract{

	constructor(obj){
		super(obj);

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
		this.submitButtonElement.addEventListener('keypress', event => {
			if(document.activeElement === event.target && event.keyCode === 27){
				this.submitEventFn(event);
			}
		});
	}

	buildCancelButton(){
		this.cancelButtonElement = document.createElement('BUTTON');
		this.cancelButtonElement.textContent = "Cancel";

		this.cancelButtonElement.addEventListener('click', this.destroyFormFn);
		this.cancelButtonElement.addEventListener('keypress', event => {
			if(document.activeElement === event.target && event.keyCode === 27){
				this.destroyFormFn();
			}
		});
	}

	validate(){
		let isValid = true;

		const formFields =
			this.formElement.querySelectorAll('input[type="text"]');
		for(let i = 0; i < formFields.length; i++){

			if(formFields[i].value === ""){

				// Focus the first element with error
				if(isValid){
					formFields[i].focus();
				}

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

class CreateBookFormForTable extends CreateBookForm{

	constructor(obj, booksCollection){
		super(obj);
		this.booksCollection = booksCollection;
	}

	submit(){
		if(this.validate()){
			let book = new Book({
				id: this.booksCollection.books.length + 1,
				title: this.inputFieldForTitle.value,
				author: new Author({
					name: this.inputFieldForAuthor.value
				}),
				isbn: this.inputFieldForISBN.value
			});
			this.booksCollection.addBook(book);
			this.destroyFormFn();
		}
	}

}

class EditBookFormForTable extends CreateBookFormForTable{

	constructor(obj, booksCollection, book){
		super(obj, booksCollection);
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
				author: new Author({
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