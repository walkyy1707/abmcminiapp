import React, { useState, useEffect } from 'react';

function Home({ initData }) {
  const [userData, setUserData] = useState(null);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [initData]); // Refetch if initData changes

  const fetchUser = async () => {
    try {
      const response = await fetch(
        `/user?start_param=${encodeURIComponent(window.Telegram.WebApp.initDataUnsafe.start_param || '')}`,
        {
          headers: { Authorization: `Bearer ${initData}` },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Optionally set an error state for UI display
    }
  };

  const claimTicket = async () => {
    setIsClaiming(true);
    try {
      const response = await fetch('/claim_ticket', {
        method: 'POST',
        headers: { Authorization: `Bearer ${initData}` },
      });
      if (!response.ok) throw new Error('Failed to claim ticket');
      const data = await response.json();
      setUserData((prev) => ({ ...prev, tickets: data.tickets }));
    } catch (error) {
      console.error('Error claiming ticket:', error);
      alert('Failed to claim ticket. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div>
      <p>Points: {userData.points}</p>
      <p>Tickets: {userData.tickets}/7</p>
      <button
        onClick={claimTicket}
        disabled={
          isClaiming ||
          userData.tickets >= 7 ||
          userData.last_ticket_date === new Date().toISOString().split('T')[0]
        }
      >
        {isClaiming ? 'Claiming...' : 'Claim Daily Ticket'}
      </button>
    </div>
  );
}

export default Home;