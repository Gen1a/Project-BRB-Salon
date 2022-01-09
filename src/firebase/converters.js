export const formatFirstName = (input) => {
    if (!input) return "";
    else {
        return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    }
}

export const formatLastName = (input) => {
    if (!input) return "";
    else {
        return input.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    }
}

export const transformTelephoneToArray = (telephone) => {
    if (!telephone) return [];
    else {
        let telephoneArray = [];
        let counter = 0;
        for(let x = 1; x <= telephone.length; x++){
            counter++;
            for (let i = 0; i < telephone.length; i++){
                counter++;
                let slice = telephone.slice(telephone.length - x - i, telephone.length - i);
                if (slice && !Number.isNaN(slice) && !telephoneArray.includes(slice)) telephoneArray.push(slice);
            }
        }

        return telephoneArray;
    }
}