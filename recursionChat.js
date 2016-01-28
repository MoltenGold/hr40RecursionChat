//HOWDY, CHUMS! A couple of people asked for any advice I had about recursion, since I
//mentioned during the january 26 hangout that I didn't have much of a problem with it
//conceptually.(all my problems with the recursion section were from not understanding
//getElementByClassName itself, and not understanding stringifyJSON itself.) 
//I figured I'd do a writeup on all my findings, including snippets from
//various resources I used and my own insights and advice. Each concept will have an
//example to demonstrate what I mean, and a practice question for you to work out yourself.

//In order to properly use this, you'll have to copy and paste a lot of code into a place
//where you can actually run it. Personally, I use jsbin.com. For small-scale functions
//it's pretty solid. Turn on Javascript, Console and Output, and everything contained
//here should copy-paste just fine. 

//DISCLAIMER: I am at the same level of programming expertise as you guys, if not lower!
//I only started programming when I decided to pursue hack reactor, so I'm VERY new!
//If you think something is weird, or wrong, or anything like that it may very well be.
//I did my best to thoroughly explore and test everything I wrote in this file, and I
//am pretty certain that everything contained in it is correct, but it's entirely possible
//that I am wrong. Many times, I would test something and it would work, but my assumptions
//for WHY it worked were actually wrong, so my explanation was wrong. Like I said, I've done
//my best to avoid that here but if you spot any problems, let me know or post publically
//about it in slack so everyone realizes the mistake instead of getting bad info and not
//realizing it. But with that out of the way, let's talk about recursion!

//First and foremost, what is it? It's a couple of things. But we're going to work through
//them one at a time. For one thing, recursion acts as a loop. For example:

var loop15 = function(num){
	if(num >== 15){
		return num;
	}
	else{
		return loop15(num+1);
	}
};

console.log(loop15(5));

//If you copy-paste that entire thing, including the console.log call, into jsbin, you'll see
//pretty much what you expect logged out: 15. What exactly happened? We called the function,
//passed in 5 as an initial value. Checked to see if 5 was equal to 15, it was not, so we
//return loop15(num+1);, this calls the function again, this time making the 5 a 6 by taking
//the parameter(that it has access to, since it's within the scope!) and adding 1 to it which
//evaluates to 6, then we start the whole process over again.
// When it gets to 15, the final return is the value of num, which gets logged out to the console.
//This, just like a loop, can go into an infinite loop(called a StackOverflow), so make sure
//function has a terminate condition. In this case, it's num>==15.
// Practice this here, by doing much the same thing, but make the final result zero:

var loopToZero = function(num){

};

console.log(loopToZero(15));

//Okay, that's the super simple basics. It does some work, gets some information, takes that
//information and calls itself with the new information, then does the same work as before
//but with new info. Cool. But what REALLY made recursion 'click' for me was realizing it's
//really not all that different from the higher order functions we all already use. Consider
//the following, which is a higher order function with no recursion at all:

var each = function (collection, callback){
  for(var i = 0; i < collection.length; i++){
    callback(collection[i]);
  }
};

var makeCats = function(array){
  var cats = [];
  each(array, function(element){
    cats.push(element+=" cat");
  });
  return cats;
  
};

console.log(makeCats(["brown", "tabby", "siamese"]));

//First we establish a simple each function, then we make a makeCats function which
//makes an array to hold our cats, then we call each, which adds " cat" to the element and
//pushes it. No big deal. But what if we had an array of cats that also contained more arrays
//of cats? Something like ["brown", "tabby",["calico", "tortie"], "siamese"] would log out
//["brown cat", "tabby cat", "calico,tortie cat", "siamese cat"] which we obviously don't want
//So, using that same function we can refactor each, a function we all know and fully 
//understand because boy howdy have we had to write it a lot for hack reactor, to become a
//recursive function to achieve the result we want. It'd look like this:

var each = function (collection, callback){
  for(var i = 0; i < collection.length; i++){
    if(Array.isArray(collection[i])){
      each(collection[i], callback);
    }
    else{
    callback(collection[i]);
    }
  }
};

var makeCats = function(array){
  var cats = [];
  each(array, function(element){
    cats.push(element+=" cat");
  });
  return cats;
  
};

console.log(makeCats(["brown", "tabby",["calico", "tortie"], "siamese"]));

