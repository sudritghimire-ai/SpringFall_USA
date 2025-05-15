import React from 'react';

const SearchBlog = ({ search, handleSearchChange, handleSearch }) => {
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className='w-full flex justify-center items-center mb-8 px-4'>
            <div className='relative w-full max-w-4xl'>
                {/* Input Field */}
                <input
                    value={search}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                    type='text'
                    placeholder='Eg: Texas State University'
                    className='w-full py-4 px-6 bg-white text-gray-800 text-lg rounded-xl border border-gray-200 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300 ease-in-out'
                />
                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className='absolute right-2 top-1/2 transform -translate-y-1/2 px-5 py-2.5 bg-indigo-600 text-white text-base font-semibold rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg focus:outline-none transition-all duration-300'
                >
                    <span>Search</span>
                </button>
            </div>
        </div>
    );
};

export default SearchBlog;
