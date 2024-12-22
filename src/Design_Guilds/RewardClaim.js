import React from 'react';

function RewardClaim() {
    const claims = [
        { player: 'Player A', reward: 'Reward 1' },
        { player: 'Player B', reward: 'Reward 3' },
    ];

    return (
        <div className="page-layout">
            <div className="page-content">
                <h1>Reward Claims</h1>
                <ul>
                    {claims.map((claim, index) => (
                        <li key={index}>
                            {claim.player} claimed {claim.reward}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="page-image">
                <img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRn40pE1BoWV7_cztAfYkT6_gLJ0wgBEwN3L5Yd_ZZJRYp4zKPJ"
                     alt="Guild Visual"/>
            </div>

        </div>
    );
}

export default RewardClaim;
