console.log("Scripts are live on the browser.");

/* Capitalize username when it appears in H2 tags */
let variableHeading = document.querySelector('.variable-heading').innerText;

let capitalizedHeading = null;

function capitalizeFirstLetter(string) {
    return capitalizedHeading = string.charAt(0).toUpperCase() + string.slice(1);
};

capitalizeFirstLetter(variableHeading); 

document.querySelector('.variable-heading').innerText = capitalizedHeading;