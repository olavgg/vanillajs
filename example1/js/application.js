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
			${this.books.map(book => `
				<tr>
					<td>${book.id}</td>
					<td>${book.author.name}</td>
					<td>${book.title}</td>
					<td>${book.isbn}</td>
				</tr>
			`).join('')}
		`;
	}

	render(){
		this.renderHead();
		this.renderBody();

		this.containerElement.innerHTML = "";
		this.containerElement.appendChild(this.tableElement);
	}

}