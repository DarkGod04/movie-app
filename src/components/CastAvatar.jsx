import React, { useState, useEffect } from 'react';

const CastAvatar = ({ name, className }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchImage = async () => {
            try {
                // Use Wikipedia API to find an image for the actor
                const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(name)}&prop=pageimages&format=json&pithumbsize=150&origin=*`;
                const res = await fetch(url);
                const data = await res.json();

                if (data.query && data.query.pages) {
                    const pages = data.query.pages;
                    const firstPageId = Object.keys(pages)[0];
                    const page = pages[firstPageId];

                    if (page.thumbnail && page.thumbnail.source) {
                        if (isMounted) setImageUrl(page.thumbnail.source);
                    }
                }
            } catch (error) {
                // Silent fail, keep default state
            }
        };

        if (name) fetchImage();

        return () => { isMounted = false; };
    }, [name]);

    // Fallback to UI Avatars if no Wikipedia image found
    const src = imageUrl || `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=64&font-size=0.4`;

    return (
        <img
            src={src}
            alt={name}
            className={className}
            onError={(e) => {
                // If Wikipedia image fails (403/404), revert to avatar
                e.target.src = `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=64&font-size=0.4`;
            }}
        />
    );
};

export default CastAvatar;
