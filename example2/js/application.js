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

class BooksTable{

	constructor(obj){
		this.containerElement = obj.containerElement;
		this.fields = Book.getFields();
		this.updateProperties(obj);
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

		const showCreateBookModalFn = () => {
			const modalContainerEle =
				document.getElementById('grey-modal-background');
			modalContainerEle.classList.remove('hidden');

			const createBookForm =
				new CreateBookFormForTable({}, this.booksCollection);
			createBookForm.render();
			modalContainerEle.appendChild(createBookForm.formElement);
		};

		this.createBookBtnElement
			.addEventListener('click', showCreateBookModalFn);
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
			const modalContainerEle =
				document.getElementById("grey-modal-background");
			modalContainerEle.innerHTML = "";
			modalContainerEle.classList.add('hidden');
		};

		this.submitEventFn = e => {
			e.preventDefault();
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
		this.submitButtonElement.addEventListener('keypress', e => {
			if(document.activeElement === e.target){
				this.submitEventFn(e);
			}
		});
	}

	buildCancelButton(){
		this.cancelButtonElement = document.createElement('BUTTON');
		this.cancelButtonElement.textContent = "Cancel";

		this.cancelButtonElement.addEventListener('click', this.destroyFormFn);
		this.cancelButtonElement.addEventListener('keypress', e => {
			if(document.activeElement === e.target){
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
				isValid = false;
				if(!formFields[i].classList.contains('error')){
					formFields[i].classList.add('error');
				}
			} else {
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
			<input type="text" name="title" value=""/>
			<label>ISBN:</label>
			<input type="text" name="isbn" value=""/>
			<label>Author:</label>
			<input type="text" name="author.name" value=""/>
		`;

		this.formElement.appendChild(this.submitButtonElement);
		this.formElement.appendChild(this.cancelButtonElement);
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
				title: this.formElement.querySelector('input[name="title"]').value,
				author: new Author({
					name: this.formElement.querySelector('input[name="author.name"]').value
				}),
				isbn: this.formElement.querySelector('input[name="isbn"]').value
			});
			this.booksCollection.addBook(book);
			this.destroyFormFn();
		}
	}

}