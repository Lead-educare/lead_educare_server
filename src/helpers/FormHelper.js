const validator = require('validator');

class FormHelper {
    isEmpty = (value) => {
        return value.trim() === ''
    }
    isEmail = (email) => {
        return validator.isEmail(email);
    }
    isMobile = (mobile)=>{
        return validator.isMobilePhone(mobile)
    }

    isPasswordValid = (password) => {
          return validator.isStrongPassword(password, {
                minLength: 8,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
                minLowercase: 1
            })
    }

    comparePassword = (password, confirmPassword)=>{
        return password === confirmPassword
    }

}

module.exports = new FormHelper();