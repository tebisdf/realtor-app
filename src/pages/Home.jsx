import Slider from "../components/Slider";
export default function Home() {
  return (
    <>
      <Slider />
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
