var acorn = require("acorn");

//global variables
testList=[];

/**
 * Check if the ast contain all the functionalities listed in the test list
 * Return a list of missing functionalities
 * @param {Object} ast 
 * @param {Object} testMap
 * @param {Boolean} whiteListTest
 * @return {Object} MissingMap
 */
function detectExistence(ast, testMap, whiteListTest) {
	var list=[];
	// iterate through every node and check its type
	detectExistenceBST(ast, testMap);

	//append missing functionalities to the return list
	//true if testing a whitelist of specific functionality
	if (whiteListTest) {
		for (var e in testMap) {
		  	if (testMap.hasOwnProperty(e) && !testMap[e]) {
		    	list.push(e);
		  	}
		}
	} else {
		for (var e in testMap) {
		  	if (testMap.hasOwnProperty(e) && testMap[e]) {
		    	list.push(e);
		  	}
		}	
	}

	return list;
}

/**
 * Iterate through every node in AST to check the node type
 */
function detectExistenceBST(node, testMap) {
	if (inFunctionalityList(node.type)) {
		testMap[node.type]=true;
	}

	if (typeof node.body === 'undefined' ) {
		return;
	}

	if (Array.isArray(node.body)) {
		var i;
		for (i=0;i<node.body.length;i++) {
			var child = node.body[i];
			detectExistenceBST(child,testMap);
		}
	} else if (typeof node.body === 'object') {
		detectExistenceBST(node.body,testMap);
	}
}

/**
 * Check if the node type is in the testing list
 */
function inFunctionalityList(testType) {
	if (testList.indexOf(testType)> -1) {
		return true;
	} else {
		return false;
	}
}

/**
 * Convert a test type to human readable string 
 * @param {String} testType 
 * @return {String} 
 */
function convertToReadable(testType) {
	var returnMe;
	switch(testType) {
	    case "ForStatement":
	        returnMe="for loop";
	        break;
	    case "VariableDeclaration":
	        returnMe="variable declaration";
	        break;
	    case "IfStatement":
	        returnMe="if statement";
	        break;
	    default:
	        returnMe=testType;
	}

	return returnMe;
}

//list of api
var api = {

	/**
	 * A whitelist of specific functionality. 
	 * @param {String} content 
	 * @return {String} feedback
	 */
	checkWhitelist: function(content, unitTestList) {
		var tokens = [], feedback = "";
		testList=unitTestList;
		var ast = acorn.parse(content, {
		    onToken: tokens
		});

		// Convert testList into a map, where the key is the test case name and the value is boolean
		var testMap = {}, missingList = [];
		//initialize the map, set all the values to false
		for (i=0; i<testList.length; i++) {
			testMap[testList[i]]=false;
		}

		missingList = detectExistence(ast, testMap, true);
		//append the missing functionalities to feedback
		if (missingList.length) {
			feedback = "This program MUST use a ";

			for (i=0; i<missingList.length-1; i++) {
				feedback += convertToReadable(missingList[i]) + " and a ";
			}

			feedback += convertToReadable(missingList[missingList.length-1]) + '.';
		}

		//if no missing functionality
		if (!feedback) {
			feedback="success";
		}

		console.log(feedback);
		return feedback;
	},

	/**
	 * A blacklist of specific functionality.
	 * @param {String} content 
	 * @return {String} feedback
	 */
	checkBlacklist: function(content, unitTestList) {
		var tokens = [], feedback = "";
		testList=unitTestList;
		var ast = acorn.parse(content, {
		    onToken: tokens
		});

		//Convert testList into a map, where the key is the test case name and the value is boolean
		var testMap = {}, presentList = [];
		//initialize the map, set all the values to false
		for (i=0; i<testList.length; i++) {
			testMap[testList[i]]=false;
		}

		presentList = detectExistence(ast, testMap, false);
		//append the missing functionalities to feedback
		if (presentList.length) {
			feedback = "This program MUST NOT use a ";

			for (i=0; i<presentList.length-1; i++) {
				feedback += convertToReadable(presentList[i]) + " and a ";
			}

			feedback += convertToReadable(presentList[presentList.length-1]) + '.';
		}

		//if no missing functionality
		if (!feedback) {
			feedback="success";
		}

		console.log(feedback);
		return feedback;
	},

	/**
	 *Determine the rough structure of the program.
	 * @param {String} content 
	 * @return {String} feedback
	 */	
	checkStructure: function(content) {

	}

};


module.exports = api;