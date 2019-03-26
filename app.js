// BUDGET CONTROLLER
var budgetController = (function() {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }   
  }

})();


// UI CONTROLLER
var UIController = (function() {
	var DOMstr = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn'
	};

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMstr.inputType).value, // Either inc or exp
				description: document.querySelector(DOMstr.inputDescription).value,
				value: document.querySelector(DOMstr.inputValue).value
			};
		},
		getDOMstrings: function() {
			return DOMstr;
		}
	};
})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

	var setupEventListeners = function() {
		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keydown', function(e) {
			if (e.keyCode === 13 || e.which === 13) {
				// 13 = 'enter key'   which used to support older browsers
				ctrlAddItem();
			}
		});
	};

	var DOM = UICtrl.getDOMstrings();

	var ctrlAddItem = function() {
		// Get input data
		var input = UIController.getInput();
		

		// Add item to budget controller
		// Add item to UI
		// Calculate budget
		// Display budget on UI
	};


  return {
    init: function() {
      console.log('Application has started.');
      setupEventListeners();
    }
  }


})(budgetController, UIController);


controller.init();