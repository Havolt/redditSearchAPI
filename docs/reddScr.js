let threadArr = [];
let threadAmt;
//if charLmt = 0 show all stories, if -1 show short stories if 1 show long stories
let charLmt = 0;
let currFilter = ['Show all stories ', 'Show short stories ', 'Show long stories '];
let filterObj = {main: {text: 'Show all stories '}, drop0: {text: 'Show short stories '}, drop1: {text: 'Show long stories '}, min: 85, max : 0, isMax: false }
let loadNum = {count: 0, runTrue : true, cover: false};
let callInProgress = false;
let randCallInProgress = false;
let userCall = false;
let callLimit = 25;
let lmtAtmpts = 0;
let textFade = {val: 1, change: +1};
//Array of terms that should return bad request
let badComm = "**Attention! [Serious] Tag Notice**";
let badCommReg = /\*\*Attention! \[Serious\] Tag Notice\*\*/g
//Regex for finding URLs
let linkRegex = /\[[^\]]*\]\([^\)]*\)/g;
let linkRegexP1 = /\[[^\]]*\]/g;
let linkRegexP2 = /\([^\)]*\)/g;
//Search terms that are used to search reddit for relevant thread   
let searchTerm = ['scary', 'creepy', 'paranormal', 'spooky', 'scariest', 'creepiest'];
let scriptAmt = 1;
let prevStories = {arr: [], currDisp: 0};

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
    {type: 'div', className: ['filterLongText', 'filterItemText'], append: '.filterLongDrop', inHL: filterObj.drop0.text},
    {type: 'div', className: ['filterLongText', 'filterItemText'], append: '.filterLongDrop', inHL: filterObj.drop1.text},
    {type: 'div', className: ['filterCross'], append: '.optionsMenu', inHL: '<i class="fa fa-times"></i>'},
    {type: 'div', className: ['titleSec'], append: '.app'},
    {type: 'div', className: ['titleHead'], append: '.titleSec', inHL: 'No Context Creepy'},
    {type: 'div', className: ['titleDesc'], append: '.titleSec', inHL: 'Creepy comments and stories from reddit with none of the context.'},
    {type: 'div', className: ['searchSec'], append: '.app'},
    {type: 'button', className: ['searchButton'], append: '.searchSec', inHL: 'Generate'},
    {type: 'div', className: ['chngStorySec'], append: '.searchSec'},
    {type: 'div', className: ['chngStoryButtPrev', 'chngStoryButt'], append: '.chngStorySec', inHL: '<i class="fa fa-arrow-circle-left"></i>'},
    {type: 'div', className: ['chngStoryButtNext', 'chngStoryButt'], append: '.chngStorySec', inHL: '<i class="fa fa-arrow-circle-right"></i>'},
    {type: 'div', className: ['main'], append: '.app'},
    {type: 'div', className: ['mainText'], append: '.main'},
    {type: 'div', className: ['footerSec'], append: '.app'},
    {type: 'div', className: ['footerText'], append: '.footerSec', inHL: 'The stories presented on this website belong to their respective writers. We are not affiliated with reddit.'}
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
    checkStoryArrow();
}

//Gets a random set of 25 threads from askreddit
function searchRedd(e){
    
    if(!callInProgress && !randCallInProgress){
        
        if(e){
            userCall = true;
            document.querySelector('.mainText').style.opacity = 0;
        }
        if(threadArr.length < 2){
            threadArr = [];
            let sRand = Math.floor(Math.random()*searchTerm.length);
            let sQuery = searchTerm[sRand];
            let reddScr = document.createElement('script');
            loadNum.runTrue = true;
            onLoad();
            reddScr.src = 'https://www.reddit.com/r/AskReddit/search.json?q='+sQuery+'&sort=random&limit='+callLimit+'&restrict_sr=1&jsonp=searchCallback';
            callInProgress = true;
            document.body.appendChild(reddScr)
        }else{
            if(threadArr[1] == undefined){
                searchRedd();
                
            }else{
                document.querySelector('.mainText').innerHTML = '';
                randComment();
            }
            
        }
    }
}

//The callback function in jsonp from reddit server
function searchCallback(data){
    if(userCall){document.querySelector('.mainText').innerHTML = ''};
    threadAmt = data.data.children.length;
    data.data.children.forEach(element => {
        let newScr = document.createElement('script');
        newScr.src= element.data.url + '.json?&jsonp=commentCallback';
        document.body.appendChild(newScr);
        
    });
}

//Retrieves comment from threadArr
function commentCallback(data){
    threadArr.push(data);
    if(threadArr.length == threadAmt){
        for(let i = document.querySelectorAll('script').length-1; i >= scriptAmt ; i--){
            document.querySelectorAll('script')[i].parentNode.removeChild(document.querySelectorAll('script')[i]);
        }
        for(let i = 0; i < threadArr.length; i++){
            if(threadArr[i][1].data.children.length < 2){
                threadArr.splice(0, 1);
            }
        }
        if(threadArr.length < 4){
            searchRedd()
        }
        callInProgress = false;
        if(userCall){
            
            randComment()
        };
        loadNum.runTrue = false;
    }
}

