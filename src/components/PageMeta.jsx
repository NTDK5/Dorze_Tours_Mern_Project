import { Helmet } from 'react-helmet-async';

const PageMeta = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
        </Helmet>
    );
};

export default PageMeta; 