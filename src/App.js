import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});

  // Load from localStorage on component mount
  useEffect(() => {
    const savedPlayers = JSON.parse(localStorage.getItem('players')) || [];
    const savedScores = JSON.parse(localStorage.getItem('scores')) || {};
    setPlayers(savedPlayers);
    setScores(savedScores);
  }, []);

  // Save to localStorage whenever players or scores change
  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('scores', JSON.stringify(scores));
  }, [players, scores]);

  // Add a new player
  const addPlayer = () => {
    const playerName = prompt("Enter player's name:");
    if (playerName) {
      setPlayers([...players, playerName]);
      setScores({ ...scores, [playerName]: [] });
    }
  };

  // Add a score to a specific player
  const addScore = (player) => {
    if (scores[player].reduce((acc, curr) => acc + curr, 0) >= 201) return;

    const score = parseInt(prompt(`Enter score for ${player}:`), 10);
    if (!isNaN(score)) {
      const updatedScores = {
        ...scores,
        [player]: [...scores[player], score],
      };
      setScores(updatedScores);
    }
  };

  // Edit a player's name
  const editPlayer = (oldName) => {
    const newName = prompt(`Edit name for ${oldName}:`, oldName);
    if (newName && newName !== oldName) {
      const updatedPlayers = players.map(player =>
        player === oldName ? newName : player
      );
      const updatedScores = { ...scores, [newName]: scores[oldName] };
      delete updatedScores[oldName];
      setPlayers(updatedPlayers);
      setScores(updatedScores);
    }
  };

  // Edit a player's score
  const editScore = (player, index) => {
    const newScore = parseInt(prompt(`Edit score for ${player}:`, scores[player][index]), 10);
    if (!isNaN(newScore)) {
      const updatedScores = { ...scores };
      updatedScores[player][index] = newScore;
      setScores(updatedScores);
    }
  };

  // Delete a player
  const deletePlayer = (player) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${player}?`);
    if (confirmDelete) {
      const updatedPlayers = players.filter(p => p !== player);
      const updatedScores = { ...scores };
      delete updatedScores[player];
      setPlayers(updatedPlayers);
      setScores(updatedScores);
    }
  };

  // Start a new game (reset scores)
  const newGame = () => {
    const confirmNewGame = window.confirm('Start a new game? This will reset all scores but keep the names.');
    if (confirmNewGame) {
      const resetScores = {};
      players.forEach(player => {
        resetScores[player] = [];
      });
      setScores(resetScores);
    }
  };

  // Calculate total score of a player
  const calculateTotal = (player) => {
    return scores[player].reduce((acc, curr) => acc + curr, 0);
  };

  return (
    <div className="App">
      <h1>Card Game Scoreboard</h1>
      <button onClick={addPlayer}>Add Player</button>
      <button onClick={newGame}>New Game</button>

      <div className="scoreboard">
        <table>
          <thead>
            <tr>
              {players.map((player, index) => (
                <th key={index}>
                  <span onClick={() => editPlayer(player)}>{player}</span>
                  <button onClick={() => deletePlayer(player)}>Delete</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.max(...Object.values(scores).map(arr => arr.length+1), 1) }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {players.map((player, colIndex) => (
                  <td
                    key={colIndex}
                    onClick={() => addScore(player)}
                    style={{
                      backgroundColor:
                        calculateTotal(player) >= 201 ? 'red' : 'transparent',
                    }}
                  >
                    <span onDoubleClick={() => editScore(player, rowIndex)}>
                      {scores[player][rowIndex] || ''}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              {players.map((player, index) => (
                <td
                  key={index}
                  style={{
                    backgroundColor:
                      calculateTotal(player) >= 201 ? 'red' : 'lightgray',
                  }}
                >
                  <strong>{calculateTotal(player)}</strong>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
