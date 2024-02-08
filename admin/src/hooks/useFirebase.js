import { useState, useEffect, useRef, useContext } from 'react';
import { geocodeByPlaceId, getLatLng } from 'react-google-places-autocomplete';
import { db, firebase } from '../config/firebase';

const useFirbase = () => {
	const [location, setLocation] = useState();
	const [locationData, setLocationData] = useState(null);
	const [addressComponent, setAddressComponent] = useState({});

	const addChatToInbox = async (recId, senderObj, receiverObj) => {
		await db.collection(userId).doc(recId).set(senderObj);
		await db.collection(recId).doc(userId).set(receiverObj);
	};

	const addMessageToChat = async (recId, obj) => {
		const timestamp = new Date().getTime();
		await firestore
			.collection(`${userId}_${recId}`)
			.doc(timestamp.toString())
			.set(obj);
		await firestore
			.collection(`${recId}_${userId}`)
			.doc(timestamp.toString())
			.set(obj);
	};

	return { addChatToInbox, addMessageToChat };
};

export default useLocation;
