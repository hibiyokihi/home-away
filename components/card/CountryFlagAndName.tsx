import { findCountryByCode } from '@/utils/countries';

function CountryFlagAndName({ countryCode }: { countryCode: string }) {
  const validCountry = findCountryByCode(countryCode)!;
  // world-countriesのリストから、codeがcountryCodeに一致するcountryのオブジェクトを取得
  // findメソッドを使ってるから、TSはvalidCountryは'possibly null(undefined)'と判断する
  // 最後に!を付けることで、undefined(又はnull)ではないことをTSに対してassertする
  const countryName =
    validCountry.name.length > 20
      ? `${validCountry.name.substring(0, 20)}...`
      : validCountry.name;
      // validCountryはfindメソッドのリターン値だから、'possibly null(undefined)'とTSに判断され、
      // validCountry.nameとした時にTSエラーが生じる。これを防ぐために、validCountryを定義したときに!を付けている。
      // ここでvalidCountry!.nameとすることもできるが、何回も!が必要になるから、定義時に!をつけた。

      // !.は、null又はundefinedではないことをTSにassertするもの。
      // つまりvalidCountryはTS的にnullの可能性がありでも、nullではないものとして扱うようにTSに命令
      // ?.を使った場合は、validCountryがnull又はundefinedの場合はErrorを生じさせずにundefinedを返す。
      // !.を使った場合は、Errorを発生させる点が異なる。よって?.の方が安全だが、確実にnon-nullなら!.を使っても良い
      // substringは、開始と終了を引数に受けて、stringからその部分を抜き出す
      // つまり、国名が20文字以下ならそのまま表示し、20文字超なら20文字まで表示して...をつける
  return (
    <span className="flex justify-between items-center gap-2 text-sm ">
      {validCountry.flag} {countryName}
    </span>
  );
}
export default CountryFlagAndName;