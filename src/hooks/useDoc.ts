import { db } from "../firebase";
import { useEffect, useReducer } from "react";

export enum DocActions {
  update,
  delete // TODO when needed
}
const documentReducer = (prevState: any, newProps: any) => {
  switch (newProps.action) {
    case DocActions.update:
      prevState.ref.update({ ...newProps.data });
      return { ...prevState, doc: { ...prevState.doc, ...newProps.data } };
    default:
      return { ...prevState, ...newProps };
  }
};
const documentIntialState = {
  path: null,
  prevPath: null,
  doc: null,
  ref: null,
  loading: true
};

const useDoc = (intialOverrides: any) => {
  const [documentState, documentDispatch] = useReducer(documentReducer, {
    ...documentIntialState,
    ...intialOverrides
  });
  const setDocumentListner = () => {
    documentDispatch({ prevPath: documentState.path });
    const unsubscribe = db.doc(documentState.path).onSnapshot(snapshot => {
      if (snapshot.exists) {
        const data = snapshot.data();

        const id = snapshot.id;
        const doc = { ...data, id };
        documentDispatch({
          doc,
          ref: snapshot.ref,
          loading: false
        });
      }
    });
    documentDispatch({ unsubscribe });
  };
  useEffect(() => {
    const { path, prevPath, unsubscribe } = documentState;
    if (path && path !== prevPath) {
      if (unsubscribe) unsubscribe();
      setDocumentListner();
    }
  }, [documentState]);
  useEffect(
    () => () => {
      if (documentState.unsubscribe) documentState.unsubscribe();
    },
    []
  );
  return [documentState, documentDispatch];
};

export default useDoc;