import React from 'react';
import {Helmet} from "react-helmet"


const Seo = ({ title, desc ,image}) => {
    return (
        <Helmet>
            <meta charSet="utf-8" />
            <title>{title}</title>
            <meta name="description" content={desc} />
            <meta name="keywords" content="Student mentorship platform, college guidance, past year question papers, academic resources, student marketplace, buy and sell study materials, college community, senior mentorship, exam preparation, educational support." />
            <meta name="robots" content="index,follow" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Student Senior: Your Academic Companion" />
            <meta property="og:site_name" content="Student Senior" />
            <meta property="og:description" content={desc} />
            <meta property="og:image" content="https://www.studentsenior.com/image.png" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:domain" content="https://www.studentsenior.com" />
            <meta property="twitter:url" content="https://www.studentsenior.com" />
            <meta name="twitter:title" content="Student Senior: Your Academic Companion" />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image" content="https://www.studentsenior.com/image.png" />
            <meta name="google-adsense-account" content="ca-pub-4435788387381825" />
            <link rel="canonical" href="https://www.studentsenior.com/" />
        </Helmet>
    );
};

export default Seo;