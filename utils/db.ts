import { PrismaClient } from '@prisma/client';
// 何も措置を講じないと、リクエストの度に新しいPrismaClientインスタンスが作成されてしまい、メモリを圧迫する
// globalThisを使うことで、アプリのrun-timeの間、一つのPrismaClientインスタンスを使い回すことができるようだ。

const prismaClientSingleton = () => {
  // 新しいPrismaClientのインスタンスを作る関数
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;
// PrismaClientインスタンスのタイプを指定
// typeofは、対象の関数又は変数のタイプをinfer(推測)する。
// ReturnTypeは、関数のタイプ定義を受け取って、その関数のリターン値のタイプ定義部分を返す

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};
// globalThisは、JSのビルトインのオブジェクトで、globalにアクセス可能なオブジェクト
// ここではこれをglobalForPrismaにrename。
// as unknownは、TSのエラーを回避するための一時的手段。その後ですぐに本番のタイプ設定を行う。
// globalForPrismaはprismaをキーに持つオブジェクトで、prismaはPrismaClientインスタンスのタイプかundefined

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
// ??は、左側がnull/undefinedの場合に、右側のコードが実行される
// つまり、最初の一回だけ右側の関数がinvokeされてprismaインスタンスが作られて、その後は関数は実行されない。
// つまり、リクエストの数だけPrismaClientインスタンスが作成されてしまう問題は解決できる

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
// 最初の一回だけ、prismaインスタンスを作成した後にglobalオブジェクトのprismaキーに設定する。
