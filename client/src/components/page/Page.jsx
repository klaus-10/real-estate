
import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import "./page.scss";

function Page({total, handleSetPageNumber}) {

    return (
        <Pagination count={total} onChange={(event, value) => handleSetPageNumber(value)}/>
    )
}


export default Page;