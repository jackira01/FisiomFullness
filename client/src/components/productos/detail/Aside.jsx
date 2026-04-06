"use client";
import { useEffect, useState } from "react";
import MetodosDePago from "./MetodosDePago";
import ProdRelacionados from "./ProdRelacionados";
import { apiEndpoints } from "@/api_endpoints";

const Aside = ({ prod }) => {
  const [prods, setProds] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();

    fetch(apiEndpoints.products, {
      method: "GET",
      signal: abortController.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setProds(
          data.products.filter(
            (product) =>
              product.category._id === prod.category?._id &&
              product._id !== prod?._id
          )
        );
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        throw err;
      });

    return () => abortController.abort();
  }, [prod]);

  return (
    <aside className="w-full sm:w-[320px] shrink-0 px-4 sm:px-0 sm:pr-6 lg:pr-8 py-8">
      <div className="flex flex-col gap-6">
        <MetodosDePago />
        <ProdRelacionados prods={prods} />
      </div>
    </aside>
  );
};

export default Aside;
