var dog,sadDog,happyDog, database;
var foodS,foodStock, foood;
var addFood, hour;
var foodObj;

//create feed and lastFed variable here
var feed, lastFed;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feed = createButton("Feed the Dog")
  feed.position(650, 95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();
  getFedtime();
 
  //write code to display text lastFed time here
  fill('black');
  textSize(18);
  text("Last Fed : " + lastFed, 100, 25);
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time

  if (foodS > 0) {
    foodS = foodS-1;
  }

  database.ref('/').update({
    Food : foodS
  }) 

  var dbref = database.ref("/FeedTime");
  dbref.once("value", function(data) {

    lastFed = data.val();

  })

}

//function to add food in stock
function addFoods(){
  dog.addImage(sadDog);

  if (foodS < 40) {
    foodS++;
  }

  database.ref('/').update({
    Food:foodS
  })
}

async function getFedtime() {

  // write code to fetch time from API
  var response = await fetch("https://timezone.abstractapi.com/v1/current_time/?api_key=1dbca79b75a547c79e3110fa1752cb0e&location=Mumbai, India");
  
  //change the data in JSON format
  var resJSON = await response.json();
  var dateTime = resJSON.datetime;

  // write code slice the datetime
  hour = dateTime.slice(11, 13);
  //    console.info(hour);

  database.ref('/').update({

    FeedTime : hour

  })

}