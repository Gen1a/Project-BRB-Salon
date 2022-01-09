import { storage } from "./index";
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import { auth } from "./auth";

const rootRef = ref(storage);   // root of Firebase Storage 
const usersRef = ref(rootRef, "users");     // Firebase Storage folder with users content
const clientsRef = ref(rootRef, "clients"); // Firebase Storage folder with clients content

export const updateProfileImage = async (uri) => {
    const currentUserUid = auth.currentUser.uid;    // every user has its own folder in Storage
    if (!currentUserUid) throw new Error("An error occured when trying to get the current user's UID");

    const profileImageRef = ref(usersRef, `${currentUserUid}/profileimage.jpg`);    // 2nd argument is a path to the file
    console.log(`Creating a new file with path '${profileImageRef.fullPath}'`);

    // Get a blob of the file (https://github.com/expo/expo/issues/2402#issuecomment-443726662)
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true); // async request
        xhr.send(null);
    });

    const uploadResult = await uploadBytes(profileImageRef, blob);
    blob.close();

    return await getDownloadURL(uploadResult.ref);
}

export const getProfileImageURL = async () => {
    const currentUserUid = auth.currentUser.uid;    // every user has its own folder in Storage
    if (!currentUserUid) throw new Error("An error occured when trying to get the current user's UID");

    try {
        const profileImageRef = ref(usersRef, `${currentUserUid}/profileimage.jpg`);    // 2nd argument is a path to the file
        console.log(`Getting the URL of the current user's profile image`);
        return await getDownloadURL(profileImageRef);
    } catch (error) {
        console.log(error.code);
        return "";
        //throw new Error("An error occurred when trying to get the current user's profile image URL");
    }
}