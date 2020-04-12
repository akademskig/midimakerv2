
import React, { Fragment } from 'react';
import Header from '../components/common/Header.component';


const MainLayout = ({ children }: { children: any }) => {
    return (
        <Fragment>
            <Header></Header>
                {children}
        </Fragment>
    )
}

export default MainLayout