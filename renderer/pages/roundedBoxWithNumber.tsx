import React from 'react';

const RoundedBoxWithNumber = ({ text, number, disabled }) => {
    const getTimeColor = (time: number): string => {
        if(time <= 30) {
            return 'bg-green-500'
        } else if(time <= 60) {
            return 'bg-orange-500'
        } else {
            return 'bg-red-200'
        }
    }

    return (
        <div className={`${disabled ? 'bg-gray-600' : 'bg-gray-600'} flex items-center justify-between p-1 m-2 border-2 border-gray-300 rounded-lg`}>
            <div className='flex-1'>
                <p>{text}</p>
            </div>
            <div className={`w-16 text-3xl text-center text-white font-sans font-bold ${disabled ? 'bg-red-500' : getTimeColor(number)} border-2 rounded-md`}>
                <span>{number}</span>
            </div>
        </div>
    );
};

export default RoundedBoxWithNumber;
