const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#Numbers");
const symbolsCheck = document.querySelector("#Symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generatepassword");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = ['!','@','#','$','%','^','&','*','(',')','_','<','>','{','[','}'];

let password ="";
let passwordLength = "10";
let checkcount = "0"; 
handleSlider();
setIndicator("#ccc");
// set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%";
} 
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}` ; 
}
function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol(){
     return symbols[getRndInteger(0,symbols.length)];
}
function calcStrength(){
    let hasUpper = false; 
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper =true;
    if(lowercaseCheck.checked) hasLower =true;
    if(numbersCheck.checked) hasNum =true;
    if(symbolsCheck.checked) hasSym =true;

    if(hasUpper && hasLower && (hasNum && hasSym) && passwordLength >=8){
        setIndicator("#FF0000");
    }
    else if((hasLower||hasUpper)&&(hasNum ||hasSym)&& passwordLength>=6){
        setIndicator("#0000FF");
    }
    else{
        setIndicator("#00FF00");
    }
}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000); 
}
inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
 });
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
 });
function shufflePassword(array){
    //Fisher yates method
    for(let i = array.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array [j];
        array[j] = temp;
    }
    let str ="";
    array.forEach((el)=>(str+=el));
    return str;
 }
function handleCheckBoxChange(){
    checkcount = 0;
    allCheckBox.forEach((allCheckBox)=>{
        if(allCheckBox.checked)
            checkcount++;
    })
    //special codn.
    if(passwordLength < checkcount){
        passwordLength = checkcount;
        handleSlider();
    }
 }
allCheckBox.forEach( (checkbox) =>{
    checkbox.addEventListener('change',handleCheckBoxChange);
 })
generateBtn.addEventListener('click',()=>{
    if(checkcount == 0) 
        return ;

    if(passwordLength < checkcount){
        passwordLength = checkcount;
        handleSlider();
    }
    //Start
    //remove old password
    password = "";
    //lets put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }
    let funcArr = [];
    if(uppercaseCheck.checked){
       funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
     }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    //compulsary addiiton
    for(let i = 0 ; i<funcArr.length ;i++){
        password += funcArr[i]();
    }
    //remaining adddtition
    for(let i = 0 ; i<passwordLength - funcArr.length;i++){
        let randomIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randomIndex]();
    }
    //shuffel password
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    //calculate strength
    calcStrength();

});





