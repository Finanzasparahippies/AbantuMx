import { useState } from "react";

const SearchBar = ({ callback }) => {
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        setSearch(e.target.value);
        callback(e.target.value);
    };

    return (
       
            <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Buscar..."
                className="ml-2 w-auto p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
    );
}
export default SearchBar;