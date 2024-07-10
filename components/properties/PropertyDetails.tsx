import { formatQuantity } from '@/utils/format';

type PropertyDetailsProps = {
  details: {
    bedrooms: number;
    baths: number;
    guests: number;
    beds: number;
  };
};

function PropertyDetails({
  details: { bedrooms, baths, guests, beds },
}: PropertyDetailsProps) {
  // propsからdetailsをdestructureして、違う名前をつけたい場合、{details: someDetails}のようにできる
  // これを応用して、aliasではなくdetailsを更にdestructureした形で使えるようにする文法
  // typeを書く際は、detailsもキーに含める必要がある点に注意
  return (
    <p className="text-md font-light ">
      <span>{formatQuantity(bedrooms, 'bedroom')} &middot; </span>
      {/* &middot; は、・をhtmlで表示するためのもの */}
      <span>{formatQuantity(baths, 'bath')} &middot; </span>
      <span>{formatQuantity(guests, 'guest')} &middot; </span>
      <span>{formatQuantity(beds, 'bed')}</span>
    </p>
  );
}
export default PropertyDetails;