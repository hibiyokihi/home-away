'use client';

import { usePathname } from 'next/navigation';
import FormContainer from '../form/FormContainer';
import { toggleFavoriteAction } from '@/utils/actions';
import { CardSubmitButton } from '../form/Buttons';

type FavoriteToggleFormProps = {
  propertyId: string;
  favoriteId: string | null;
};

function FavoriteToggleForm({
  propertyId,
  favoriteId,
}: FavoriteToggleFormProps) {
  const pathname = usePathname();
  // このコンポーネントは色々なpathで実行されるから、dinamicにpathを取得する必要がある
  const toggleAction = toggleFavoriteAction.bind(null, {
    propertyId,
    favoriteId,
    pathname,
  });
  // toggleFavoriteActionを元に関数を複製して、prevStateをpre-setしたものをサーバー側のactionにbindする
  // 第1引数は、関数の'this'に当たるものの設定してbindするものだが、ここではnull。
  // 第2引数がprevStateの項目で、これをセットして、サーバー側のactionにbindする
  return (
    <FormContainer action={toggleAction}>
      {/* toggleFavoriteActionをそのまま呼ぶと、server-actionにprevStateの情報を渡すことができない。*/}
      <CardSubmitButton isFavorite={favoriteId ? true : false} />
      {/* favoriteのトグルは、favoriteモデルにインスタンスをcreate, deleteすることで行う。
      よってFormContainerの中にボタンを置いて、クリックするとactionが発動する。
      CardSubmitButtonの中でuseFormStatusを使っているから、このformのsubmit時のpending状況を把握できる */}
    </FormContainer>
  );
}
export default FavoriteToggleForm;
