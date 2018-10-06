'use strict';

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
	constructor(obj) {
		this.updateProperties(obj);
	}

	/**
	 * Map properties to this instance
	 *
	 * @param {id: Number, author: String, title: String, isbn: String}
	 * @return void
	 */
	updateProperties(obj) {
		this.id = obj.id;
		if (obj.author) this.author = obj.author;
		if (obj.title) this.title = obj.title;
		if (obj.isbn) this.isbn = obj.isbn;
	}

	/**
	 * Get a list of properties for this class
	 *
	 * @returns {string[]}
	 */
	static getFields() {
		return ['id', 'title', 'isbn', 'author'];
	}
}

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
	}

}