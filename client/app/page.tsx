import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <div className=" flex  justify-center items-center h-[100vh]">
        <Link
          href="/books"
          className=" px-3 py-2 bg-blue-500 rounded-full text-white font-bold font-mono mx-5"
        >
          จัดการหนังสือ
        </Link>
        <Link
          href="/shelves"
          className=" px-3 py-2 bg-green-500 rounded-full text-white font-bold font-mono mx-5"
        >
          จัดการประเภทหนังสือ
        </Link>
      </div>
    </main>
  );
}
