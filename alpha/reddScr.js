let threadArr = [];
let threadAmt;

function createInputs(){

    let searchDiv = document.createElement('div');
    searchDiv.classList.add('searchArea');
    document.querySelector('.app').appendChild(searchDiv);


    let textIn = document.createElement('input');
    textIn.classList.add('searchText');
    textIn.placeholder = 'Enter text..'
    document.querySelector('.searchArea').appendChild(textIn);

    let buttonIn = document.createElement('button');
    buttonIn.classList.add('searchButton');
    buttonIn.innerHTML= 'Search';
    document.querySelector('.searchArea').appendChild(buttonIn);

    let dataArea = document.createElement('div');
    dataArea.classList.add('main');
    document.querySelector('.app').appendChild(dataArea);

}


function searchReddPass(e){
    if(e.keyCode == 13){
        searchRedd()
    }
}

function searchRedd(){
    if(document.querySelector('.searchText').value.length > 0){
        
        threadArr = [];
        let sQuery = document.querySelector('.searchText').value;
        let reddScr = document.createElement('script');
        reddScr.src = 'https://www.reddit.com/r/AskReddit/search.json?q='+sQuery+'&sort=new&restrict_sr=1&jsonp=searchCallback';
        document.body.appendChild(reddScr)

    }
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

    let rNum = Math.floor(Math.random() * threadArr.length);
    let crNum = Math.floor(Math.random() * threadArr[rNum][1].data.children.length);
    console.log(threadArr[rNum][0].data.children[0].data.title);
    console.log(threadArr[rNum][1].data.children[crNum].data.body);

    let creepComment = document.createElement('div');
    creepComment.innerHTML = threadArr[rNum][1].data.children[crNum].data.body;


    document.querySelector('.main').appendChild(creepComment);
}

(function initApp(){
    createInputs();
    

    document.querySelector('.searchText').addEventListener('keydown', searchReddPass);
    document.querySelector('.searchButton').addEventListener('click', searchRedd);
})()