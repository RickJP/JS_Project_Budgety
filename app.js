// BUDGET CONTROLLER
var budgetController = (function() {})();

// UI CONTROLLER
var UIController = (function() {})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
	var ctrlAddItem = function() {
		// Get input data
		// Add item to budget controller
		// Add item to UI
		// Calculate budget
		// Display budget on UI

		console.log('WORKS!');
	};

	document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

	document.addEventListener('keydown', function(e) {
		if (e.keyCode === 13 || e.which === 13) {
			// 13 = 'enter key'   which used to support older browsers
			ctrlAddItem();
		}
	});
})(budgetController, UIController);