//Checks if comment is good and if so displays it to user
function randComment(tryAgain){

    let rThreadNum;
    let goAgain = false;
    if(tryAgain){
        rThreadNum = tryAgain;
    }else{
        rThreadNum = Math.floor(Math.random() * threadArr.length);
    }
    let rCommentNum = Math.floor(Math.random() * threadArr[rThreadNum][1].data.children.length);

    //checks to see if comment has body on it and if it i the correct length
    if(threadArr[rThreadNum][1].data.children[rCommentNum].data.body == undefined){
        goAgain = true;
        lmtAtmpts++;
    }
    else{
        if(threadArr[rThreadNum][1].data.children[rCommentNum].data.body.length < filterObj.min && (!filterObj.isMax || threadArr[rThreadNum][1].data.children[rCommentNum].data.body.length > filterObj.max )){
            goAgain = true;
            lmtAtmpts++;
        }else{


            let attentionCheck = badCommReg.test(threadArr[rThreadNum][1].data.children[rCommentNum].data.body);

            if(!attentionCheck){


                //code that runs when comment is perfect
                let tmpText = []
                
                let finalStory = threadArr[rThreadNum][1].data.children[rCommentNum].data.body;
                finalStory = finalStory.replace(linkRegex, function(x){
                    let linkReddURL;
                    x = x.replace(linkRegexP1, function(y){
                        y = y.split('')
                        y.shift();
                        y.pop();
                        y = y.join('');
                        return y;
                    })
                    x = x.replace(linkRegexP2, function(y){
                        y = y.split('');
                        y.shift();
                        y.pop();
                        y = y.join('');
                        linkReddURL = y;
                        return '';
                    })
                    x = '<a href="' + linkReddURL + '" target="_blank" >' + x + '</a>';
                    return x;
                });

                let generalReddURL = /https:\/\/en.wikipedia.org\/wiki\/[\S]*|https:\/\/youtu.be\/[\S]*|https:\/\/www.youtube.com\/watch\?[\S]*/g;

                finalStory = finalStory.replace(generalReddURL, function(x){
                    x = "<a href='" + x + "' target='_blank' >" + x + '</a>';
                    return x;
                })

                finalStory = finalStory.split('');
                for(let i = 0; i < finalStory.length; i++){
                    if(finalStory[i] == '\n'){
                        finalStory[i] = '<br />';
                    }
                }
                finalStory = finalStory.join('');

                document.querySelector('.mainText').innerHTML = finalStory;
                fadeText();
                prevStories.arr.push(finalStory);
                if(prevStories.arr.length > 20){
                    prevStories.arr.shift();
                }
                prevStories.currDisp = prevStories.arr.length-1;
                checkStoryArrow();
                threadArr.splice(rThreadNum, 1);
            }else{
                goAgain = true;
            }
        } 
    }

    //makes randComment run again if it hasnt obtained correct length story
    if(goAgain){
        if(lmtAtmpts < 8){
            randComment(rThreadNum)
        }else{
            threadArr.splice(rThreadNum, 1);
            lmtAtmpts = 0;
            if(threadArr.length < 2){
                userCall = true;
                loadNum.runTrue = true;
                searchRedd();
            }else{
                randComment();
            }
        }
    }
}

//gives the text a slight fade effect to inform user its a new story loaded
function fadeText(){
    textFade.val += textFade.change; 
    document.querySelector('.mainText').style.opacity = (textFade.val/10);
    if(textFade.val == 10 ){
        textFade.val = 0;
    }else{
        setTimeout(fadeText, 50);
    }
}

//function that animates the loading sequence to inform the user
function onLoad(callLoc){
    let sbEnd = '';
    if(loadNum.count == 0){
        sbEnd = '&nbsp;&nbsp';
    }
    else if(loadNum.count == 1){
        sbEnd = '.&nbsp;'
    }else if(loadNum.count == 2){
        sbEnd = '..'  ;
    }
    loadNum.count++;
    
    if(loadNum.count == 3){loadNum.count = 0}
    document.querySelector('.searchButton').innerHTML='Loading.'+sbEnd;
        
    let buttonCover = document.createElement('div');
        buttonCover.classList.add('searchCover');
        document.querySelector('.searchButton').appendChild(buttonCover);
    if(loadNum.runTrue){setTimeout(onLoad, 450)}else{
        document.querySelector('.searchButton').innerHTML= 'Generate';
        loadNum.count = 0;
    }
}

//Event function for options button
function optionsButtFunc(){
    document.querySelector('.optionsButton').classList.add('hidden');
    document.querySelector('.optionsMenu').classList.remove('hidden');
    document.querySelector('.titleSec').classList.add('titleSecWMenu');
}
//Event function for options cross
function filterButtFunc(){
    document.querySelector('.optionsButton').classList.remove('hidden');
    document.querySelector('.optionsMenu').classList.add('hidden');
    document.querySelector('.titleSec').classList.remove('titleSecWMenu');
}

