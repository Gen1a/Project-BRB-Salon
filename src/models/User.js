export const UserFactory = (uid, firstname, lastname, email, telephone) => {
    return {
        uid: uid,
        ...((firstname || firstname === "") && {firstName: firstname}), // only add the property if the parameter is an empty string (not null or undefined)
        ...((lastname || lastname === "") && {lastName: lastname}),
        ...(email && {email: email}),
        ...((telephone || telephone === "") && {telephone: telephone}),
    };
}