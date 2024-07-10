import LoadingCards from '@/components/card/LoadingCards';
import CategoriesList from '@/components/home/CategoriesList';
import PropertiesContainer from '@/components/home/PropertiesContainer';
import { Suspense } from 'react';
// Suspenseコンポーネントの内部でdata-fetch等のasync処理が行われている時に、処理が終わるまでレンダーをsuspenseする
// suspenseしてる間、fallbackに指定したコンポーネントを表示する。

function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  // Nextjs-13以降、page.tsxで様々なビルトインのpropsが使える仕様になっており、searchParamsもその一つ。
  // page.tsxでは、useSearchParamsを使和なくても、propsとしてsearchParamsを受け取ることができる。裏でNextjsがparamsの取得をやってくれる
  return (
    <section>
      <CategoriesList
        category={searchParams?.category}
        search={searchParams?.search}
      />
      <Suspense fallback={<LoadingCards />}>
        <PropertiesContainer
          category={searchParams?.category}
          search={searchParams?.search}
        />
      </Suspense>
    </section>
  );
}
export default HomePage;
