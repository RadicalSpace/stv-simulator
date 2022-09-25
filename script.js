var stepCount = 0

var done = []

// Step 0

document.getElementById("partyNum").value = 6
document.getElementById("threshold").value = 3
var pieChart = document.getElementById("pie")
document.getElementById("generateButton").addEventListener("click",run0)

document.getElementById("button1").addEventListener("click",run1)


var thresh

//Color List Start
var blue = "#25c5fa"
var red = "#ff3e30"
var yellow = "#f1fc51"
var green = "#70e368"
var purple = "#a32dd6"
var orange = "#ffc142"
var brown = "#a1602b"
var cyan = "#44ebe8"
//Color List End

var results
var gradient
var partyNum

var startColorArray = [blue, red, yellow, green, purple, orange, brown, cyan]

function run0(){
  done = []
  partyNum = Math.floor(Number(document.getElementById("partyNum").value))
  document.getElementById("partyNum").value = Math.floor(Number(document.getElementById("partyNum").value))
  if(partyNum<3){
    partyNum=3
    document.getElementById("partyNum").value = partyNum
  }
  if(partyNum>startColorArray.length){
    partyNum=startColorArray.length
    document.getElementById("partyNum").value = startColorArray.length
  }
  results = calcResults(partyNum)
  gradient = calcGradient(results)
  pieChart.style.background = "radial-gradient(white 40%, transparent 40%), " + gradient
  calcBar(results)
}

