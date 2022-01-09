import { firestore } from "../firebase/index";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, orderBy, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";

export const updateClientsTelephoneArrays = async () => {
    console.log("updateClientsTelephoneArrays executed...");

    const clientsRef = collection(firestore, "clients");
    const q = query(clientsRef, where("telephone", "!=", ""));
    const querySnapshot = await getDocs(q);

    querySnapshot.docs.forEach(doc => {
        const { telephone } = doc.data();
        let telephoneArray = [];
        console.log(telephone);
        let counter = 0;
        for(let x = 1; x <= telephone.length; x++){
            counter++;
            for (let i = 0; i < telephone.length; i++){
                counter++;
                let slice = telephone.slice(telephone.length - x - i, telephone.length - i);
                if (slice && !Number.isNaN(slice) && !telephoneArray.includes(slice)) telephoneArray.push(slice);
            }
        }
        console.log("looped: " + counter);
        //updateDoc(doc.ref, { telephoneArray: telephoneArray});
    })
}