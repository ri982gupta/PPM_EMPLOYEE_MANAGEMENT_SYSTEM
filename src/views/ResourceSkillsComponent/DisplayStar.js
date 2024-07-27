import React from 'react';
import { FaStar } from 'react-icons/fa';
import { AiOutlineStar } from 'react-icons/ai';

const DisplayStar = ({ skillRating }) => {
    const rating = Array.from({ length: 5 }, (ele, index) => {

        return (
            <span key={index}>

                {skillRating >= index + 1 ?
                    (
                        <FaStar />
                    ) : <AiOutlineStar />}
            </span>
        )
    })
    return (

        <div>{rating}</div>

    )
}

export default DisplayStar