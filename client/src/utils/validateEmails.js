// seprate module for validating the emails that users add
export default (emails) => {

    const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    
    // trims all the emails we recieve after having split on 
    //the commas which we separate the emails with
    const invalidEmailsArray = emails
                            .split(',')
                            .map(email => email.trim())
                            .filter((email) => {return re.test(email) === false});
                            // filter takes in each email and returns true or false

    if (invalidEmailsArray.length) {
        return `These emails are invalid ${invalidEmailsArray}`;
    }

    return;
}