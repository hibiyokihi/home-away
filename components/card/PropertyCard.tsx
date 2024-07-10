import Image from 'next/image';
import Link from 'next/link';
import CountryFlagAndName from './CountryFlagAndName';
import PropertyRating from './PropertyRating';
import FavoriteToggleButton from './FavoriteToggleButton';
import { PropertyCardProps } from '@/utils/types';
import { formatCurrency } from '@/utils/format';

function PropertyCard({ property }: { property: PropertyCardProps }) {
  const { name, image, price } = property;
  const { country, id: propertyId, tagline } = property;

  return (
    <article className="group relative">
      <Link href={`/properties/${propertyId}`}>
        <div className="relative h-[300px] mb-2 overflow-hidden rounded-md">
          <Image
            src={image}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
            // width768pxまでは100vw, 1200pxまでは50vw
            alt={name}
            className="rounded-md object-cover transform group-hover:scale-110 transition-transform duration-500"
            // articleにgroupのクラスを付けてるから、group-hoverはarticle内のどこからhoverしたらscaleする
          />
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold mt-1">
            {name.substring(0, 30)}
          </h3>
          <PropertyRating inPage={false} propertyId={propertyId} />
        </div>
        <p className="text-sm mt-1 text-muted-foreground ">
          {tagline.substring(0, 40)}
        </p>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm mt-1 ">
            <span className="font-semibold">{formatCurrency(price)} </span>
            night
          </p>
          <CountryFlagAndName countryCode={country} />
        </div>
      </Link>
      <div className="absolute top-5 right-5 z-5">
        <FavoriteToggleButton propertyId={propertyId} />
      </div>
      {/* お気に入りボタンをLinkの外に置くことで、お気に入りを押しても詳細ページには飛ばないようにできる */}
    </article>
  );
}
export default PropertyCard;
