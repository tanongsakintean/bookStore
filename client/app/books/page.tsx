import { Suspense } from "react";
import Books from "@/components/Books";
import Loading from "./Loading";

function page({ data }: any) {
  console.log(data);
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Books />
      </Suspense>
    </div>
  );
}

export default page;
