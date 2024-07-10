'use server';

import {
  profileSchema,
  validateWithZodSchema,
  imageSchema,
  propertySchema,
} from './schemas';
import db from './db';
// export defaultされたPrismaClientインスタンスをdbとしてインポート
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { uploadImage } from './supabase';

const getAuthUser = async () => {
  const user = await currentUser();
  // currentUserはclerkの関数で、ログインユーザーが無ければnullを返す。
  // clerkのcurrentUserは、server側からログインユーザーの情報を取得できる点に留意。
  if (!user) throw new Error('You must be logged in to access this page');
  // 実際には、profileページはisProtectedRouteに含めてるから、認証しないと入れない(middleware.js)
  // でもTSはこの情報を知らないから、!userの対応を書かないと、user.idを使った時にTSから'possibly null'エラーが出る
  if (!user.privateMetadata.hasProfile) redirect('/profile/create');
  return user;
};

const renderError = (error: unknown): { message: string } => {
  // errorはtry-catchでエラーが生じた際に発生するものだから、定義時点ではunknownでOK
  return {
    message: error instanceof Error ? error.message : 'An error occurred',
    // errorがErrorインスタンスならmessageプロパティがあるから、それを表示
  };
};

export const createProfileAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error('Please login to create a profile');
    // ここでErrorが発生した場合、catchでerror.messageとして上記が表示される

    const rawData = Object.fromEntries(formData);
    // formDataをobject形式に変換する
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    await db.profile.create({
      // prismaインスタンス.モデル名.create()でデータを作成する
      data: {
        clerkId: user.id,
        // userはcurrentUser()で取得するから、nullの可能性があり、!userの場合のエラー対応を書かないとTSエラーが生じる
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? '',
        ...validatedFields,
        // 具体的な指示をすべきものは記載して、それ以外はスプレッドしてそのまま受け入れる
      },
    });
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
      // clerkClientは、全てのuserのMetadataを管理しており、このユーザーのprivateMetadataを更新する
      // privateMetadataは、client側からはアクセスできないもの。server側だけで管理されるもの
    });
  } catch (error) {
    return renderError(error);
    // エラーのケースでも、actionはmessageを返してる点に留意。そのようにutils.typesでタイプ設定してる
  }
  redirect('/');
  // tryの中にはあえてreturnを書いてない。returnがないことで、successの場合はtry/catchを抜けてredirectされる
  // redirectはtry/catchの中に書かないこと。エラーになる。
};

export const fetchProfileImage = async () => {
  const user = await currentUser();
  if (!user) return null;

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      profileImage: true,
      // ここではprofileのprofileImageプロパティだけ欲しいから限定する
    },
  });
  return profile?.profileImage;
  // profileImage又はundefinedを返す
};

export const fetchProfile = async () => {
  const user = await getAuthUser();
  // getAuthUserで!userの場合のエラー対応をしてるから、user.idを使ってもTSから'possibly null'と言われない
  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  });
  if (!profile) redirect('/profile/create');
  // getAuthUserで、hasProfileがnullの場合はredirectしてるから、実際にはこのコードが実行されることはない
  // でもこれを書かないと、profileがTSから'possibly null'として扱われてしまう
  return profile;
};

