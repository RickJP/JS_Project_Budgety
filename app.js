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
  };

  return {
    addItem: function(typ, des, val) {

      var newItem,ID;

      // Create new ID
      if (data.allItems[typ].length > 0) {
        ID = data.allItems[typ][data.allItems[typ].length - 1].id + 1;
      } else {
        ID = 0;
      }
      

      // Create new item based on type
      if (typ === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (typ === 'inc') {
        newItem = new Income(ID, des, val)
      }

      // Push it into data structure
      data.allItems[typ].push(newItem);

      // return element
      return newItem;
    },
    testing: function() {
      console.log(data);
    }
  };

})();


// UI CONTROLLER
var UIController = (function() {
	var DOMstr = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
	};

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMstr.inputType).value, // Either inc or exp
				description: document.querySelector(DOMstr.inputDescription).value,
				value: document.querySelector(DOMstr.inputValue).value
			};
		},

    addListItem: function(obj, type ) {
      var html, newHtml, element;
      // Create HTML string with placeholder text

      if (type === 'inc') {
        element = DOMstr.incomeContainer;

        // Construct the HTML for income object
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if (type === 'exp') {
        element = DOMstr.expensesContainer;

        // Construct the HTML for expenses object
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        console.error('ERROR at addListItem! Neither inc or exp selected');
      }
    
      // Replace the placeholder text with some data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Insert HTML into the DOM as the last child in the list
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

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
    var input, newItem;

		// Get input data
		input = UIController.getInput();
		
		// Add item to budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		// Add item to UI
    UICtrl.addListItem(newItem, input.type);

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