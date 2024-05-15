import { useMap } from 'react-leaflet';
import { useEffect } from 'react';


const SearchInMap = (handleIsMapSearch, isVisible) => {

    return(
        <>
            {
                isVisible && (
                    <button className='search-btn' onClick={handleIsMapSearch}>
                        Search here
                    </button>
                )
            }
        </>
        
    )
}


export default SearchInMap;