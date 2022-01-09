export const ClientFactory = ({firstname, lastname, email, telephone, telephone2, birthdate, jobtitle, statecode, isfavorite}) => {
    return {
        ...((firstname || firstname === "") && {firstname: firstname}), // only add the property if the parameter is an empty string (not null or undefined)
        ...((lastname || lastname === "") && {lastname: lastname}),
        ...((email || email === "") && {email: email}),
        ...((telephone || telephone === "") && {telephone: telephone}),
        ...((telephone2 || telephone2 === "") && {telephone2: telephone2}),
        ...(birthdate && {birthdate: birthdate}),
        ...((jobtitle || jobtitle === "") && {jobtitle: jobtitle}),
        ...(statecode != null && {statecode: statecode}),   // checks if value is null or undefined
        ...(isfavorite != null && {isfavorite: isfavorite}),
    };
};

export const DefaultClientFactory = () => {
    return {
        firstname: "",
        lastname: "",
        email: "",
        telephone: "",
        telephone2: "",
        birthdate: null,
        jobtitle: "",
        statecode: null,
        isfavorite: false,
    }
};