//Step by step, exactly what happens: We make the call. the makeCats function makes an array
//to store cats in. We call the each function, pass it the array of cats and the callback.
//Each looks at the first thing in the array, "brown". That's not an array, so it concats
//" cat" onto the end and pushes it to the cats array. Same for Tabby. When it gets to the
//3rd element, it sees that it's an array. This performs a recursive call. Each is called,
//the element it's currently working on, an array, is passed in as the collection. The callback
//is the one from the ORIGINAL each call! Since each is called within itself, it is still
//within the original Each calls scope, which allows it to use the original each's callback
//parameter. Now that we're in a new each with a new collection, Calico is the next element. It gets
//pushed to the cat array after being concat'd, tortie gets pushed, and the work for the second
//call stops there. Back in the original each call, siamese gets concated and pushed, and we see
//the exact results we wanted: ["brown cat", "tabby cat", "calico cat", "tortie cat", "siamese cat"]

//For your practice, consider the flattening of an array. If you have [[1,2],[3,4],[5,6]] a common
//way to take the inner arrays and get one array with all the information is with reduce. You would
//do the following: 

var flattened = [[1, 2], [3, 4], [5, 6]].reduce(function(a, b) {
  return a.concat(b);
}, []);

console.log(flattened);
//(Thanks, mozilla development network)

//which gives you [1,2,3,4,5,6]. But if you pass in [[1,2,[3,4],[5,6]]], you get
//[1, 2, [3, 4], [5, 6]] as your result. An array with arrays in it. Not what you wanted!
//Using recursion, and what we just learned with the cats, get
//what you really want: [1,2,3,4,5,6]

var flattenArr = function(arr){

}

console.log(flattenArr([[1,2,[3,4],[5,6]]]))

//Okay, it's basically a loop. It's also basically a higher-order function. But what about a
//totally self contained function, how does recursion work then? Well, that's where things get
//really complicated. Let's look at this refactored version of makeCats: 

var makeCats = function(array){
  var cats = [];
  for(var i = 0; i < array.length; i++){
    if(!Array.isArray(array[i])){
      cats.push(array[i] += " cat");
    }
    else if(Array.isArray(array[i])){
      makeCats(array[i]);
    }
  }
  return cats;
  };

console.log(makeCats(["brown", "tabby",["calico"],"tortie"]));

//What we want is ["brown cat", "tabby cat", "calico cat", "tortie cat"], and what we get is
// ["brown cat", "tabby cat", "tortie cat"]. What happened to calico? Your first thought might
//be that your else-if statement is wrong. But it's correct. The loop is correct. The recursive
//call happens properly, and everything works like you want. But the result isn't correct. Okay
//how about we try a little change. In the else-if statement, we'll change the makeCats call to
//push to the cats array. so it becomes cats.push(makeCats(array[i])); Your result?:
//["brown cat", "tabby cat", ["calico cat"], "tortie cat"]
//Now you might have a better idea of what the culprit is. Scope. That's what the problem is.
//That's what it is so damn often that it might as well always be the first thing you check.
//So, what exactly is happening with the scope that's causing our problem? The answer is in the
//variable declaration, var cats = [];
//When makeCats is called originally, it gets its own scope with its own cats array. When you
//recursively call it, that new call also gets its own scope, with ITS own cat array, even
//though it is contained within the scope of the original call. The recursive call pushes to its
//own version of the cats array, which gets returned as an array.

//How do you solve this? There's actually quite a few ways. The easiest and most reliable is to
//simply declare the cats array OUTSIDE of the function entirely, in the global scope(or whatever
// function contains the recursive function. You get the idea.) in other words, you get this:

var cats = [];

var makeCats = function(array){
  for(var i = 0; i < array.length; i++){
    if(!Array.isArray(array[i])){
      cats.push(array[i] += " cat");
    }
    else if(Array.isArray(array[i])){
      makeCats(array[i]);
    }
  }
  return cats;
  };

console.log(makeCats(["brown", "tabby",["calico"],"tortie"]));

//which produces the result you want, ["brown cat", "tabby cat", "calico cat", "tortie cat"].
//But lets just say that you don't have a containing function to put the variable in, and you don't
//want to clutter up the global scope with more variables. What else can you do? Well, we know
//thanks to the loop functions at the beginning of this, that we can use the parameters passed in
//in subsequent recursive calls. Here's an example of how we can use that concept with our Cats function
//to get the result we want, without declaring a variable at all:

var makeCats = function(array, cats){
  if(!cats){
    cats = [];
  }
  for(var i = 0; i < array.length; i++){
    if(!Array.isArray(array[i])){
      cats.push(array[i] += " cat");
    }
    else if(Array.isArray(array[i])){
      makeCats(array[i], cats);
    }
  }
  return cats;
  };

