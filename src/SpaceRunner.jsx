import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Star, Zap, Trophy, Target, Clock, Rocket, Home, User, LogOut, Medal, Crown } from 'lucide-react';

const SpaceRunner = () => {
  const [gameState, setGameState] = useState('menu'); // menu, login, signup, playing, gameOver, scoreboard
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeLeft, setTimeLeft] = useState(60);
  const [startTime, setStartTime] = useState(null);
  const [totalChars, setTotalChars] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [particles, setParticles] = useState([]);
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signupForm, setSignupForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [userStats, setUserStats] = useState({ gamesPlayed: 0, bestWPM: 0, bestAccuracy: 0, totalScore: 0 });
  const [leaderboard, setLeaderboard] = useState([]);
  const inputRef = useRef(null);
  
  const starWarsTexts = [
    "A long time ago in a galaxy far, far away...",
    "May the Force be with you, young Skywalker.",
    "Do or do not, there is no try.",
    "I find your lack of faith disturbing.",
    "The Force will be with you, always.",
    "These aren't the droids you're looking for.",
    "Help me, Obi-Wan Kenobi. You're my only hope.",
    "I am your father, Luke.",
    "Fear leads to anger, anger leads to hate.",
    "Size matters not. Judge me by my size, do you?",
    "The dark side of the Force is a pathway to many abilities some consider to be unnatural.",
    "Your focus determines your reality.",
    "In my experience, there is no such thing as luck.",
    "The ability to destroy a planet is insignificant next to the power of the Force.",
    "I've got a bad feeling about this."
  ];

  // Initialize mock data
  useEffect(() => {
    // Mock leaderboard data
    setLeaderboard([
      { rank: 1, username: "JediMaster_Luke", wpm: 142, accuracy: 98.5, score: 15420 },
      { rank: 2, username: "DarthTyper", wpm: 138, accuracy: 97.2, score: 14890 },
      { rank: 3, username: "PrincessLeia", wpm: 135, accuracy: 99.1, score: 14650 },
      { rank: 4, username: "HanSolo_Fast", wpm: 128, accuracy: 95.8, score: 13280 },
      { rank: 5, username: "Yoda_Wisdom", wpm: 125, accuracy: 100, score: 13000 },
      { rank: 6, username: "ObiWan_Noble", wpm: 120, accuracy: 96.5, score: 12450 },
      { rank: 7, username: "ChewieRoars", wpm: 115, accuracy: 94.2, score: 11950 },
      { rank: 8, username: "R2D2_Beeps", wpm: 110, accuracy: 92.8, score: 11200 },
      { rank: 9, username: "C3PO_Protocol", wpm: 105, accuracy: 98.9, score: 10890 },
      { rank: 10, username: "BB8_Rolling", wpm: 102, accuracy: 91.5, score: 10540 }
    ]);
  }, []);

  const generateText = () => {
    const randomTexts = [];
    for (let i = 0; i < 3; i++) {
      randomTexts.push(starWarsTexts[Math.floor(Math.random() * starWarsTexts.length)]);
    }
    return randomTexts.join(' ');
  };

  const createParticle = useCallback((x, y, color = '#00ff41') => {
    const newParticle = {
      id: Math.random(),
      x: x || Math.random() * window.innerWidth,
      y: y || Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      color,
      life: 1,
      size: Math.random() * 3 + 1
    };
    setParticles(prev => [...prev.slice(-50), newParticle]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 0.02
        })).filter(p => p.life > 0)
      );
    }, 16);
    return () => clearInterval(interval);
  }, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleGameEnd = () => {
      if (user) {
        // Update user stats
        setUserStats(prev => ({
          gamesPlayed: prev.gamesPlayed + 1,
          bestWPM: Math.max(prev.bestWPM, wpm),
          bestAccuracy: Math.max(prev.bestAccuracy, accuracy),
          totalScore: prev.totalScore + score
        }));
      }
      setGameState('gameOver');
    };
    const intervalRef = useRef(null);
    useEffect(() => {
      if (gameState === 'playing') {
        intervalRef.current = setInterval(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
    
        return () => clearInterval(intervalRef.current);
      }
    }, [gameState]);
    
    useEffect(() => {
      if (gameState === 'playing' && timeLeft <= 0) {
        clearInterval(intervalRef.current);
        handleGameEnd();
      }
    }, [timeLeft, gameState, handleGameEnd]);
     
   

    useEffect(() => {
      console.log('timeLeft changed:', timeLeft);
    }, [timeLeft]);
    
  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login - in real app, this would call your Django API
    if (loginForm.username && loginForm.password) {
      const mockUser = {
        username: loginForm.username,
        email: `${loginForm.username}@galaxy.com`
      };
      setUser(mockUser);
      // Mock user stats
      setUserStats({
        gamesPlayed: Math.floor(Math.random() * 50) + 1,
        bestWPM: Math.floor(Math.random() * 100) + 50,
        bestAccuracy: Math.floor(Math.random() * 20) + 80,
        totalScore: Math.floor(Math.random() * 50000) + 10000
      });
      setGameState('menu');
      setLoginForm({ username: '', password: '' });
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupForm.username && signupForm.email && signupForm.password && 
        signupForm.password === signupForm.confirmPassword) {
      const mockUser = {
        username: signupForm.username,
        email: signupForm.email
      };
      setUser(mockUser);
      setUserStats({ gamesPlayed: 0, bestWPM: 0, bestAccuracy: 0, totalScore: 0 });
      setGameState('menu');
      setSignupForm({ username: '', email: '', password: '', confirmPassword: '' });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUserStats({ gamesPlayed: 0, bestWPM: 0, bestAccuracy: 0, totalScore: 0 });
    setGameState('menu');
  };

 

  const startGame = () => {
    setGameState('playing');
    setCurrentText(generateText());
    setUserInput('');
    setScore(0);
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(60);
    setStartTime(Date.now());
    setTotalChars(0);
    setCorrectChars(0);
    setParticles([]);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const goHome = () => {
    setGameState('menu');
    setUserInput('');
    setParticles([]);
  };

  const handleInputChange = (e) => {
    if (gameState !== 'playing') return;
    
    const value = e.target.value;
    setUserInput(value);
    setTotalChars(value.length);
    
    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === currentText[i]) {
        correct++;
      }
    }
    setCorrectChars(correct);
    setAccuracy(totalChars > 0 ? Math.round((correct / totalChars) * 100) : 100);
    
    if (value === currentText) {
      setScore(score + 100);
      setCurrentText(generateText());
      setUserInput('');
      // Celebration particles
      for (let i = 0; i < 10; i++) {
        createParticle(Math.random() * window.innerWidth, Math.random() * window.innerHeight, '#ffff00');
      }
    }
    
    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    if (timeElapsed > 0) {
      setWpm(Math.round((correct / 5) / timeElapsed));
    }

    if (value[value.length - 1] === currentText[value.length - 1]) {
      createParticle();
    }
  };

  const renderText = () => {
    return currentText.split('').map((char, index) => {
      let className = 'text-2xl font-galactic ';
      if (index < userInput.length) {
        className += userInput[index] === char ? 'text-green-400 bg-green-900/30' : 'text-red-400 bg-red-900/30';
      } else if (index === userInput.length) {
        className += 'text-white bg-blue-500/50 animate-pulse';
      } else {
        className += 'text-gray-400';
      }
      return (
        <span key={index} className={className + ' p-1 rounded transition-all duration-200'}>
          {char}
        </span>
      );
    });
  };

  // Login Screen
  if (gameState === 'login') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="bg-gray-900/90 backdrop-blur-sm p-8 rounded-lg border border-blue-500/30 w-full max-w-md z-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
              JEDI LOGIN
            </h2>
            <p className="text-blue-300">Access your galactic records</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full p-3 bg-gray-800 border border-blue-500/50 rounded text-white focus:outline-none focus:border-blue-400"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full p-3 bg-gray-800 border border-blue-500/50 rounded text-white focus:outline-none focus:border-blue-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              <User className="inline w-5 h-5 mr-2" />
              LOGIN
            </button>
          </form>
          
          <div className="text-center mt-6 space-y-2">
            <button
              onClick={() => setGameState('signup')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Don't have an account? Join the Resistance
            </button>
            <br />
            <button
              onClick={goHome}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <Home className="inline w-4 h-4 mr-1" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Signup Screen
  if (gameState === 'signup') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="bg-gray-900/90 backdrop-blur-sm p-8 rounded-lg border border-blue-500/30 w-full max-w-md z-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
              JOIN THE FORCE
            </h2>
            <p className="text-green-300">Create your galactic identity</p>
          </div>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={signupForm.username}
              onChange={(e) => setSignupForm({...signupForm, username: e.target.value})}
              className="w-full p-3 bg-gray-800 border border-green-500/50 rounded text-white focus:outline-none focus:border-green-400"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signupForm.email}
              onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
              className="w-full p-3 bg-gray-800 border border-green-500/50 rounded text-white focus:outline-none focus:border-green-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signupForm.password}
              onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
              className="w-full p-3 bg-gray-800 border border-green-500/50 rounded text-white focus:outline-none focus:border-green-400"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={signupForm.confirmPassword}
              onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
              className="w-full p-3 bg-gray-800 border border-green-500/50 rounded text-white focus:outline-none focus:border-green-400"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded hover:from-green-700 hover:to-blue-700 transition-all duration-300"
            >
              <Star className="inline w-5 h-5 mr-2" />
              JOIN THE REBELLION
            </button>
          </form>
          
          <div className="text-center mt-6 space-y-2">
            <button
              onClick={() => setGameState('login')}
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              Already a Jedi? Login here
            </button>
            <br />
            <button
              onClick={goHome}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <Home className="inline w-4 h-4 mr-1" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Scoreboard Screen
  if (gameState === 'scoreboard') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              GALACTIC LEADERBOARD
            </h1>
            <button
              onClick={goHome}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-yellow-500/30 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4">
                <div className="grid grid-cols-5 gap-4 text-center font-bold text-black">
                  <div>RANK</div>
                  <div>PILOT</div>
                  <div>WPM</div>
                  <div>ACCURACY</div>
                  <div>SCORE</div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-700">
                {leaderboard.map((player, index) => (
                  <div
                    key={player.rank}
                    className={`grid grid-cols-5 gap-4 p-4 text-center transition-all duration-300 hover:bg-gray-800/50 ${
                      index < 3 ? 'bg-gradient-to-r from-gray-800/30 to-gray-700/30' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {index === 0 && <Crown className="w-6 h-6 text-yellow-400 mr-2" />}
                      {index === 1 && <Medal className="w-6 h-6 text-gray-300 mr-2" />}
                      {index === 2 && <Medal className="w-6 h-6 text-orange-600 mr-2" />}
                      <span className={`text-lg font-bold ${
                        index === 0 ? 'text-yellow-400' : 
                        index === 1 ? 'text-gray-300' : 
                        index === 2 ? 'text-orange-600' : 'text-white'
                      }`}>
                        #{player.rank}
                      </span>
                    </div>
                    <div className="text-blue-300 font-mono">{player.username}</div>
                    <div className="text-green-400 font-bold">{player.wpm}</div>
                    <div className="text-purple-400">{player.accuracy}%</div>
                    <div className="text-yellow-400 font-bold">{player.score.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {user && (
              <div className="mt-8 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-blue-500/30 p-6">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">Your Stats, {user.username}</h3>
                <div className="grid grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{userStats.gamesPlayed}</div>
                    <div className="text-gray-400">Games Played</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{userStats.bestWPM}</div>
                    <div className="text-gray-400">Best WPM</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">{userStats.bestAccuracy}%</div>
                    <div className="text-gray-400">Best Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">{userStats.totalScore.toLocaleString()}</div>
                    <div className="text-gray-400">Total Score</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Menu
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* User info bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
          <div className="text-blue-300">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span className="font-mono">Welcome, {user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={() => setGameState('login')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => setGameState('signup')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-all duration-300"
                >
                  <Star className="w-4 h-4" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setGameState('scoreboard')}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-all duration-300"
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </button>
        </div>
        
        <div className="text-center z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              SPACE RUNNER
            </h1>
            <p className="text-2xl text-blue-300 font-mono animate-bounce">
              Type at the speed of light in a galaxy far, far away...
            </p>
          </div>
          
          <div className="flex justify-center space-x-8 text-cyan-300">
            <div className="flex items-center space-x-2">
              <Target className="w-6 h-6" />
              <span>Accuracy Training</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-6 h-6" />
              <span>Speed Boost</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6" />
              <span>Galactic Scores</span>
            </div>
          </div>
          
          <button
            onClick={startGame}
            className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-full hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
          >
            <Rocket className="inline-block w-6 h-6 mr-2 group-hover:animate-bounce" />
            Launch Mission
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    );
  }

  // Game Over Screen
  if (gameState === 'gameOver') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              backgroundColor: particle.color,
              opacity: particle.life,
              transform: `scale(${particle.size})`
            }}
          />
        ))}
        
        <div className="text-center z-10 space-y-8">
          <div className="flex justify-between items-center mb-8 w-full">
            <button
              onClick={goHome}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setGameState('scoreboard')}
              className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-all duration-300"
            >
              <Trophy className="w-5 h-5" />
              <span>Leaderboard</span>
            </button>
          </div>
          
          <h2 className="text-6xl font-bold text-yellow-400 animate-pulse">
            Mission Complete!
          </h2>
          
          <div className="grid grid-cols-2 gap-8 text-center">
            <div className="bg-gray-900/80 p-6 rounded-lg border border-blue-500/50">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{score}</div>
              <div className="text-blue-300">Score</div>
            </div>
            <div className="bg-gray-900/80 p-6 rounded-lg border border-green-500/50">
              <Zap className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{wpm}</div>
              <div className="text-green-300">WPM</div>
            </div>
            <div className="bg-gray-900/80 p-6 rounded-lg border border-purple-500/50">
              <Target className="w-12 h-12 text-purple-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{accuracy}%</div>
              <div className="text-purple-300">Accuracy</div>
            </div>
            <div className="bg-gray-900/80 p-6 rounded-lg border border-red-500/50">
              <Clock className="w-12 h-12 text-red-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{correctChars}</div>
              <div className="text-red-300">Characters</div>
            </div>
          </div>
          
          <div className="flex space-x-4 justify-center">
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white text-xl font-bold rounded-full hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300"
            >
              New Mission
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing Game Screen
  return (
    <div className="min-h-screen bg-[url('/background.jpg')] bg-contain bg-center justify-center relative overflow-hidden">
      {/* Animated particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            opacity: particle.life,
            transform: `scale(${particle.size})`
          }}
        />
      ))}
      
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-gray-900/50 backdrop-blur-sm border-b border-blue-500/30">
        <div className="flex items-center space-x-4">
          <button
            onClick={goHome}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            SPACE RUNNER
          </h1>
        </div>
        <div className="flex space-x-8 text-white">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-red-400" />
            <span className="text-xl font-mono">{timeLeft}s</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-green-400" />
            <span className="text-xl font-mono">{wpm} WPM</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-400" />
            <span className="text-xl font-mono">{accuracy}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-xl font-mono">{score}</span>
          </div>
        </div>
      </div>
      
      {/* Game Area */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8">
        <div className="max-w-4xl w-full bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 border border-blue-500/30 shadow-2xl">
          <div className="mb-8 p-6 bg-black/50 rounded-lg border border-gray-700">
            <div className="leading-relaxed font-mono text-center">
              {renderText()}
            </div>
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="w-full p-4 text-xl bg-gray-800 border border-blue-500/50 rounded-lg text-white font-mono focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
            placeholder="Type here to begin your journey..."
            autoFocus
          />
          
          <div className="mt-6 text-center">
            <div className="text-blue-300 font-mono">
              Progress: {userInput.length} / {currentText.length} characters
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(userInput.length / currentText.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceRunner;