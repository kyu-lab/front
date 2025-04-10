import React from "react";
import {Link} from "react-router-dom";

export default function Error500() {
  return (
    <section className="flex flex-grow relative bg-primary">
      <div className="container mx-auto">
        <div className="-mx-4 flex">
          <div className="w-full px-4">
            <div className="mx-auto text-center">
              <h2 className="mb-2 text-[50px] font-bold leading-none text-black dark:text-white sm:text-[80px] md:text-[100px]">
                500
              </h2>
              <p className="mb-8 text-lg text-black dark:text-white">
                The page you are looking for it maybe deleted
              </p>
              <Link to={"/"}>
                Go To Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
