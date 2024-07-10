import * as z from 'zod';
import { ZodSchema } from 'zod';

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'first name must be at least 2 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'last name must be at least 2 characters' }),
  username: z
    .string()
    .min(2, { message: 'username must be at least 2 characters' }),
});

export function validateWithZodSchema<T>(
  schema: ZodSchema<T>,
  data: unknown
): T {
  // TSは、引数に受けたschemaからタイプをinterして、これをreturn値のタイプに当てはめてタイプチェックする。
  // ZodSchemaは、Zodで作られたSchemaであることを示している
  // これにより、ZodのSchemaを渡すという約束事をした上で、詳細は実際のschemaを見てinterしてくれるから、Genericにできる
  // dataはrun-timeで実際にdataを渡された時にわかるから、定義時点ではunknown
  const result = schema.safeParse(data);
  // Zodのvalidationメソッドには、parseとsafeParseがある。
  // parseは、validationが失敗した時にエラーを発する。tryの中で使うと、エラー時にcatchに流れる
  // safeParseはオブジェクトを返し、success, data, error等のプロパティが含まれる。successはbooleanで、成功するとtrue。
  // validationが成功すると、success=trueとなり、dataにvalidate後のデータが入る
  // validationが失敗すると、success=falseとなり、error.errorsにエラー内容が入る

  if (!result.success) {
    const errors = result.error.errors.map((error) => error.message);
    throw new Error(errors.join(','));
  }
  return result.data;
}

export const imageSchema = z.object({
  image: validateFile()
})

function validateFile() {
  const maxUploadSize = 1024 * 1024;
  const acceptedFileTypes = ['image/'];
  // Fileオブジェクトのimageファイルのtypeには、image/jpeg, image/png等がある
  // ちなみに、PDFはapplication/pdf, wordはapplication/maword, excelはapplication/vnd.ms-excel
  return z
    .instanceof(File)
    // Fileクラスはブラウザが提供するAPIによるもので、画像等、いわゆるfile的なものはFileクラスに属する
    // Fileクラスのオブジェクトは、name, size, type, lastModified等のプロパティを有する
    // ここでは第2引数のoption-objectを省略してるが、他と同様に{message: エラーメッセージ}のように書いてもいい
    .refine((file) => {
      return !file || file.size <= maxUploadSize;
    }, `File size must be less than 1 MB`)
    // refineメソッドは、第1引数がvalidation関数(true又はfalseを返す)、第2引数はエラーメッセージ(falseの場合)
    // 引数のfileは、validationの対象が入る、ここでは上記のimageファイル
    // つまり、fileがnullならTrue、file.sizeが一定以下ならtrue、一定超ならfalseでエラーメッセージが返される
    // 第2引数はoptionsオブジェクトで、正しくは{message: エラーメッセージ}のように書く
    // message以外のオプションを使わない場合は、上記のようにstringだけで書いてもmessageのことと解釈される
    .refine((file) => {
      return (
        !file || acceptedFileTypes.some((type) => file.type.startsWith(type))
        // 対象のfileが、instanceof(File)を通過してるから、fileはFileクラスのオブジェクトで、file.typeを有する
        // Fileオブジェクトには色々はtypeがあり、ここでは'image/'タイプのみをacceptする
        // Arryのsomeメソッドは、要素をiterateして少なくとも1つでも条件を満たしたらtrueを返す
        // つまり、fileがnullならtrue、file.typeがリストに有ればtrue、リストに無ければfalseでエラーメッセージが返される
      );
    }, 'File must be an image');
}

export const propertySchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'name must be at least 2 characters.',
    })
    .max(100, {
      message: 'name must be less than 100 characters.',
    }),
  tagline: z
    .string()
    .min(2, {
      message: 'tagline must be at least 2 characters.',
    })
    .max(100, {
      message: 'tagline must be less than 100 characters.',
    }),
  price: z.coerce.number().int().min(0, {
    // coerceは強制するの意味。priceがstringの123の時、coerce.number()はこれをnumberに変換する(if possible)
    // zodのルールとして、coerce.int()とはできないから、corece.number()を介した後に.int()のvalidationをつける
    message: 'price must be a positive number.',
  }),
  category: z.string(),
  description: z.string().refine(
    (description) => {
      const wordCount = description.split(' ').length;
      return wordCount >= 10 && wordCount <= 1000;
    },
    {
      message: 'description must be between 10 and 1000 words.',
    }
  ),
  country: z.string(),
  guests: z.coerce.number().int().min(0, {
    message: 'guest amount must be a positive number.',
  }),
  bedrooms: z.coerce.number().int().min(0, {
    message: 'bedrooms amount must be a positive number.',
  }),
  beds: z.coerce.number().int().min(0, {
    message: 'beds amount must be a positive number.',
  }),
  baths: z.coerce.number().int().min(0, {
    message: 'bahts amount must be a positive number.',
  }),
  amenities: z.string(),
});