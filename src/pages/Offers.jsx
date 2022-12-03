import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

export default function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchListing, setLastFetchListing] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        const listRef = collection(db, "listings");
        const q = query(
          listRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(8)
        );
        const querySnap = await getDocs(q);
        // keep index of last position
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchListing(lastVisible);
        const list = [];
        querySnap.forEach((doc) => {
          list.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(list);
        setLoading(false);
      } catch (error) {
        toast.error("could not fetch offers");
      }
    }
    fetchListings();
  }, []);
  async function onFetchMoreListing(e) {
    try {
      const listRef = collection(db, "listings");
      const q = query(
        listRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchListing),
        limit(4)
      );
      const querySnap = await getDocs(q);
      // keep index of last position
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      
      setLastFetchListing(lastVisible);
      const list = [];
      querySnap.forEach((doc) => {
        list.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings((prev) => [...prev, ...list]);
      setLoading(false);
    } catch (error) {
      toast.error("could not fetch offers");
    }
  }
  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center mt-6  font-bold mb-6">Offers</h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            {/* main tag */}
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {/* unordered list */}
              {listings.map((elm) => (
                <ListingItem key={elm.id} id={elm.id} listing={elm.data} />
              ))}
            </ul>
          </main>
          {lastFetchListing && (
            <div className="flex justify-center items-center">
              <button
                onClick={onFetchMoreListing}
                className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300   mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out"
              >
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <p>there are no current offers</p>
      )}
    </div>
  );
}
