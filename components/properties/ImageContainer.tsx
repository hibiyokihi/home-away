import Image from 'next/image';

function ImageContainer({
  mainImage,
  name,
}: {
  mainImage: string;
  name: string;
}) {
  return (
    <section className="h-[300px] md:h-[500px] relative mt-8">
      <Image
        src={mainImage}
        fill
        sizes="100vw"
        // 画面を大きくした時にも、画像は横幅100%。高さはsectionで指定してるから、上下が切れる形になる
        alt={name}
        className="object-cover  rounded-md"
        priority
        // 画像を先にloadしてくれるようだ。あるいは先にplaceholderだけ用意して場所を確保する？
      />
    </section>
  );
}
export default ImageContainer;