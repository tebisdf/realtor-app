import { React, useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import {
  useIntl,
  FormattedDate,
  FormattedNumber,
  FormattedPlural,
} from "react-intl";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import "swiper/css/bundle";
import { useNavigate } from "react-router-dom";
import SwiperCore, {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
export default function Slider() {
    const intl = useIntl();
    //without putting function, the method is not call
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  SwiperCore.use([Pagination, Navigation, Autoplay]);
  useEffect(() => {
    async function fetchListings() {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);
      let listing = [];
      querySnap.forEach((doc) => {
        listing.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listing);
      setLoading(false);
    }
    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (listings.length === 0) {
    return <></>;
  }
  return (
    listings && (
      <>
        <Swiper
          slidesPerView={1}
          navigation
          pagination={{ type: "progressbar" }}
          effect="fade"
          modules={[EffectFade]}
          autoplay={{ delay: 3000 }}
        >
          {listings
            .filter(({ data }) => data.imgUrls !== undefined)
            .map(({ data, id }) => {
              return (
                <SwiperSlide
                  key={id}
                  onClick={() => navigate(`category/${data.type}/${id}`)}
                >
                  <div
                    style={{
                      background: `url(${data.imgUrls[0]}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                    className="relative w-full h-[300px] over-flow-hidden"
                  ></div>
                  <p
                    className="text-[#f1feaa] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] 
                  shadow-lg opacity-90 p-2 rounded-br-3xl "
                  >
                    {data.name}
                  </p>
                  <p
                    className="text-[#f1feaa] absolute left-1 bottom-3 font-sembold max-w-[90%] bg-[#e63946] 
                  shadow-lg opacity-90 p-2 rounded-tr-3xl "
                  >
                    {intl.formatNumber(data.discountPrice ?? data.regularPrice,{currency:"USD",style:'currency'})}
                    {data.type === "rent" && " / Month"}
                  </p>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </>
    )
  );
}
