import React from 'react';

function Rewards() {
    const rewards = ['Reward 1', 'Reward 2', 'Reward 3', 'Reward 4'];

    return (
        <div className="page-layout">
            <div className="page-content">
                <h1>Rewards</h1>
                <ul>
                    {rewards.map((reward, index) => (
                        <li key={index}>{reward}</li>
                    ))}
                </ul>
            </div>
            <div className="page-image">
                <img src="https://pbs.twimg.com/media/FsGU-mHX0AMVvYi.jpg"
                     alt="Guild Visual"/>
            </div>
        </div>
    );
}

export default Rewards;
