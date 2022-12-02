import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import {
  getDownloadURL, getStorage,
  ref,
  uploadBytesResumable
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

export default function EditListing() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [geolocationEnable, setGeolocationEnable] = useState(false);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    packing: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const params = useParams();

  useEffect(() => {
    setLoading(true);
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exist");
      }
    }
    fetchListing();
  }, [params, navigate]);
  useEffect(() => {
    // console.log(formData.userRef);
    console.log(auth.currentUser.uid);
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You can't edit this listing");
      navigate("/");
    }
  }, [navigate, listing, auth,]);
  const [loading, setLoading] = useState(false);
  //destructuring
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    packing,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;
  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    // Files
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: e.target.files,
      }));
    }
    // Text/boolean/number
    if (!e.target.files) {
      setFormData((prev) => ({
        ...prev,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted price less than regular price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum 6 images are allowed");
    }
    let geolocation = {};
    let location;
    if (geolocationEnable) {
      const response = await fetch(
        `http://address?key=${address}&key1=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = await response.json;
      geolocation.lat = data.result[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.result[0]?.geometry.location.lng ?? 0;

      location = data.status === "ZERO_RESULTS" && undefined;
      if (location === undefined) {
        setLoading(false);
        toast.error("Please enter the correct address");
        return;
      }
    }
    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            reject(error);
            switch (error.code) {
              case "storage/unauthorized":
                // User doesn't have permission to access the object
                break;
              case "storage/canceled":
                // User canceled the upload
                break;

              // ...

              case "storage/unknown":
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls: imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing Updated successfully");
    navigate(`/category/${formData.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Edit a listing</h1>
      <form onSubmit={onSubmit}>
        <p className="text-lg mt-6 font-semibold">Sell or Rent</p>
        <div className="flex">
          <button
            type="button"
            id="type"
            value="sale"
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase rounded 
            hover:shadow-lg focus:shadow-lg active:shadow-lg transition
             duration-150 ease-in-out w-full ${
               type === "rent"
                 ? "bg-white text-black"
                 : "bg-slate-600 text-white"
             }`}
          >
            Sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase rounded 
            hover:shadow-lg focus:shadow-lg active:shadow-lg transition
             duration-150 ease-in-out w-full ${
               type === "sale"
                 ? "bg-white text-black"
                 : "bg-slate-600 text-white"
             }`}
          >
            Rent
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Full Name"
          maxLength="32"
          minLength="10"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white 
          focus:border-slate-600 mb-6"
        />
        <div className="flex space-x-6 mb-6">
          <div>
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-xl text-gray-300 bg-white border-gray-700
              rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white
               focus:border-slate-600 text-center"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-xl text-gray-300 bg-white border-gray-700
              rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white
               focus:border-slate-600 text-center"
            />
          </div>
        </div>
        <p className="text-lg mt-6 font-semibold">Packing spot</p>
        <div className="flex">
          <button
            type="button"
            id="packing"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase rounded 
            hover:shadow-lg focus:shadow-lg active:shadow-lg transition
             duration-150 ease-in-out w-full ${
               !packing ? "bg-white text-black" : "bg-slate-600 text-white"
             }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="packing"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase rounded 
            hover:shadow-lg focus:shadow-lg active:shadow-lg transition
             duration-150 ease-in-out w-full ${
               packing ? "bg-white text-black" : "bg-slate-600 text-white"
             }`}
          >
            no
          </button>
        </div>
        <p className="text-lg font-semibold">Furnished</p>
        <div className="flex">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase rounded 
            hover:shadow-lg focus:shadow-lg active:shadow-lg transition
             duration-150 ease-in-out w-full ${
               !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
             }`}
          >
            yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase rounded 
            hover:shadow-lg focus:shadow-lg active:shadow-lg transition
             duration-150 ease-in-out w-full ${
               furnished ? "bg-white text-black" : "bg-slate-600 text-white"
             }`}
          >
            no
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="Address"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white 
          focus:border-slate-600 mb-6"
        />
        {!geolocationEnable && (
          <div className="flex space-x-6 justify-start mb-6">
            <div className="">
              <p className="text-lg font-semibold">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                required
                min="-90"
                mix="90"
                className="w-full px-4 py-3 text-xl text-gray-700 bg-white border border-gray-300 rounded transition
                 duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
              />
            </div>
            <div className="">
              <p className="text-lg font-semibold">Longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                required
                min="-180"
                mix="180"
                className="w-full px-4 py-3 text-xl text-gray-700 bg-white border border-gray-300 rounded transition
                 duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
              />
            </div>
          </div>
        )}
        <p className="text-lg font-semibold">Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Description"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white 
          focus:border-slate-600 mb-6"
        />
        <p className="text-lg font-semibold">Offer</p>
        <div className="flex mb-6">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase rounded 
            hover:shadow-lg focus:shadow-lg active:shadow-lg transition
             duration-150 ease-in-out w-full ${
               !offer ? "bg-white text-black" : "bg-slate-600 text-white"
             }`}
          >
            yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase rounded 
            hover:shadow-lg focus:shadow-lg active:shadow-lg transition
             duration-150 ease-in-out w-full ${
               offer ? "bg-white text-black" : "bg-slate-600 text-white"
             }`}
          >
            no
          </button>
        </div>
        <div className="mb-6">
          <div className="text-lg font-semibold ">
            <p>Regular Price</p>
            <div className="flex justify-center items-center space-x-6">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="50"
                max="40000000"
                required
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border
              border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white
              focus:border-slate-600 text-center"
              />
              {type === "rent" && (
                <div className="">
                  <p className="text-md w-full whitespace-nowrap">$ / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div className="mb-6">
            <div className="text-lg font-semibold ">
              <p>Discounted Price</p>
              <div className="flex justify-center items-center space-x-6">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  min="50"
                  max="40000000"
                  required={offer}
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border
                border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white
                focus:border-slate-600 text-center"
                />
                {type === "rent" && (
                  <div className="">
                    <p className="text-md w-full whitespace-nowrap">
                      $ / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <p className="mb-6 text-lg font-semibold">Images</p>
          <p className="text-gray-600">
            the first image would be the cover (max 6)
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 bg-white border
             border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white
             focus:border-slate-600 "
          />
        </div>
        <button
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium
        text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700
        focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Edit Listing
        </button>
      </form>
    </main>
  );
}
