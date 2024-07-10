import FavoriteToggleButton from '@/components/card/FavoriteToggleButton';
import PropertyRating from '@/components/card/PropertyRating';
import Amenities from '@/components/properties/Amenities';
import BookingCalendar from '@/components/properties/BookingCalendar';
import BreadCrumbs from '@/components/properties/BreadCrumbs';
import Description from '@/components/properties/Description';
import ImageContainer from '@/components/properties/ImageContainer';
import PropertyDetails from '@/components/properties/PropertyDetails';
import ShareButton from '@/components/properties/ShareButton';
import UserInfo from '@/components/properties/UserInfo';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchPropertyDetails } from '@/utils/actions';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

const DynamicMap = dynamic(
  // nextjsは、基本的にserver-sideでhtmlを作ってからfrontに渡す。client-componentも、可能は範囲でhtmlを作ろうとする
  // しかし、dynamic関数で作ったコンポーネントについては、server側ではタッチしない。front側に全て任せる。
  // front側に依存するライブラリを使う際など、server側で関わるとエラーになるケースもあるからdynamicを使う
  // ssr: falseも合わせてセットする。Server-Side-Renderingをfalseに。
  () => import('@/components/properties/PropertyMap'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full" />,
  }
);

async function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const property = await fetchPropertyDetails(params.id);
  if (!property) redirect('/');
  const { baths, bedrooms, beds, guests } = property;
  const details = { baths, bedrooms, beds, guests };
  // propertyには全てのフィールドが含まれる。限定してdestructureして、これをdetailsオブジェクトに入れ直す
  const firstName = property.profile.firstName;
  const profileImage = property.profile.profileImage;

  return (
    <section>
      <BreadCrumbs name={property.name} />
      <header className="flex justify-between items-center mt-4">
        <h1 className="text-4xl font-bold capitalize">{property.tagline}</h1>
        <div className="flex items-center gap-x-4">
          <ShareButton name={property.name} propertyId={property.id} />
          <FavoriteToggleButton propertyId={property.id} />
        </div>
      </header>
      <ImageContainer mainImage={property.image} name={property.name} />
      <section className="lg:grid lg:grid-cols-12 gap-x-12 mt-12">
        <div className="lg:col-span-8">
          <div className="flex gap-x-4 items-center">
            <h1 className="text-xl font-bold">{property.name}</h1>
            <PropertyRating inPage propertyId={property.id} />
          </div>
          <PropertyDetails details={details} />
          <UserInfo profile={{ firstName, profileImage }} />
          <Separator className="mt-4" />
          <Description description={property.description} />
          <Amenities amenities={property.amenities} />
          <DynamicMap countryCode={property.country} />
        </div>
        <div className="lg:col-span-4 flex flex-col items-center">
          <BookingCalendar />
        </div>
      </section>
    </section>
  );
}
export default PropertyDetailsPage;
