function Validater(options) {
    var formElement = document.querySelector(options.form)
    var errorElement = document.querySelector(options.errorMessage)

    if (!formElement)
        return

    function getParentElement(inputElement, selecter = options.formGroupSelector) {
        while (inputElement.parentElement) {
            inputElement = inputElement.parentElement
            if (inputElement.classList.contains(selecter)) {
                return inputElement
            }
        }
    }

    /* alle options.rules in selectorRules gruppieren */
    var selectorRules = [];
    options.rules.forEach((rule) => {
        if (Array.isArray(selectorRules[rule.selecter])) {
            selectorRules[rule.selecter].push(rule)
        }
        else {
            selectorRules[rule.selecter] = [rule]
        }
    })



    function validate(inputElement, selecter) {
        /* 
          ein Element hat ein Rule oder mehrere Rules
          alle Rules des Elements durchlaufen, 
        */

        var errorMessage
        var parentElement
        var errorElement
        var rules = selectorRules[selecter]
        var len = rules.length

        for (var i = 0; i < len; i++) {
            let valueInputElement = ''
            parentElement = getParentElement(inputElement)
            errorElement = parentElement ? parentElement.querySelector(options.errorSelecter) : undefined
            if (errorElement) {
                switch (inputElement.type) {
                    case 'radio':
                    case 'checkbox':
                        try {
                            valueInputElement = parentElement.querySelector(selecter + ':checked').value
                        } catch (error) {

                        }
                        break
                    default:
                        valueInputElement = inputElement.value
                }
                errorMessage = rules[i].test(valueInputElement)
                errorElement.innerText = errorMessage || ''

                if (errorMessage)
                    break
            }
        }

        errorMessage ? parentElement.classList.add('invalid') : parentElement.classList.remove('invalid')

        return !errorMessage

    }


    // onblur and oninput all element
    options.rules.forEach((rule) => {
        var inputElement = document.querySelector(rule.selecter)

        // onblur 
        if (inputElement) {
            inputElement.onblur = function () {
                validate(inputElement, rule.selecter);
            }

            inputElement.oninput = function () {
                var parentElement = getParentElement(inputElement)
                var errorElement = parentElement ? parentElement.querySelector(options.errorSelecter) : undefined
                if (errorElement) {
                    errorElement.innerText = ''
                    parentElement.classList.remove('invalid')
                }
            }

        }
    })


    /* form submit => validate all elements, 
     sende data
    */
    formElement.onsubmit = function (e) {
        var isFormValided = true
        e.preventDefault()

        // Eingabe aller Elements prüfen
        Object.keys(selectorRules).forEach(selecter => {
            var inputElement = formElement.querySelector(`${selecter}:not(:disabled)`)
            if (inputElement) {
                isFormValided = validate(inputElement, selecter) && isFormValided
            }
        })

        // Data senden
        if (isFormValided) {
            // wenn onsubmit als function definiert (javascript)  
            if (typeof options.onsubmit == 'function') {
                var enableInputs = formElement.querySelectorAll('[name]');
                var formValues = Array.from(enableInputs).reduce(function (values, input) {
                    switch (input.type) {
                        case 'radio':
                            if (input.checked)
                                values[input.name] = input.value
                            else if (values[input.name] == undefined)
                                values[input.name] = ''
                            break;

                        case 'checkbox':
                            if (!input.matches(':checked')) {
                                values[input.name] = '';
                                return values;
                            }
                            if (!Array.isArray(values[input.name])) {
                                values[input.name] = [];
                            }
                            values[input.name].push(input.value);
                            break;
                        case 'file':
                            values[input.name] = input.files;
                            break;
                        default:
                            values[input.name] = input.value;
                    }

                    return values;
                }, {});
                options.onsubmit(formValues);
            }
            // als standard form-submit
            else {
                formElement.submit()
            }
        }

    }
}


Validater.isRequired = function (selecter, errorMessage) {
    return {
        selecter,
        test: function (value) {
            return value ? undefined : (errorMessage || 'It muss not empty')
        }
    }
}

Validater.isMinLength = function (selecter, minLength, errorMessage) {
    return {
        selecter,
        test: function (value) {
            return value.length >= minLength ? undefined : (errorMessage || `Password muss grather than  ${minLength}`)
        }
    }
}

Validater.isConfirm = function (selecter, getConfirmValue, errorMessage) {
    return {
        selecter,
        test: function (value) {
            return value == getConfirmValue() ? undefined : (errorMessage || 'Password is not equal')
        }
    }
}

Validater.isEmail = function (selecter, errorMessage) {
    return {
        selecter,
        test: function (value) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(value.toLowerCase()) ? undefined : (errorMessage || 'Email is not correct')
        }
    }
}






