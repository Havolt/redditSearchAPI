let threadArr = [];
let threadAmt;
//if charLmt = 0 show all stories, if -1 show short stories if 1 show long stories
let charLmt = 0;
let currFilter = 'Show all stories ';
let filterObj = {main: {text: 'Show all stories '}, drop1: {text: 'Show short stories '}, drop2: {text: 'Show long stories '}}
let loadNum = {count: 0, runTrue : true, cover: false};
let callInProgress = false;
let userCall = false;
let callLimit = 12;
let lmtAtmpts = 0;
let textFade = {val: 1, change: +1};
//Array of terms that should return bad request
let badComm = ["**Attention! [Serious] Tag Notice**"];
//Search terms that are used to search reddit for relevant thread   
let searchTerm = ['scary', 'creepy', 'paranormal', 'spooky', 'scariest', 'creepiest'];
let scriptAmt = 1;

//List of elements to be created using createEl function
let elementsData = [
    {type: 'div', className: ['optionsSec'], append: '.app'},
    {type: 'div', className: ['optionsButton'], append: '.optionsSec', inHL: '<i class="fa fa-list"></i>'},
    {type: 'div', className: ['optionsMenu', 'hidden'], append: '.optionsSec'},
    {type: 'ul', className: ['optionsFilter'], append: '.optionsMenu'},
    {type: 'div', className: ['filterLong', 'filterItem'], append: '.optionsMenu'},
    {type: 'div', className: ['filterLongText', 'filterLongTextCurr', 'filterItemText'], append: '.filterLong', inHL: filterObj.main.text+'<i class="fa fa-angle-down"></i>'},
    {type: 'div', className: ['filterArrow', 'hidden'], append: '.filterLong'},
    {type: 'div', className: ['filterLongDrop', 'hidden'], append: '.filterLong'},
    {type: 'div', className: ['filterLongText', 'filterItemText'], append: '.filterLongDrop', inHL: filterObj.drop1.text},
    {type: 'div', className: ['filterLongText', 'filterItemText'], append: '.filterLongDrop', inHL: filterObj.drop2.text},

    {type: 'div', className: ['filterCross'], append: '.optionsMenu', inHL: '<i class="fa fa-times"></i>'},
    {type: 'div', className: ['titleSec'], append: '.app'},
    {type: 'div', className: ['titleHead'], append: '.titleSec', inHL: 'No Context Creepy'},
    {type: 'div', className: ['titleDesc'], append: '.titleSec', inHL: 'Creepy comments and stories from reddit with none of the context.'},
    {type: 'div', className: ['searchSec'], append: '.app'},
    {type: 'button', className: ['searchButton'], append: '.searchSec', inHL: 'Generate'},
    {type: 'div', className: ['main'], append: '.app'},
    {type: 'div', className: ['mainText'], append: '.main'}
]

//Function that takes object and creates an element
function createEl(obj){
    let newEl = document.createElement(obj.type);
    obj.className.forEach(element => {
        newEl.classList.add(element);
    });
    if(obj.inHL){newEl.innerHTML = obj.inHL};
    if(obj.inType){newEl.type = obj.inType};
    document.querySelector(obj.append).appendChild(newEl);
}

//Creates interactive section of website
function createInputs(){
    elementsData.forEach(element => {
        createEl(element);
    });
    onLoad();
}

//Gets a random set of 25 threads from askreddit
function searchRedd(e){
    
    if(!callInProgress){
        
        if(e){
            userCall = true;
            document.querySelector('.mainText').style.opacity = 0;
        }

        if(threadArr[0] == undefined){
            threadArr = [];
            let sRand = Math.floor(Math.random()*searchTerm.length);
            let sQuery = searchTerm[sRand];
            let reddScr = document.createElement('script');
            reddScr.src = 'https://www.reddit.com/r/AskReddit/search.json?q='+sQuery+'&sort=random&limit='+callLimit+'&restrict_sr=1&jsonp=searchCallback';
            callInProgress = true;
            document.body.appendChild(reddScr)
        }else{
            document.querySelector('.mainText').innerHTML = '';
            randComment();
            if(threadArr[1] == undefined){
                searchRedd();
            }
        }
    }
}

//The callback function in jsonp from reddit server
function searchCallback(data){
    if(userCall){document.querySelector('.mainText').innerHTML = ''};
    threadAmt = data.data.children.length;
    //console.log(data.data.children);
    data.data.children.forEach(element => {
        let newScr = document.createElement('script');
        newScr.src= element.data.url + '.json?&jsonp=commentCallback';
        document.body.appendChild(newScr);
        
    /*
        let newLink = document.createElement('h2');
        newLink.classList.add('h2Link');
        newLink.innerHTML = element.data.title;
        newLink.addEventListener('click', function(){ window.open(element.data.url)})
        document.querySelector('.main').appendChild(newLink);
        console.log(element.data.selftext)
    */
    });
}

//Retrieves comment from threadArr
function commentCallback(data){
    threadArr.push(data);
    if(threadArr.length == threadAmt){
        //console.log(threadArr);
        console.log(document.querySelectorAll('script'));
        for(let i = document.querySelectorAll('script').length-1; i >= scriptAmt ; i--){
            document.querySelectorAll('script')[i].parentNode.removeChild(document.querySelectorAll('script')[i]);
        }
        callInProgress = false;
        if(userCall){randComment()};
        loadNum.runTrue = false;
    }
}

