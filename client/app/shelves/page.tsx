import { Suspense } from "react";
import Shelves from "@/components/Shelves";
import Loading from "./Loading";

function page() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Shelves />
      </Suspense>
    </div>
  );
}

export default page;
