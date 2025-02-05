"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
const Search = () => {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const searchText = searchParams.get("query") || "";
  useEffect(() => {
    const fetchFiles = async () => {
      // const
    };
  }, [searchText]);
  useEffect(() => {
    if (!searchText) {
      setQuery("");
    }
  }, [searchParams]);
  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src={"/assets/icons/search.svg"}
          alt="search"
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder="Search ..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        ></Input>
      </div>
    </div>
  );
};
export default Search;
