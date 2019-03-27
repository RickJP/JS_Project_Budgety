// BUDGET CONTROLLER
var budgetController = (function() {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    
    if (totalIncome > 0) {
       this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  }

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    
    var sum = 0;
    data.allItems[type].forEach((cur) => {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1   
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
        newItem = new Income(ID, des, val);
      }

      // Push it into data structure
      data.allItems[typ].push(newItem);

      // return element
      return newItem;
    },

    deleteItem: function(type, id) {

      // Get array of items - either from income or expense
      var ids = data.allItems[type].map(function(cur) {
        return cur.id;
      });

      // Get the index of ID
      index = ids.indexOf(id);

      // If the array is not empty
      if (index !== -1) {
        // Remove the one item based on id 
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {

      // Calculate total income & expenses

      calculateTotal('inc');
      calculateTotal('exp');

      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // Calculate the percentage of income that we spent
      
      // Only when total income is greater than zero to stop impossible calculation of divide by zero

      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }

    },

    calculatePercentages: function() {

      data.allItems.exp.forEach( function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      var allPerc;

      allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },


    testing: function() {
      console.log(data.allItems.inc);
      console.log(data.allItems.exp);
      console.log(data.percentage);
    }
  };

})();


// =============  UI CONTROLLER  =================================
var UIController = (function() {
	var DOMStr = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercentageLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
	};

  var formatNumber = function(num, type) {
      var numSplit, int, dec, len;

      num = Math.abs(num);
      num = num.toFixed(2);

      numSplit = num.split('.');

      int = numSplit[0];
      len = int.length;

      if (int.length > 3) {
        int = int.substr(0, len - 3) + ',' + int.substr(len - 3, 3);
      }
      
      dec = numSplit[1];
      return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
    };


	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMStr.inputType).value, // Either inc or exp
				description: document.querySelector(DOMStr.inputDescription).value,
				value: parseFloat(document.querySelector(DOMStr.inputValue).value)
			};
		},

    addListItem: function(obj, type ) {
      var html, newHtml, element;
      // Create HTML string with placeholder text

      if (type === 'inc') {
        element = DOMStr.incomeContainer;

        // Construct the HTML for income object
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"  id="item-inc-%id%" ></i></button></div></div></div>'
      } else if (type === 'exp') {
        element = DOMStr.expensesContainer;

        // Construct the HTML for expenses object
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline" id="item-exp-%id%"></i></button></div></div></div>';
      } else {
        console.error('ERROR at addListItem! Neither inc or exp selected');
      }
    
      // Replace the placeholder text with some data
      newHtml = html.replace(new RegExp('%id%', 'g'), obj.id);
      //newHTML = html.replace(/%id%/g, obj.id);
      
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      // Insert HTML into the DOM as the last child in the list
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },

    deleteListItem: function(selectorId) {

      var el = document.getElementById(selectorId)
      el.parentNode.removeChild(el);
    },

    clearFields: function() {
      var field, fieldsArr;

      // Define fields to be cleared
      fields = document.querySelectorAll(DOMStr.inputDescription + ',' + DOMStr.inputValue);

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach((cur, idx, arr) => {
        cur.value = "";
      });
      fieldsArr[0].focus();
    },

    displayBudget: function(obj) {

      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMStr.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMStr.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMStr.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
      
      if  (obj.percentage > 0) {
        document.querySelector(DOMStr.percentageLabel).textContent = obj.percentage + '%';
      } else {
          document.querySelector(DOMStr.percentageLabel).textContent = '----'
      }
    },

    displayPercentages: function(percentages) {
      var fields;

      fields = document.querySelectorAll(DOMStr.expensesPercentageLabel);

      nodeListForEach(fields, function(current, index){

        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
            current.textContent = '---';
        }
      });
    },

    displayDate: function() {
      var now, year;
      var now = new Date();

      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      month = now.getMonth();

      year = now.getFullYear();
      document.querySelector(DOMStr.dateLabel).textContent = months[month] + ' ' + year;
    },
    
    changedType: function() {
      var fields = document.querySelectorAll(
        DOMStr.inputType + ',' + 
        DOMStr.inputDescription + ',' +
        DOMStr.inputValue
      );
      nodeListForEach(fields, function(cur) {
        cur.classList.toggle('red-focus');
      });

      document.querySelector(DOMStr.inputBtn).classList.toggle('red');
    },

		getDOMStrings: function() {
			return DOMStr;
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

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
	};

	var DOM = UICtrl.getDOMStrings();


  var updateBudget = function() {
    // Calculate budget
    budgetCtrl.calculateBudget();

    // Return budget
    var budget = budgetCtrl.getBudget();

    // Display budget on UI
    UICtrl.displayBudget(budget);
  };


  var updatePercentages = function() {
    // Calculate percentages
      budgetCtrl.calculatePercentages();

    // Read percentages from Budget Controller
    var percentages = budgetCtrl.getPercentages();


    // Update UI with new percentages
    UICtrl.displayPercentages(percentages);
  }




	var ctrlAddItem = function() {
    var input, newItem;

		// Get input data
		input = UIController.getInput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

      // Add item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // Add item to UI
      UICtrl.addListItem(newItem, input.type);

      // Clear the fields
      UICtrl.clearFields();

      // Calculate & Update budget
      updateBudget();

      // Calculate & update percentages
      updatePercentages();

    }	
	};

  var ctrlDeleteItem = function(e) {
    var itemID, splitID, type, ID, item;

    item = e.target;
    itemID = item.id.substring(5);
    
    if (itemID) {
      
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);  
      //console.log(ID);

      // Delete item from data structure
      budgetCtrl.deleteItem(type, ID);

      // Delete item from UI
      UICtrl.deleteListItem(itemID);

      // Update & Show new budget 
      updateBudget();

      // Calculate & update percentages
      updatePercentages();
    }
  };


  return {
    init: function() {
      console.log('Application has started.');
      UICtrl.displayDate();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  }


})(budgetController, UIController);


controller.init();