import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import ListingItem from "../components/ListingItem";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Slider from "../components/Slider";
import { db } from "../firebase";
import { Link } from "react-router-dom";
export default function Home() {
  //Offer
  const [offerListings, setOfferListing] = useState(null);
  useEffect(() => {
    async function fetchListing() {
      try {
        // get reference
        const listingRef = collection(db, "listings");
        // create query
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        //execute query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListing(listings);
      } catch (error) {
        toast.error("error");
      }
    }
    fetchListing();
  }, []);

  //rent
  const [rentListings, setRentListing] = useState(null);
  useEffect(() => {
    async function fetchListing() {
      try {
        // get reference
        const listingRef = collection(db, "listings");
        // create query
        const q = query(
          listingRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        //execute query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListing(listings);
      } catch (error) {
        console.log(error);
        toast.error("error");
      }
    }
    fetchListing();
  }, []);

  //Sane
  const [saleListings, setSaleListing] = useState(null);
  useEffect(() => {
    async function fetchListing() {
      try {
        // get reference
        const listingRef = collection(db, "listings");
        // create query
        const q = query(
          listingRef,
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        //execute query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSaleListing(listings);
      } catch (error) {
        console.log(error);
        toast.error("error");
      }
    }
    fetchListing();
  }, []);
  return (
    <>
      <Slider />
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {offerListings && offerListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="font-semibold text-2xl mt-6">Recent Offer</h2>
            <Link to="/offers">
              <p
                className="px-3 text-sm text-bleu-600
                 hover:text-blue-800 transition duration-150 ease-in-out"
              >
                Show more offers
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {offerListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="font-semibold text-2xl mt-6">Place for rent</h2>
            <Link to="/category/rent">
              <p
                className="px-3 text-sm text-bleu-600
                 hover:text-blue-800 transition duration-150 ease-in-out"
              >
                Show more place for rent
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {rentListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="font-semibold text-2xl mt-6">Place for sale</h2>
            <Link to="/category/rent">
              <p
                className="px-3 text-sm text-bleu-600
                 hover:text-blue-800 transition duration-150 ease-in-out"
              >
                Show more place for sale
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {saleListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );

  // const intl = useIntl();
  // return (
  //   <div className="container mt">
  //     {/* ... */}

  //     <FormattedDate value={Date.now()} />
  //     <br />
  //     <FormattedNumber value={2000} />
  //     <br />
  //     {intl.formatNumber(2000)}
  //     <br />
  //     <FormattedPlural value={4} one="1 click" other="5 clicks" />
  //     <br />
  //     {intl.formatPlural(1)}
  //     <br />
  //     <FormattedPlural value={4} one="1 click" other="5 clicks" />
  //     <br />
  //     <FormattedNumber value={2000} style={`currency`} currency="USD" />
  //     <br />
  //     <input placeholder={intl.formatDate(Date.now())} />
  //     <br />
  //     <input
  //       placeholder={intl.formatDate(Date.now(), {
  //         year: "numeric",
  //         month: "long",
  //         day: "2-digit",
  //       })}
  //     />
  //     <br />
  //     <input placeholder={intl.formatMessage({ id: "app.header" })} />
  //   </div>
  // );
}
