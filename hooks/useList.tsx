import { useState, useEffect } from "react";
import { Movie } from "../typings";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";

function useList(uid: string | undefined) {
  const [list, setList] = useState<Movie[] | DocumentData[]>([]);

  useEffect(() => {
    if (!uid) return;

    return onSnapshot(
      //collection accepts the db instance, goes into collection of customers, goes inside the document of that user and creates "myList" and get a snapshot back
      collection(db, "customers", uid, "myList"),
      (snapshot) => {
        setList(
          //merging the ID with the data
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      }
    );
  }, [db, uid]);

  return list;
}

export default useList;
