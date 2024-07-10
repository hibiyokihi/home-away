
'use client';
import { Input } from '../ui/input';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from 'react';

function NavSearch() {
  const searchParams = useSearchParams();
  // useSearchParamsは、urlからparamsを取得して、Read-onlyバージョンのURLSearchParamsオブジェクトを返す
  // URLSearchParamsオブジェクトは、params全体を対象とするもので、?search=　だけでなくcategoryも含まれる
  // page.tsxでは、useSearchParamsをしなくても、propsとしてsearchPramsを受け取れるが、page.tsx以外ではuseSearchParamsを使う

  const pathname = usePathname();
  const { replace } = useRouter();
  const [search, setSearch] = useState(
    searchParams.get('search')?.toString() || ''
  );
  const handleSearch = useDebouncedCallback((value: string) => {
    // useDebouncedCallbackは、第2引数に指定したミリ秒後(ここでは0.5秒後)に処理を実行する
    // 0.5秒の間に次のhandleSearchが呼ばれた場合には、最初のcallは取り消されて最新のものだけが実行される。
    // これにより、onChangeの数だけhandleSearchが実行される状況を防ぐことができる
    const params = new URLSearchParams(searchParams);
    // useSearchParamsが取得したread-onlyのURLSearchParamsを元に、新しくURLSearchParamsインスタンスを作成
    // 通常のURLSearchParamsインスタンスだから、get, set, delete等のメソッドを使える
    // urlからのparamsの取得は、useSearchParamsを使わずに、window.locationを使う方法もあるようだ
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    // inputの入力内容にonChangeがあった際に、0.5秒後に実行され、?search=　の部分をセットし直す
    // inputの入力内容が空になったら、paramsから ?search= の部分ごとdeleteする
    // paramsのうちsearch部分を変更するだけで、urlから取得したparamsにcategoryが含まれる場合にはそれはそのまま残ってることに留意
    replace(`${pathname}?${params.toString()}`);
    // useRouterのreplaceは、current-urlをreplaceして遷移する
    // ?はqueryのシンボル。paramsはURLSearchParamsオブジェクトだから、stringに変換してpathと繋げる
  }, 500);

  useEffect(() => {
    if (!searchParams.get('search')) {
      setSearch('');
    }
  }, [searchParams.get('search')]);
  // inputの入力値が空になると、setSearchによりsearchが空になり、handleSearchによりparamsからsearchクエリがdeleteされる
  // ここでは逆に、paramsのsearchクエリが無くなったら、stateのsearchを空にしている

  return (
    <Input
      type="search"
      placeholder="find a property..."
      className="max-w-xs dark:bg-muted "
      onChange={(e) => {
        setSearch(e.target.value);
        // changeがある度に実行され、inputのvalueにリアルタイムで反映される。
        handleSearch(e.target.value);
        // inputの内容をurlのparameterに反映させることで、HomepageからUI全体にsearch内容を反映させる
        // changeの後、0.5秒後に実行されることで、連続してchangeがあった際にその都度実行されることを防ぐ
      }}
      value={search}
    />
  );
}
export default NavSearch;
