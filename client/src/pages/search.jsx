import axios from 'axios';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const search = () => {
    const[results, setResults] = useState([]);
    const router = useRouter();
    const {query: searchQuery} = router.query;
    console.log(searchQuery)

    useEffect(() => {
        if(!searchQuery) {
            return
        }
        const fetchMedia = async() => {
            try {
                const response = await axios.get(`api/searchMedia?searchQuery=${searchQuery}`)
                // console.log(response);
                const searchResults = response.data.results;
                console.log(searchResults)

                const validResults = searchResults.filter((item) => item.media_type == "movie" || item.media_type == "tv");
                console.log(validResults);
                setResults(validResults);
                console.log(results);
            } catch(err){
                console.log(err);
            }
        }

        fetchMedia()

    },[searchQuery])
  return (
        <div>Seach</div>
    )
}

export default search
