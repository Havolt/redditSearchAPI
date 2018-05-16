let threadArr = [];
let threadAmt;
let badComm = ["**Attention! [Serious] Tag Notice**"];
let searchTerm = ['scary', 'creepy', 'paranormal', 'spooky', 'scariest', 'creepiest'];
let scriptAmt = 1;

//Creates interactive section of website
function createInputs(){

    let titleDiv = document.createElement('div');
    titleDiv.classList.add('titleSec');
    document.querySelector('.app').appendChild(titleDiv);
    let titleHead = document.createElement('div');
    titleHead.classList.add('titleHead');
    titleHead.innerHTML = 'No Context Creepy';
    document.querySelector('.titleSec').appendChild(titleHead);

    let searchDiv = document.createElement('div');
    searchDiv.classList.add('searchSec');
    document.querySelector('.app').appendChild(searchDiv);
    let buttonIn = document.createElement('button');
    buttonIn.classList.add('searchButton');
    buttonIn.innerHTML= 'Generate';
    document.querySelector('.searchSec').appendChild(buttonIn);

    let dataArea = document.createElement('div');
    dataArea.classList.add('main');
    document.querySelector('.app').appendChild(dataArea);

}


function searchRedd(){

        threadArr = [];
        let sRand = Math.floor(Math.random()*searchTerm.length);
        let sQuery = searchTerm[sRand];
        let reddScr = document.createElement('script');
        reddScr.src = 'https://www.reddit.com/r/AskReddit/search.json?q='+sQuery+'&sort=random&restrict_sr=1&jsonp=searchCallback';
        document.body.appendChild(reddScr)
}

function searchCallback(data){

    document.querySelector('.main').innerHTML = '';
    threadAmt = data.data.children.length;

    //console.log(data);
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

function commentCallback(data){
    threadArr.push(data);
    if(threadArr.length == threadAmt){
        //console.log(threadArr);
        randComment();
    }
}

function randComment(){

    let goodPick = true;
    let rNum = Math.floor(Math.random() * threadArr.length);
    let crNum = Math.floor(Math.random() * threadArr[rNum][1].data.children.length);
    console.log(threadArr[rNum][0].data.children[0].data.title);
    console.log(threadArr[rNum][1].data.children[crNum].data.body);

    badComm.forEach(element => {
        if(threadArr[rNum][1].data.children[crNum].data.body.slice(0, 35) == element.slice(0,35)){
            goodPick = false;
            randComment();
        }else if(threadArr[rNum][1].data.children[crNum].data.body.length < 40){
            goodPick = false;
            randComment();
        }
    });
    if(goodPick){
        let creepComment = document.createElement('div');
        creepComment.innerHTML = threadArr[rNum][1].data.children[crNum].data.body;
        document.querySelector('.main').appendChild(creepComment);
    }
}

(function initApp(){
    createInputs();
    
    document.querySelector('.searchButton').addEventListener('click', searchRedd);
})()