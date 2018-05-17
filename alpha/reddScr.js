let threadArr = [];
let threadAmt;
//Array of terms that should return bad request
let badComm = ["**Attention! [Serious] Tag Notice**"];
//Search terms that are used to search reddit for relevant thread   
let searchTerm = ['scary', 'creepy', 'paranormal', 'spooky', 'scariest', 'creepiest'];
let scriptAmt = 1;

//List of elements to be created using createEl function
let elementsData = [
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
    document.querySelector(obj.append).appendChild(newEl);
}

//Creates interactive section of website
function createInputs(){

    elementsData.forEach(element => {
        createEl(element);
    });

}

//Gets a random set of 25 threads from askreddit
function searchRedd(){

        threadArr = [];
        let sRand = Math.floor(Math.random()*searchTerm.length);
        let sQuery = searchTerm[sRand];
        let reddScr = document.createElement('script');
        reddScr.src = 'https://www.reddit.com/r/AskReddit/search.json?q='+sQuery+'&sort=random&restrict_sr=1&jsonp=searchCallback';
        document.body.appendChild(reddScr)
}

//The callback function in jsonp from reddit server
function searchCallback(data){
    document.querySelector('.mainText').innerHTML = '';
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

//Retrieves comment from threadArr
function commentCallback(data){
    threadArr.push(data);
    if(threadArr.length == threadAmt){
        //console.log(threadArr);
        console.log(document.querySelectorAll('script'));
        for(let i = document.querySelectorAll('script').length-1; i >= scriptAmt ; i--){
            document.querySelectorAll('script')[i].parentNode.removeChild(document.querySelectorAll('script')[i]);
        }
        randComment();
    }
}

//Checks if comment is good and if so displays it to user
function randComment(){
    let goodPick = true;
    let rNum = Math.floor(Math.random() * threadArr.length);
    let crNum = Math.floor(Math.random() * threadArr[rNum][1].data.children.length);
    //console.log(threadArr[rNum][0].data.children[0].data.title);

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
    }
}


//Initializes application
(function initApp(){
    createInputs();
    document.querySelector('.searchButton').addEventListener('click', searchRedd);
})()