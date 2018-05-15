

function createInputs(){

    let textIn = document.createElement('input');
    textIn.classList.add('searchText');
    textIn.placeholder = 'Enter text..'
    document.querySelector('.app').appendChild(textIn);

    let buttonIn = document.createElement('button');
    buttonIn.classList.add('searchButton');
    buttonIn.innerHTML= 'Search';
    document.querySelector('.app').appendChild(buttonIn);

    
}

function searchReddPass(e){
    if(e.keyCode == 13){
        searchRedd()
    }
}

function searchRedd(){
    if(document.querySelector('.searchText').value.length > 0){
        console.log('sup')
    }
}

(function initApp(){
    createInputs();

    document.querySelector('.searchText').addEventListener('keydown', searchReddPass);
    document.querySelector('.searchButton').addEventListener('click', searchRedd);
})()