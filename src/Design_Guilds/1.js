package tin.tinproject.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Entity
@Table(name = "Bounty_claim")
public class BountyClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long claimID;
    @Column(nullable = false)
    @DateTimeFormat
    private Date claimDate;
    @Column(nullable = false)
    @DateTimeFormat
    private Date finishDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Player_ID", nullable = false)
    private Player player;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Bounteis_bounty_ID", nullable = false)
    private Bounty bounty;

    public Long getClaimID() {
        return claimID;
    }

    public void setClaimID(Long claimID) {
    this.claimID = claimID;
}

public Date getClaimDate() {
    return claimDate;
}

public void setClaimDate(Date claimDate) {
    this.claimDate = claimDate;
}

public Date getFinishDate() {
    return finishDate;
}

public void setFinishDate(Date finishDate) {
    this.finishDate = finishDate;
}

public Player getPlayer() {
    return player;
}

public void setPlayer(Player player) {
    this.player = player;
}

public Bounty getBounty() {
    return bounty;
}

public void setBounty(Bounty bounty) {
    this.bounty = bounty;
}
} import React, {useState} from 'react';

function RewardClaim() {
    const [bountiesClaim, setBountiesClaim] =useState([]);
    const [selectedBountiesClaim, setSelectedBountiesClaim] =useState(null);
    const [error,serError]=useState('');
    const [currentPage,setCurrentPage]=useState(0);
    const [totalPages,setTotalPages]=useState(0);
    const [showForm,setShowForm]=useState(null);
    const [editingBountyClaim, setEditingBountyClaims]= useState(null);
    const [formData,setFormedData]= useState({
        bounty: '',
        claimDate: '',
        finishDate: '',
        player: ''
    });
    const pageSize=2;
    const fetchBountiesClaims=async (page=0)=>{
        try{
            const response = await fetch(http://localhost:8080/Tavern/bountiesClaim/getAll?page=${page}&size=${pageSize});
            if(!response.ok)throw  new Error('f to fetch');
            const data=await response.json();
            setBountiesClaim(data.content);
            setTotalPages(data.totalPages);
            setCurrentPage(page);
            setSelectedBountiesClaim(null);
            serError('');
        }catch (err){
            serError('faild to load')
        }
    };
    const fetchBountiesClaimDetails=async (claimID)=>{
        try {
            const token=localStorage.getItem('token');
            if(!token)throw  new Error('log in');
            const response =await  fetch(https://localhost:8080/Tavern/bountiesClaim/relations/${claimID},{
            headers: {Authorization: Bearer ${token}},
        });
        const data=await response.json();
        setSelectedBountiesClaim(data);
        serError('');
    }catch (err){
        serError(err.message);
    }
}
const handleSumbit =async (e)=>{
    e.preventDefault();
    try{
        const url=editingBountyClaim
            ? http://localhost:8080/Tavern/bountiesClaim/${editingBountyClaim.claimID}
    : 'http://localhost:8080/Tavern/bountiesClaim';
        await  fetch(url,{
            method: editingBountyClaim ? 'PUT' : 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': Bearer ${localStorage.getItem('token')}
            },
            body: JSON.stringify(formData)
        });
        setShowForm(false);
        setEditingBountyClaims(null);
        setFormedData({
            bounty: '',
            claimDate: '',
            finishDate: '',
            player: ''
        });
        fetchBountiesClaims(currentPage);
    }catch (err){
        serError(editingBountyClaim? 'f to update' : 'f to create')
    }
};
const startEdit =(bountyClaim)=>{
    setEditingBountyClaims(bountyClaim);
    setFormedData({
        bounty: bountyClaim.bounty,
        claimDate: bountyClaim.claimDate,
        finishDate: bountyClaim.finishDate,
        player: bountyClaim.player
    });
    setShowForm(true);
};
const handleDelete =async (bountyClaimId)=>{
    try{
        await  fetch(http://localhost:8080/Tavern/bountiesClaim/${bountyClaimId},{
        method: 'Delete',
            headers:{
            'Authorization': Bearer ${localStorage.getItem('token')}
        }
    });
    fetchBountiesClaims(currentPage);
}catch (err){
    serError('f to delete bountyClaims')
}
}
return (
    <div>
        <h1>BountiesClaims Directory</h1>
        <button onClick={() => fetchBountiesClaims(0)}>Load...</button>
        <button onClick={()=>{
            setShowForm(!showForm);
            setEditingBountyClaims(null);
            setFormedData({
                bounty: '',
                claimDate: '',
                finishDate: '',
                player: ''
            });
        }}>Create BountiesClaim</button>
        {error && <p>{error}</p>}
        {showForm && (
            <form onSubmit={handleSumbit}>
                <div>
                    <input
                        type="number"
                        placeholder="Bounty"
                        value={formData.bounty}
                        onChange={(e) => setFormedData({...formData, bounty: e.target.value})}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="ClaimDate"
                        value={formData.claimDate}
                        onChange={(e) => setFormedData({...formData, claimDate: e.target.value})}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="FinishDate"
                        value={formData.finishDate}
                        onChange={(e) => setFormedData({...formData, finishDate: e.target.value})}
                    />
                </div>
                <div>
                    <input
                        type="number"
                        placeholder="Player"
                        value={formData.player}
                        onChange={(e) => setFormedData({...formData, player: e.target.value})}
                    />
                </div>
                <button type="submit">{editingBountyClaim ? "Update" : "Submit"}</button>
            </form>
        )}
        {!selectedBountiesClaim && (
            <div>
                <div>
                    {bountiesClaim.map(bountiesClaims => (
                        <div key={bountiesClaims.claimID}>
                            <p>Bounties id:{bountiesClaims.bounty}</p>
                            <p>ClaimDate: {bountiesClaims.claimDate}</p>
                            <p>FinishDate: {bountiesClaims.finishDate}</p>
                            <p>Player id: {bountiesClaims.player}</p>
                            <button onClick={()=> fetchBountiesClaimDetails(bountiesClaims.claimID)}>Details</button>
                            <button onClick={()=>{
                                startEdit(bountiesClaims);
                                setShowForm(!showForm);
                            }}>Edit
                            </button>
                            <button onClick={()=> handleDelete(bountiesClaims.claimID)}>Delete</button>
                        </div>
                    ))}
                </div>
                <div>
                    <button onClick={()=> fetchBountiesClaims(0)} disabled={currentPage===0}>First</button>
                    <button onClick={()=> fetchBountiesClaims(currentPage-1)} disabled={currentPage===0}>Previous</button>
                    <span>Page {currentPage+1} of {totalPages}</span>
                    <button onClick={()=> fetchBountiesClaims(currentPage+1)} disabled={currentPage===totalPages-1}>Next</button>
                    <button onClick={()=> fetchBountiesClaims(totalPages-1)} disabled={currentPage===totalPages-1}>Last</button>
                </div>
            </div>
        )}
        {selectedBountiesClaim && (
            <div>
                <h2>ClaimDate: {selectedBountiesClaim.claimDate}</h2>
                <p>FinishDate: {selectedBountiesClaim.finishDate}</p>
                <h3>Bounties</h3>
                {selectedBountiesClaim.bountyDTOS?.length ?(
                    selectedBountiesClaim.bountyDTOS.map(bounty=>(
                        <div key={bounty.bountyID}>
                            <p>Description: {bounty.description}</p>
                            <p>Reward: {bounty.reward}</p>
                            <p>Status: {bounty.status}</p>
                            <p>Difficulty: {bounty.difficulty}</p>
                        </div>
                    ))
                ) : (
                    <p>no Active Bounty</p>
                )}
                <h3>Player</h3>
                {selectedBountiesClaim.playerDTOS.length ? (
                    selectedBountiesClaim.playerDTOS.map((player)=>(
                        <li key={player.id}>
                            <p>Name: {player.name}</p>
                            <p>Class: {player.clazz}</p>
                            <p>Speciality: {player.speciality}</p>
                            <p>Persuasion: {player.persuasion}</p>
                        </li>
                    ))
                ) : (
                    <p>No active player</p>
                )}
                <button onClick={()=> setSelectedBountiesClaim(null)}>Back to List</button>
            </div>
        )}
    </div>
);
}

export default RewardClaim;