//Checks if comment is good and if so displays it to user
function randComment(tryAgain){
    let goodPick = true;
    let rNum = Math.floor(Math.random() * threadArr.length);
    if(tryAgain){rNum = tryAgain};
    let crNum = Math.floor(Math.random() * threadArr[rNum][1].data.children.length);
    //console.log(threadArr[rNum][0].data.children[0].data.title);

    if(threadArr[rNum][1].data.children[crNum].data.body == undefined){
        threadArr.splice(rNum, 1);
        goodPick == false;
        randComment();
    }

    badComm.forEach(element => {
        if(threadArr[rNum][1].data.children[crNum].data.body.length < 85){
            goodPick = false;
            lmtAtmpts++;
            if(lmtAtmpts > 5){
                threadArr.splice(rNum, 1);
                lmtAtmpts = 0;
                randComment();
            }else{
                randComment(rNum);
            }
        }
        else if(threadArr[rNum][1].data.children[crNum].data.body.slice(0, 35) == element.slice(0,35)){
            goodPick = false;
            lmtAtmpts++;
            if(lmtAtmpts > 5){
                threadArr.splice(rNum, 1);
                lmtAtmpts = 0;
                randComment();
            }else{
                randComment(rNum);
            }
        }
        
    });
    if(goodPick){
        if(userCall){fadeText()};
        let creepComment = document.createElement('div');
        let ccSplit = threadArr[rNum][1].data.children[crNum].data.body.split('');

        for(let i = 0; i < ccSplit.length; i++){
            if(ccSplit[i] == '\n' && ccSplit[i+1] == '\n'){
                ccSplit[i] = '<br />';
                ccSplit[i+1] = '<br />';
            }
        }
        ccSplit = ccSplit.join('');
        creepComment.innerHTML = ccSplit;
        document.querySelector('.mainText').appendChild(creepComment);
        threadArr.splice(rNum, 1);
        userCall = false;
        lmtAtmpts = 0;
        if(threadArr[1] == undefined){
            searchRedd();
        }
    }
}

function fadeText(){

    textFade.val += textFade.change; 
    document.querySelector('.mainText').style.opacity = (textFade.val/10);
    if(textFade.val == 10 ){
        textFade.val = 0;
    }else{
        setTimeout(fadeText, 50);
    }
}

function onLoad(){
    
    let sbEnd = '';
    if(loadNum.count == 0){
        sbEnd = '&nbsp;&nbsp;'
    }
    else if(loadNum.count == 1){
        sbEnd = '.&nbsp;'
    }else if(loadNum.count == 2){
        sbEnd = '..';
    }
    loadNum.count++;
    if(loadNum.count == 3){loadNum.count = 0}
    document.querySelector('.searchButton').innerHTML='Loading.'+sbEnd;
        
    let buttonCover = document.createElement('div');
        buttonCover.classList.add('searchCover');
        document.querySelector('.searchButton').appendChild(buttonCover);
    if(loadNum.runTrue){setTimeout(onLoad, 450)}else{
        document.querySelector('.searchButton').innerHTML= 'Generate';
    }
}

function optionsButtFunc(){
    document.querySelector('.optionsButton').classList.add('hidden');
    document.querySelector('.optionsMenu').classList.remove('hidden');
}

function filterButtFunc(){
    document.querySelector('.optionsButton').classList.remove('hidden');
    document.querySelector('.optionsMenu').classList.add('hidden');
}

function chooseStoryLength(){
        let removeTrue = false;
        for(let j = 0; j < document.querySelector('.filterLongDrop').classList.length; j++){
            if(document.querySelector('.filterLongDrop').classList[j] == 'hidden'){removeTrue = true}
        }
        if(removeTrue){
            document.querySelector('.filterLongDrop').classList.remove('hidden');
            document.querySelector('.filterArrow').classList.remove('hidden');
            document.querySelector('.filterLongText').innerHTML = currFilter + '<i class="fa fa-angle-up"></i>';
        }
        else{
            document.querySelector('.filterLongDrop').classList.add('hidden');
            document.querySelector('.filterArrow').classList.add('hidden');
            document.querySelector('.filterLongText').innerHTML = currFilter + '<i class="fa fa-angle-down"></i>';
        }
}

function giveTxtDropElsEvts(){
    for(let i = 0; i < document.querySelector('.filterLongDrop').children.length; i++){
        console.log(i);
        document.querySelector('.filterLongDrop').children[i].addEventListener('click', function(){
            dropEvent(i);
        })
    }
}

function dropEvent(num){
    console.log('I am drop event ' + num);
}



//Initializes application
(function initApp(){
    createInputs();
    document.querySelector('.searchButton').addEventListener('click', searchRedd);
    document.querySelector('.optionsButton').addEventListener('click', optionsButtFunc);
    document.querySelector('.filterCross').addEventListener('click', filterButtFunc);
    document.querySelector('.filterLongTextCurr').addEventListener('click', chooseStoryLength);
    giveTxtDropElsEvts()
    searchRedd();
})()