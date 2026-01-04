import React, { useState, useEffect } from 'react';

// Simple in-memory cache to prevent duplicate requests
const imageCache = {};

const CastAvatar = ({ name, className }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (!name) return;

        // Check cache first
        if (imageCache[name]) {
            setImageUrl(imageCache[name]);
            return;
        }

        let isMounted = true;

        const fetchImage = async () => {
            try {
                // Use generator=search to find the most likely page, handling disambiguation better
                const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(name)}&gsrlimit=1&prop=pageimages&pithumbsize=200&format=json&origin=*`;

                const res = await fetch(url);
                const data = await res.json();

                if (data.query && data.query.pages) {
                    const pages = data.query.pages;
                    const firstPageId = Object.keys(pages)[0];
                    const page = pages[firstPageId];

                    if (page.thumbnail && page.thumbnail.source) {
                        if (isMounted) {
                            setImageUrl(page.thumbnail.source);
                            imageCache[name] = page.thumbnail.source; // Cache it
                        }
                    }
                }
            } catch (error) {
                // Silent fail
            }
        };

        fetchImage();

        return () => { isMounted = false; };
    }, [name]);

    // Fallback to UI Avatars if no Wikipedia image found
    const src = imageUrl || `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=200&font-size=0.35`;

    return (
        <img
            src={src}
            alt={name}
            className={className}
            onError={(e) => {
                // If Wikipedia image fails loading, revert to avatar
                e.target.src = `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=200&font-size=0.35`;
            }}
        />
    );
};

export default CastAvatar;
