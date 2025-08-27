import React from 'react';

import { useParams } from 'react-router';

import PageHeader from '../components/page-header/PageHeader';

import { category as cate } from '../api/tmdbApi';
import MovieGrid from '../components/movie-grid/MovieGrid';

const Catalog = () => {

    const { category, type } = useParams();

    const getPageTitle = () => {
        if (type) {
            const typeNames = {
                'top_rated': 'Top Rated',
                'now_playing': 'Now Playing',
                'popular': 'Popular',
                'upcoming': 'Upcoming'
            };
            const categoryName = category === cate.movie ? 'Movies' : 'TV Series';
            return `${typeNames[type] || 'Popular'} ${categoryName}`;
        }
        return category === cate.movie ? 'Movies' : 'TV Series';
    };

    return (
        <>
            <PageHeader>
                {getPageTitle()}
            </PageHeader>
            <div className="container">
                <div className="section mb-3">
                    <MovieGrid category={category} type={type}/>
                </div>
            </div>
        </>
    );
}

export default Catalog;
