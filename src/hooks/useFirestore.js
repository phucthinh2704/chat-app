import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";

const useFirestore = (collection, condition) => {
	const [documents, setDocuments] = useState([]);

	useEffect(() => {
		// su dung onSnapshot de lang nghe su thay doi du lieu trong collection
		let collectionRef = db.collection(collection).orderBy("createdAt");

		// neu co condition thi them where vao collectionRef
		if (condition) {
			if (!condition.compareValue || !condition.compareValue.length) {
				return;
			}
			collectionRef = collectionRef.where(
				condition.fieldName,
				condition.operator,
				condition.compareValue
			);
		}
		const unsubscribed = collectionRef.onSnapshot((snapshot) => {
         // snapshot la su thay doi du lieu trong collection
			const documents = snapshot.docs.map((doc) => ({
            // snapshot.docs la mang tat ca cac document trong collection
            // doc la 1 document trong snapshot.docs
            // doc.data(): Tham số này trả về dữ liệu của tài liệu dưới dạng một đối tượng JavaScript, bạn có thể truy cập chúng bằng cách gọi doc.data().uid
            // doc.id: Trả về ID duy nhất của tài liệu trong Firestore
				...doc.data(),
				id: doc.id,
			}));

         // documents la nhung thong tin cua collection nhu user ({ uid, displayName, email, photoURL, providerId })
			setDocuments(documents);
		});

		return () => {
			unsubscribed();
		};
	}, [collection, condition]);

	return documents;
};

export default useFirestore;
