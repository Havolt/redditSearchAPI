

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


(function initApp(){
    console.log('hi');
    createInputs();
})()