console.log(makeCats(["brown", "tabby",["calico"],"tortie"]));

//Which gets us the result we want, ["brown cat", "tabby cat", "calico cat", "tortie cat"]
//So, basically the same as before, but note the changes. One, we have a new parameter to take arguments
//for, the cats parameter. Next, there's an if statement that says if cats is undefined, establish it
//as an empty array. When we call the function we only pass it in one argument, thus cats is undefined.
//So the parameter becomes an empty array. Cat srings get pushed to it, we hit an array, the recursive call
//happens. The recursive call passes in Cats as a parameter this time, and so the if statement doesn't
//trigger. We get the cats array from the original call, cool! We push to it as usual, return the cats
//array parameter, the original call gains access to it, pushes the last cat to the array and returns it.
//Simple!

//To practice this, we're going to go back to the flatten function we made. HOPEFULLY you made it using
//the concept of each we used in that lesson, but if not it's fine. In this case,
//you should flatten an array of arrays of arrays, however deep it goes, completely self contained with
//only one function. You want the result [1,2,3,4,5,6] once again. Achieve it using the parameter
//passing we just learned:

var flattenArray = function(array){

};

console.log(flattenArray([1,2[3,4,[5,6]]]))

//Okay, so we established we can keep variables outside of the scope, or pass them as parameters in order
//to work with a single variable multiple times. There are a few other ways you can do this, namely hiding
//the variable declarations behind if statements, but honestly my grasp on that topic isn't perfect
//so I don't want to go into it to make sure I don't confuse anyone who is already confused, you know?
//The gist of it is that the variable declaration only happens if the if statement fires, meaning you can
//declare the variable only when you need it rather than every time the function is called. But it's
//actually way more confusing and complicated than that. For most things, you can just either
//declare globally or use parameter passing.

//And that about does it! You know how recursion work(calls itself with new info), you know how it can be
//used at a basic level(loops and higher order functions), you know how to handle the really 
//tricky part(variables and scope) and you've followed along with basic functions and practice questions
//Recursion goes quite a bit deeper than this, but I'm just as new to this as everyone else, so I'll
//leave everything else up to the experts. If you've followed along, you know all you need to know
//about recursion to figure out the actual recursion parts of the recursion assessment. But how about some
//more practice questions?

//We all know how modulo works. 14 % 2 === 0; 14 divided by 2 is 7 with 0 left over. That's a very
//easy way to find out whether a number is even or odd. But there's a way to do it with loops, and
//therfor a way to do it with recursion. The following function should log out True if a number is
//even, or False of the number is odd:

var evenOrOdd = function(num){

};

console.log(evenOrOdd(15));

//Should log false.

//Next, if we find all the numbers 10 and below that are multiples of 3 or 5, we get 3, 5, 6, 9, 10.
//The sum of those numbers is 33. 
//Using recursion, find the multiples of 20 and below that are multiples of 3 or 5, then sum them up.

var sumOfMultiples = function(num){

}

console.log(sumOfMultiples(20));

//Should log 116.

//Okay, the easiest stuff is over, but this isn't much harder! You're given a string. Within that
//string, find words that match up to keys in an object, then replace them with the keys values.

var ownedCats = function(stringOne){
	var catTypes = {
		"tabby": "tabby cat,",
		"siamese": "siamese cat,",
		"tortie": "tortie cat,"
	}
}

console.log(ownedCats("I have some cats, they are a tabby and a siamese, but I want a tortie"));

//should log "I have some cats, they are a tabby cat and a siamese cat, but I want a tortie cat."

//Next, if you're given an array of mixed information and you want it displayed as though it were in an array, spaced properly
//but NOT actually within an array! you can do that with recursion too:

var stringedInfo = function(info){

}

console.log(stringedInfo([1,[2,3,[4,5],6,7],8,9,10,11,[true, false,null,undefined]]))

//Should log: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, true, false, null, undefined"

//And lastly, you're given a messy object containing mixed media. Log out an array that contains all the values within all objects for
//a given key.

var obj = {
  "soup": "tomato",
  "car" : "old",
  42: "soup",
  false: "true",
  "cabinet": {
  "soup": "clam chowder",
  "key" : "lock",
  "stew" : {
  "vegetable" : "carrots"
	},
  		},
    "storage" :{
    	"keys": [1,2,3,4, {'soup': 'potato'},6],
    undefined: undefined
 }
};

var findInObject = function(object, keyword){

}

console.log(findInObject(obj, "soup"))

//should log: ["tomato", "clam chowder", "potato"]. 

