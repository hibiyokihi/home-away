import { fetchProperties } from '@/utils/actions';
import PropertiesList from './PropertiesList';
import EmptyList from './EmptyList';
import type { PropertyCardProps } from '@/utils/types';

async function PropertiesContainer({
  category,
  search,
}: {
  category?: string;
  search?: string;
}) {
  const properties: PropertyCardProps[] = await fetchProperties({
    category,
    search,
  });
  // fetchPropertiesは、propertyモデルをfindManyして、categoryとsearchでフィルターして、
  // フィルター後の各propertyオブジェクトにつき、selectで指定したフィールドをセットする

  if (properties.length === 0) {
    return (
      <EmptyList
        heading="No results."
        message="Try changing or removing some of your filters."
        btnText="Clear Filters"
      />
      // エラーメッセージとトップページへのリンクを表示するコンポーネント
    );
  }
  return <PropertiesList properties={properties} />;
}
export default PropertiesContainer;
