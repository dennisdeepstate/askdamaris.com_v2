/**
 * @param {string} title
 * @param {string} input
 */
function validateInput(title, input){
    if(title==="name"){ 
        return /^[A-Za-z][A-Za-z\'\-]+([\ A-Za-z][A-Za-z\'\-]+)*/.test(input)
    }
    if(title==="email") {
        return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(input)
    }
    if(title==="password"){
        return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*()<>_=+'";:{},[.`~\]\-\/\\\|]).{8,}$/.test(input)
    }
    if(title==="phone"){
        return /^254\d{9}$/.test(input)
    }
}

export {
    validateInput
}