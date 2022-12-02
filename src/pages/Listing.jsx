import { doc, getDoc } from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { useParams } from "react-router";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";
import { useIntl } from "react-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import { FaShare } from "react-icons/fa";
import Contact from "../components/Contact";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
export default function Listing() {
  const auth = getAuth();
  const intl = useIntl();
  const param = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactLandLord, setContactLandLoad] = useState(false);
  SwiperCore.use([Autoplay, Navigation, Pagination]);
  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", param.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        //first time at startup and second time when listing is set
        setListing(docSnap.data());
        setLoading(false);
      }
    }
    fetchListing();
  }, [param.listingId]); //its the listener of the function

  if (loading) {
    return <Spinner />;
  }
  return (
    <div>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px] "
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="fixed  top-[13%] right-[3%] z-20 bg-white cursor-pointer border-2 border-gray-200
      rounded-full w-12 h-12 flex justify-center items-center"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <FaShare className="text-lg text-slate-500" />
      </div>
      {shareLinkCopied && (
        <p
          className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 
        rounded-md bg-white z-10 p-2"
        >
          Link copied
        </p>
      )}
      <div
        className="flex flex-col md:flex-row max-w-6xl m-4 lg:mx-auto
        p-4 rounded-lg lg:space-x-5 shadow-lg bg-white"
      >
        <div className="  w-full ">
          <p className="text-2xl font-bold mb-3 text-blue-900">
            {listing.name} {" - "}
            {intl.formatNumber(
              listing.offer ? listing.discountedPrice : listing.regularPrice,
              { currency: "USD", style: "currency" }
            )}
            {listing.type === "rent" ? " / month" : ""}
          </p>
          <p className="flex items-center mb-3 mt-6 font-semibold">
            <FaMapMarkerAlt className="text-green-700 mr-1" /> {listing.address}
          </p>
          <div className="flex justify-start space-x-4 w-[75%] item-center">
            <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md  ">
              {listing.type === "rent" ? "Rent" : "Sale"}
            </p>
            <p className="bg-green-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md ">
              {listing.offer && (
                <>
                  {intl.formatNumber(
                    listing.regularPrice - listing.discountedPrice,
                    { currency: "USD", style: "currency" }
                  )}{" "}
                  discount
                </>
              )}
            </p>
          </div>
          <p className="my-3">
            <span className="font-semibold">Description -</span>
            {listing.description}
          </p>
          <ul className="flex items-center space-x-2 lg:space-x-10 text-sm font-semibold mb-6 ">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-1" />
              {`${listing.bedrooms} Bed${listing.bedrooms > 1 ? "s" : ""}`}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-1" />
              {`${listing.bathrooms} Bath${listing.bathrooms > 1 ? "s" : ""}`}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-1" />
              {` ${listing.packing ? "Parking spot" : "No parking"}`}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaChair className="text-lg mr-1" />
              {` ${listing.furnished ? " Furnished" : " Not furnished"}`}
            </li>
          </ul>
          {/* {(auth.currentUser !== null) && (listing.userRef !== auth.currentUser?.uid) && ( */}
          {listing.userRef !== auth.currentUser?.uid && !contactLandLord && (
            <div className="mt-6">
              <button
                onClick={() => setContactLandLoad(true)}
                className="px-7  py-3 bg-blue-600 text-white font-medium text-sm uppercase
                            rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 
                         focus:shadow-lg w-full text-center transition duration-150 ease-in-out"
              >
                Contact Landlord
              </button>
            </div>
          )}
          {contactLandLord && (
            <Contact listing={listing} userRef={listing.userRef} />
          )}
        </div>
        <div className="  w-full md:h-[400px] h-[200px] z-10 overflow-x-hidden mt-6 lg:mt-0 md:ml-2 ">
          <MapContainer
            center={[
              // listing?.geolocation.lat ?? 0,
              // listing?.geolocation.lat ?? 0,
              4.092440026644071, 9.746377110608071
            ]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[
                // listing?.geolocation.lat ?? 0,
                // listing?.geolocation.lng ?? 0,
                4.092440026644071, 9.746377110608071
              ]}
            >
              <Popup>
                {listing.address}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