//changes the display of the filter area
function chooseStoryLength(){
        let removeTrue = false;
        for(let j = 0; j < document.querySelector('.filterLongDrop').classList.length; j++){
            if(document.querySelector('.filterLongDrop').classList[j] == 'hidden'){removeTrue = true}
        }
        if(removeTrue){
            document.querySelector('.filterLongDrop').classList.remove('hidden');
            document.querySelector('.filterArrow').classList.remove('hidden');
            document.querySelector('.filterLongText').innerHTML = filterObj.main.text + '<i class="fa fa-angle-up"></i>';
        }
        else{
            document.querySelector('.filterLongDrop').classList.add('hidden');
            document.querySelector('.filterArrow').classList.add('hidden');
            document.querySelector('.filterLongText').innerHTML = filterObj.main.text + '<i class="fa fa-angle-down"></i>';
        }
}

function giveTxtDropElsEvts(){
    for(let i = 0; i < document.querySelector('.filterLongDrop').children.length; i++){
        document.querySelector('.filterLongDrop').children[i].addEventListener('click', function(){
            dropEvent(i)
        })
    }
}

function dropEvent(num, num2){
    filterObj.main.text = filterObj['drop'+num].text;
    let tmpArr = [];
    for(let i = 0; i < currFilter.length; i++){
        tmpArr.push(currFilter[i]);
    }
    for(let i = 0; i < tmpArr.length; i++){
        if(tmpArr[i] == filterObj.main.text){
           tmpArr.splice(i, 1);
        }
    }

    document.querySelector('.filterLongTextCurr').innerHTML = filterObj.main.text;
    for(let i = 0; i < document.querySelector('.filterLongDrop').children.length; i++){
        filterObj['drop'+i].text = tmpArr[i];
        document.querySelector('.filterLongDrop').children[i].innerHTML = filterObj['drop'+i].text;
    }
    chooseStoryLength();
    changeFilter()
}

//changes min and max filter amounts depending on user choice
function changeFilter(){
    if(filterObj.main.text == 'Show all stories '){
        filterObj.isMax = false;
        filterObj.max = 0;
        filterObj.min = 85;
    }else if(filterObj.main.text == 'Show short stories '){
        filterObj.isMax = true;
        filterObj.max = 1500;
        filterObj.min = 55;
    }else if(filterObj.main.text == 'Show long stories '){
        filterObj.isMax = false;
        filterObj.max = 0;
        filterObj.min = 1200;
    }
}

//swaps between which story is displayed to user when user clicks previous or next story buttons
function changeStory(numb){
    if(numb == -1 && prevStories.currDisp > 0){
        prevStories.currDisp--;
    }else if(numb == 1 && prevStories.currDisp < prevStories.arr.length-1){
        prevStories.currDisp++;
    }
    if(prevStories.arr[prevStories.currDisp]){
        document.querySelector('.mainText').innerHTML = prevStories.arr[prevStories.currDisp]; 
    }
    checkStoryArrow();
}

function  checkStoryArrow(){

    let nextExist = false;
    let prevExist = false;

    for(let i = 0; i < document.querySelector('.chngStoryButtPrev').classList.length; i++){
        if(document.querySelector('.chngStoryButtPrev').classList[i] == 'chngStoryButtStop'){
           prevExist = true;
        }
    }
    for(let i = 0; i < document.querySelector('.chngStoryButtNext').classList.length; i++){
        if(document.querySelector('.chngStoryButtNext').classList[i] == 'chngStoryButtStop'){
           nextExist = true;
        }
    }

    if(prevStories.currDisp == 0 && !prevExist){
        document.querySelector('.chngStoryButtPrev').classList.add('chngStoryButtStop');
    }else if(prevStories.currDisp != 0 && prevExist){
        document.querySelector('.chngStoryButtPrev').classList.remove('chngStoryButtStop');
    }

    if((prevStories.currDisp == prevStories.arr.length-1 || prevStories.arr.length == 0) && !nextExist){
        document.querySelector('.chngStoryButtNext').classList.add('chngStoryButtStop');
    }else if((prevStories.currDisp != prevStories.arr.length-1 && prevStories.arr.length != 0 ) && nextExist){
        document.querySelector('.chngStoryButtNext').classList.remove('chngStoryButtStop');
    }
}


//Initializes application
(function initApp(){
    createInputs();
    document.querySelector('.searchButton').addEventListener('click', searchRedd);
    document.querySelector('.optionsButton').addEventListener('click', optionsButtFunc);
    document.querySelector('.filterCross').addEventListener('click', filterButtFunc);
    document.querySelector('.filterLongTextCurr').addEventListener('click', chooseStoryLength);
    document.querySelector('.chngStoryButtPrev').addEventListener('click', function(){
        changeStory(-1);
    })
    document.querySelector('.chngStoryButtNext').addEventListener('click', function(){
        changeStory(1);
    })
    giveTxtDropElsEvts()
    searchRedd();
})()