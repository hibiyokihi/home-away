import { FaHeart } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { auth } from '@clerk/nextjs/server';
import { CardSignInButton } from '../form/Buttons';
import { fetchFavoriteId } from '@/utils/actions';
import FavoriteToggleForm from './FavoriteToggleForm';

async function FavoriteToggleButton({ propertyId }: { propertyId: string }) {
  const { userId } = auth();
  // auth()は、現状のsessionとtoken関連の情報を取得するもの。その中にuserIdも入ってる。
  // userIdだけが欲しい時は、clerkのcurrentUser()よりも手早くuserIdを取得できる。currentUserはuserインスタンス全体を取得
  if (!userId) return <CardSignInButton />;
  // Propertyの一覧はPublic-routeだから、ログインしてなくても見れる。
  // お気に入りボタンを押した時に未認証の場合(!userId)は、clerkのログイン画面がmodalで現れる
  const favoriteid = await fetchFavoriteId({ propertyId });
  // Favoriteモデルインスタンスの中で、このログインユーザーとpropertyIdの組み合わせで一致するものがあれば、お気に入り登録済み
  // FavoriteToggleButtonはserver-componentだから、上記のuserIdの取得からfetchまでサーバー側で素早く行える。
  // サーバー側でfavoriteIdを取得した上で、FovoriteToggleForm(client-component)に渡して挙げる

  return <FavoriteToggleForm favoriteId={favoriteid} propertyId={propertyId} />;
  // favoriteモデルのインスタンスの有無を元に表示をトグルするため、formの中にButtonを置いて、
  // server-actionにより、関連するインスタンスをcreate, deleteする
}
export default FavoriteToggleButton;
