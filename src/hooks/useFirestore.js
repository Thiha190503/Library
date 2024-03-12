import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../firebase";

export default function useFirestore() {
  let useGetCollection = (colName, _q, search) => {
    let qRef = useRef(_q).current;
    let [data, setData] = useState([]);
    let [error, setError] = useState("");
    let [loading, setLoading] = useState(false);

    useEffect(
      function () {
        setLoading(true);
        let ref = collection(db, colName);

        // For Queries
        let qureires = [];
        if (qRef) {
          qureires.push(where(...qRef));
        }
        qureires.push(orderBy("date", "desc"));
        let q = query(ref, ...qureires);

        // For Get Collection
        onSnapshot(q, (docs) => {
          if (docs.empty) {
            setError("no documents found");
            setLoading(false);
            setData([]); // *
          } else {
            let collectionDatas = [];
            docs.forEach((doc) => {
              let document = { id: doc.id, ...doc.data() };
              collectionDatas.push(document);
            });

            // For Search
            if (search?.field && search?.value) {
              let searchedDatas = collectionDatas.filter((doc) => {
                return doc[search?.field].includes(search?.value);
              });
              setData(searchedDatas);
            } else {
              setData(collectionDatas);
            }
            setLoading(false);
            setError("");
          }
        });
      },
      [colName, qRef, search?.field, search?.value]
    );

    return { error, data, loading };
  };

  let useGetDocument = (colName, id) => {
    let [data, setData] = useState(null);
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState("");

    useEffect(() => {
      setLoading(true);
      let ref = doc(db, colName, id);
      onSnapshot(ref, (doc) => {
        if (doc.exists()) {
          let document = { id: doc.id, ...doc.data() };
          setData(document);
          setLoading(false);
          setError("");
        } else {
          setLoading(false);
          setError("no document found");
        }
      });
    }, [colName, id]);

    return { error, loading, data };
  };

  let useAddCollection = async (colName, data) => {
    data.date = serverTimestamp();
    let ref = collection(db, colName);
    return addDoc(ref, data);
  };

  let useDeleteDocument = async (colName, id) => {
    let ref = doc(db, colName, id);
    return deleteDoc(ref); //backend delete
  };

  let useUpdateDocument = async (colName, id, data, updateDate = true) => {
    if (updateDate) {
      data.date = serverTimestamp();
    }
    let ref = doc(db, colName, id);
    return updateDoc(ref, data);
  };

  return {
    useGetCollection,
    useAddCollection,
    useDeleteDocument,
    useUpdateDocument,
    useGetDocument,
  };
}