function calcBar(x){
  var div
  var y = 400
  document.getElementById("threshold").value = Math.floor( Number(document.getElementById("threshold").value))
  if(document.getElementById("threshold").value<2){
    document.getElementById("threshold").value=2
  }
    if(document.getElementById("threshold").value>=x.length){
    document.getElementById("threshold").value=x.length-1
  }
  thresh = document.getElementById("threshbar")
  for(n=0;n<startColorArray.length;n++){
  if(document.getElementById(n)){document.getElementById(n).remove()}
    }
  for(i=0;i<x.length;i++){
    div = document.createElement("div")
    div.style.position = "absolute"
    div.style.width = String(x[i].number*10)+"px"
    div.style.height = "50px"
    div.style.left = "450px"
    y = y+50
    div.style.top = String(y)+"px"
    div.style.backgroundColor = x[i].color     
        document.getElementById("main").appendChild(div)
    div.id = i
    div.style.color = "#ffffff"
    div.style.fontSize = "37px"
    div.style.textShadow = "2px 2px 0 " + x[i].color
    div.style.fontFamily = "Poppins"
    div.style.fontWeight = 900
    div.style.paddingLeft = "7px"
    div.innerHTML = x[i].number + "%"
    div.style.zIndex = 0

    
    thresh.style.position = "absolute"
    thresh.style.width = "20px"
    thresh.style.height = String(50*x.length)+"px"
    thresh.style.top = "450px"
    thresh.style.left = String(((100/Number(document.getElementById("threshold").value))*10)+450)+"px"
    thresh.style.borderLeft = "5px dashed black"
    thresh.style.zIndex = 2
  }
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

function calcResults(p){
  var colorArray = startColorArray
  var array1 = []
  var array2 = []
  var array3 = []
  var array4 = []
  var random = null
  var totalTally = 0
  var marginTally = 0
  var fraction = 0
  for(let a=0; a<p;a++){
    array1.push(colorArray[a]) //Crop out unspecified colors
    shuffle(array1)
    random = Math.floor(Math.random()*1000) //Generate random
    array2.push(random) //Add random number to array
    totalTally = totalTally + random //Add number to total tally
  }
  for(let b=0; b<p;b++){
    fraction = Math.floor((array2[b]/totalTally)*100) //Calc %
    array3.push(fraction) //Add percent to array
    array3 = array3.sort(function(a, b){return a-b})
    marginTally = marginTally + fraction
  }
  array3[array3.length-1] = array3[array3.length-1] + 100 - marginTally
  for(let c=0; c<p;c++){
    array4.push({color:array1[c],number:array3[c]})
  }
  return array4
}

function calcGradient(a){
  var countPercent = 0
  var countPercentStore = 0
  var fullString = "conic-gradient(at center, " + a[0].color + " 0% " + String(a[0].number) + "%" 
  var stringStore = ""
  for(let i=1;i<a.length;i++){
    countPercent = countPercentStore + a[i-1].number
    countPercentStore = countPercent
    stringStore = a[i].color
    stringStore = ", " + stringStore + " " + String(countPercent) + "% " + String(a[i].number+countPercent) + "%"
    fullString = fullString + stringStore
  }
  fullString = fullString + ")"
  console.log(fullString)
  return fullString
}

// Step 1

function reSort(d){
  var v = d.sort((obj1, obj2) => obj1.number - obj2.number)
  return v
}

function properRand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function miniElection(a,b,c){
  //a = full results array
  //b = value to ignore
  //c = # to distribute
  var array1 = []
  var array2 = []
  var randNum = 0
  var totalTally = 0
  var margin = c
  for(let i=0;i<a.length;i++){ //Extract numbers from results list
    array1.push(a[i].number)
  }
  for(let i=0;i<array1.length-2;i++){ //Generate random numbers that add to C
    if(margin<=0){
      margin = 0
    }
    randNum = properRand(0,margin)
    array2.push(randNum)
    margin = margin-randNum
  }
  array2.push(margin)
  array2.splice(b,0,c*-1)
  for(let i=0;i<array2.length;i++){
    a[i].number = Number(a[i].number) + Number(array2[i])
    
  }
  return a
}

function updateText(status,color){
  // status mark a: above threshold with extra votes
  // status mark b: above threshold with no extra votes
  // status mark c: none above threshold and is in last
  var affectedColor

  if(color=="#25c5fa"){affectedColor="blue"}
  if(color=="#ff3e30"){affectedColor="red"}
  if(color=="#f1fc51"){affectedColor="yellow"}
  if(color=="#70e368"){affectedColor="green"}
  if(color=="#a32dd6"){affectedColor="purple"}
  if(color=="#ffc142"){affectedColor="orange"}
  if(color=="#a1602b"){affectedColor="brown"}
  if(color=="#44ebe8"){affectedColor="cyan"}
  
  if(status=="a"){
    document.getElementById("blob").innerHTML = "Congrats "+affectedColor+"! You're party has surpassed the threshold! Looks like you've secured a winning spot. Let's take you're extra votes and redistribute them accordingly based on you're voter's next ranking on the ballot."
  }
  if(status=="b"){
    document.getElementById("blob").innerHTML = "Congrats "+affectedColor+"! You're party has surpassed the threshold! Looks like you've secured a winning spot. Unfortunately, though, you do not have any extra votes to redistribute, so let's move on to the next step"
  }
  if(status=="c"){
    document.getElementById("blob").innerHTML = "Sorry "+affectedColor+"... We need votes to redistribute and we have no victor votes, you're party isn't winning any time soon so we will have to redistribute your votes."
  }
}

function run1(){
  var resultsCopy = results
  var triggerThresh1 = false
  var storeThresh = Math.floor(100/(Number(document.getElementById("threshold").value)))
  var newGradient
  var miniResult
  document.getElementById("pie")
  for(let i=0;i<resultsCopy.length;i++){
    if(resultsCopy[i].number>storeThresh){
      triggerThresh1 = true
      miniResult = miniElection(resultsCopy,i,resultsCopy[i].number-storeThresh)
      calcBar(reSort(miniResult.concat(done)))
      newGradient = calcGradient(miniResult.concat(done))
      pieChart.style.background = "radial-gradient(white 40%, transparent 40%), " + newGradient
      updateText("a",results[i].color)
      done.push({color:results[i].color,number:results[i].number})
      resultsCopy.splice(i,1)
      console.log(miniResult)
      console.log(miniResult.concat(done))
      break
    }
    if(resultsCopy[i].number==storeThresh){
      //triggerThresh1 = true
      done.push({color:resultsCopy[i].color,number:resultsCopy[i].number})
      //updateText("b",results[i].color)
      resultsCopy.splice(i,1)
      console.log(miniResult)
      console.log(miniResult.concat(done))
      //break
    }
  }
  if(triggerThresh1 == false){
    resultsCopy = reSort(resultsCopy)
    miniResult = miniElection(resultsCopy,0,resultsCopy[0].number)
    calcBar(reSort(miniResult.concat(done)))
    newGradient = calcGradient(miniResult.concat(done))
    pieChart.style.background = "radial-gradient(white 40%, transparent 40%), " + newGradient
    done.push({color:resultsCopy[0].color,number:resultsCopy[0].number})
    updateText("c",results[0].color)
    resultsCopy.splice(0,1)
    console.log(miniResult)
    console.log(miniResult.concat(done))
  }
    
}