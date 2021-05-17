// Usar função toogle do classList
const Modal = {
  open() {
    // open Modal -> Add the class active to the modal
    document
      .querySelector('.modal-overlay')
      .classList
      .add('active')

  },
  close() {
    // Close modal -> Remove active from modal
    document
      .querySelector('.modal-overlay')
      .classList
      .remove('active')
  }
}

//Add local storage 
const Storage = {
  // get informations
  get(){
    // get the values in localStorage and make a 'parse' to an array or get an empty array
   return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
  },

  // store datas using key and value
  set(transactions){
    //store all array transactions and turn them into strings
    localStorage.setItem("dev.finances:transactions",
    JSON.stringify(transactions))
  }
}

//mathematical calculation
const Transaction = {
  all: Storage.get(),

  //Add trasactions
  add(transaction) {
    Transaction.all.push(transaction)

    App.reload()
  },

  // remove transactions
  remove(index) {
    Transaction.all.splice(index, 1)

    App.reload()
  },

  incomes() { // Sum entries
    let income = 0;

    // get all transactions = Transactions
    // For each transaction = forEcach(transaction)=>
    Transaction.all.forEach(transaction => { //arrow function =>
      //check if the transaction is greater than 0
      if (transaction.amount > 0) {
        //it is greater than 0, insert the value in the variable,sum and return it
        income += transaction.amount
      }
    })
    return income
  },
  expenses() { // sum expenses
    let expense = 0;

    // get all transactions = Transactions
    Transaction.all.forEach(transaction => { //arrow function =>
      //check if the transaction is smaller than 0
      if (transaction.amount < 0) {
        //it is less than 0, insert the value in the variable,sum and return it
        expense += transaction.amount
      }
    })
    return expense
  },
  total() { // difference between incomes and expenses

    return Transaction.incomes() + Transaction.expenses();
  }
}

//Substitute HTML data for JS
const DOM = {
  // Property of obj DOM: This property will receive the value of the tbody element.
  transactionsContainer: document.querySelector('#data-table tbody'),

  // With this function, I will receive values and store them in a specific index
  addTransaction(transaction, index) {
    const tr = document.createElement('tr') // Create a <tr>
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index) //Receive the value of const html
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)

  },

  innerHTMLTransaction(transaction, index) { //' Interpolação = `` ' insert data in HTML
    const CSSclass = transaction.amount > 0 ? "income" : "expense" //If amount is > than 0 then do 'income' if not do 'expense'

    const amount = Utils.formatCurrency(transaction.amount)

    const html = ` 
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}"> ${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="delete Transaction">
      </td>
    `
    return html
  },

  updateBalance() {
    document
      .getElementById('incomeDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.incomes())
    document
      .getElementById('expenseDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.expenses())
    document
      .getElementById('totalDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.total())

  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ""
  }
}

// Utils to do
const Utils = {
  //Format the amount
  formatAmount(value) {
    value = Number(value.replace(/\,\./g,"")) * 100

    return value
  },

  formatDate(date) {
    const splittedDate = date.split("-") // Remove the - 

    //Define the form to show the date dd/mm/YYYY -> ex: 10/02/2021
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : ""

    value = String(value).replace(/\D/g, "") //Regular Expression or Regex, \D = Just find numbers.

    value = Number(value) / 100 //Transform the values received in decimal

    value = value.toLocaleString("pt-PT", { //Add o style of currency: EUR that is €
      style: "currency",
      currency: "EUR"
    })
    return signal + value
  }
}
//Manipulate the HTML (form)
const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  //Get the values received by HTML and return one object
  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateFields() {
    const { //Take all values inserted in getValues
      description,
      amount,
      date
    } = Form.getValues()
    //Check if values is empty
    if (description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === "") {
      throw new Error("Please, fill in all fields")
    }

  },

  formatValues() {
    let { //Take all values inserted in getValues
      description,
      amount,
      date
    } = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)


      return { 
        description,
        amount,
        date
      }
  },

  clearFields(){
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },

  submit(event) {
    event.preventDefault()

    try {
  
      Form.validateFields()

      // Check if the informations are filled
      const transaction = Form.formatValues()

      //save
      Transaction.add(transaction)

      //clear all fields
      Form.clearFields()

      //close modal
      Modal.close()

    } catch (error) {
      alert(error.message)
    }

  }
}

const App = {

  // Initialize the app
  init() {
    //Call the object DOM and execute the function addTransaction 
    // short way of writing the function below:  Transaction.all.forEach(DOM.addTransaction)
    Transaction.all.forEach(DOM.addTransaction)

    DOM.updateBalance()

    //set the values stored in the local storage
    Storage.set(Transaction.all)
  },

  //Reload the app
  reload() {
    DOM.clearTransactions()
    App.init() // Initialize the app
  },
}

App.init()