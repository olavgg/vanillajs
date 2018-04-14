'use strict';

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
		for(let i = 0; i < Book.getFields().length; i++){

		}
		this.id = obj.id;
		this.author = obj.author;
		this.title = obj.title;
		this.isbn = obj.isbn;
	}

	static getFields(){
		return ['id', 'author', 'title', 'isbn'];
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
		this.books = obj.books;
	}

	buildDOMElements() {
		this.tableElement = document.createElement('TABLE');

		this.tableHeaderElement = this.tableElement.createTHead();

		// There is no createTBody function
		this.tableBodyElement = document.createElement('TBODY');
		this.tableElement.appendChild(this.tableBodyElement);

		this.createBookBtnElement = document.createElement('BUTTON');
		this.createBookBtnElement.textContent = "Create Book";
	}

	renderHead(){
		this.tableHeaderElement.innerHTML = `
			<tr>
				${this.fields.map(item => {
					return `<th>${item}</th>`
				}).join('')}
			</tr>
		`;
	}

	renderBody(){
		this.tableBodyElement.innerHTML = `
			${this.books.map(book => { return `
				<tr>
					<td>${book.id}</td>
					<td>${book.author.name}</td>
					<td>${book.title}</td>
					<td>${book.isbn}</td>
				</tr>
			`}).join('')}
		`;
	}

	render(){
		this.renderHead();
		this.renderBody();

		this.containerElement.innerHTML = "";
		this.containerElement.appendChild(this.tableElement);
		this.containerElement.appendChild(this.createBookBtnElement);
	}

}

function Trait (methods) {
	this.traits = [methods];
}

// https://stackoverflow.com/questions/1978770/traits-in-javascript
Trait.prototype = {

	constructor: Trait,

	uses: function (trait) {
		this.traits = this.traits.concat(trait.traits);
		return this;
	},

	useBy: function (obj) {
		for(let i = 0; i < this.traits.length; ++i) {
			let methods = this.traits[i];
			for (let prop in methods) {
				if (methods.hasOwnProperty(prop)) {
					obj[prop] = obj[prop] || methods[prop];
				}
			}
		}
	}

};

Trait.unimplemented = function (obj, traitName) {

	if (obj === undefined || traitName === undefined) {
		throw new Error ("Unimplemented trait property.");
	}
	throw new Error (traitName + " is not implemented for " + obj);

};