export const updateProfileAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  // getAuthUserでエラーが生じないことは分かってるから、try-catchの中に入れなくてもいい

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: validatedFields,
      // update可能なフィールドは名前とusernameとし、clerkId, email, profileImageはここではupdateさせない仕様
    });
    revalidatePath('/profile');
    // redirectはtry-catchの中では書けないが、revalidatePathはOK
    return { message: 'Profile updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProfileImageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const image = formData.get('image') as File;
    const validatedFields = validateWithZodSchema(imageSchema, { image });
    // imageSchemaでimageをsafeParsesして、successならresult.dataを返し、失敗ならthrow-Errorする
    // validateWithZodSchemaは、引数のimageSchemaからタイプをinferして、これをリターン値のタイプに引用してチェックする
    const fullPath = await uploadImage(validatedFields.image);
    // uploadImageは、引数のimageをsupabaseにuploadして、そのimageのurlをリターンする
    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: {
        profileImage: fullPath,
      },
    });
    revalidatePath('/profile');
    return { message: 'Profile image updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};

export const createPropertyAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const file = formData.get('image') as File;
    // Object.fromEntriesがリターンするrawDataオブジェクトのvalueは、FormDataEntryValue
    // おそらくimageのようなFileタイプのものは、stringにできないから他と同じには扱えないのだろう

    const validatedFields = validateWithZodSchema(propertySchema, rawData);
    // propertySchemaには、image以外のスキーマが含まれる。imageは別のスキーマを用意してる
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });
    const fullPath = await uploadImage(validatedFile.image);

    console.log(validatedFields);

    await db.property.create({
      data: {
        ...validatedFields,
        image: fullPath,
        profileId: user.id,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect('/');
};

export const fetchProperties = async ({
  search = '',
  category,
}: // 引数にcategoryが無くて、category=undefinedの場合、フィルターされずに全てのcategoryが表示されるが、
// search=undefinedとなるとフィルター結果がゼロになるから、デフォルトを''としている。
// name(tagline)がcontains:undefinedは、該当するものがないから。
{
  search?: string;
  category?: string;
}) => {
  const properties = await db.property.findMany({
    // selectで項目を絞ることにより、TSがinferするpropertiesのタイプが限定されていることに留意
    where: {
      category,
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { tagline: { contains: search, mode: 'insensitive' } },
      ],
      // categoryが一致するもの、かつ、name又はtaglineがsearchを含むもの(case-insensitive)
    },
    select: {
      id: true,
      name: true,
      tagline: true,
      country: true,
      image: true,
      price: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return properties;
};

export const fetchFavoriteId = async ({
  propertyId,
}: {
  propertyId: string;
}) => {
  const user = await getAuthUser();
  // clerkを使うと、server側からログインユーザーを取得できる。これはserverアクションだから、serverで動いてる点に留意。
  // clerkを使わない場合、基本的にclient側でログインユーザーを取得することになるが、どちら側で動くコードを書いてるのか意識すること
  const favorite = await db.favorite.findFirst({
    where: {
      propertyId,
      profileId: user.id,
      // このログインユーザーと引数のpropertyIdで一致するfavoriteインスタンスがあれば、お気に入り登録済みということ
      // DBの方で重複登録できない仕様になっていれば、findFirstしなくてもいいだろう。
    },
    select: {
      id: true,
      // お気に入り登録済みかどうかをチェックしたいだけだから、idだけで十分
    },
  });
  return favorite?.id || null;
};

export const toggleFavoriteAction = async (prevState: {
  propertyId: string;
  favoriteId: string | null;
  pathname: string;
  // FavoriteToggleFormにて、このactionを複製してprevStateをpre-setして、サーバー側にbindしている
  // ハートをクリックした時点(action実行前)のstateだから、'prev'と命名されたのだろう
}) => {
  const user = await getAuthUser();
  const { propertyId, favoriteId, pathname } = prevState;
  try {
    if (favoriteId) {
      // action実行前の段階でfavoriteインスタンスがあって、ハートがクリックされたなら、インスタンスをdeleteしてお気に入りを外す
      await db.favorite.delete({
        where: {
          id: favoriteId,
        },
      });
    } else {
      await db.favorite.create({
        data: {
          propertyId,
          profileId: user.id,
        },
      });
    }
    revalidatePath(pathname);
    // pathnameをdynamicにすることで、複数の箇所からこのactionが呼ばれても、適切なpathをrevalidateできる
    return { message: favoriteId ? 'Removed from Faves' : 'Added to Faves' };
    // favoriteIdはprevStateだから、有るなら今回削除した。
  } catch (error) {
    return renderError(error);
  }
};

export const fetchFavorites = async () => {
  const user = await getAuthUser();
  const favorites = await db.favorite.findMany({
    where: {
      profileId: user.id,
      // ログインユーザーが含まれるfavoriteでフィルターする
    },
    select: {
      property: {
        select: {
          id: true,
          name: true,
          tagline: true,
          price: true,
          country: true,
          image: true,
        },
      },
      // favoriteのpropertyフィールドはPropertyインスタンスを参照し、更にフィールドを絞って取得する
    },
  });
  return favorites.map((favorite) => favorite.property);
  // favoriteモデルについて、ログインユーザーが含まれるものでフィルターし、propertyフィールドに限定し、
  // 更にpropertyの一部のフィールドだけに限定したものがfavorites.
  // これをmapして、favorite.propertyとすると、selectで限定されたpropertyフィールドが表示される
  // TSがinferするfetchFavoritesのリターン値のタイプについて、その通りになってることを確認する
};

export const fetchPropertyDetails = (id: string) => {
  return db.property.findUnique({
    where: {
      id,
    },
    include: {
      profile: true,
      // related modelを取得データに加えたい場合、明示的にincludeする必要がある
    },
  });
};