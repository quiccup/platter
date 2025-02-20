'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const WORDS = [
  'PASTA', 'PIZZA', 'SUSHI', 'SALAD', 'STEAK', 'BREAD', 'CURRY', 'SPICE',
  'PLATE', 'KNIFE', 'FRESH', 'SWEET', 'TASTY', 'BLEND', 'BROTH', 'CREAM',
  'FEAST', 'GRILL', 'HERBS', 'JUICE', 'LUNCH', 'MEALS', 'ONION', 'OVEN',
  'ROAST', 'SAUCE', 'SERVE', 'SHARP', 'SLICE', 'SMOKY', 'SOUPY', 'TABLE',
  'TOAST', 'YUMMY', 'ZESTY', 'BACON', 'BAKED', 'BOILS', 'CHEFS', 'DICED',
  'DINER', 'DRINK', 'EATEN', 'FRIES', 'GRAVY', 'GREEN', 'MEATY', 'MENU',
  'QUICK', 'STEAM'
]

const KEYBOARD_KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
]

interface PlayDisplayProps {
  data?: any
}

export function PlayDisplay({ data }: PlayDisplayProps) {
  const [gameStarted, setGameStarted] = useState(false)
  const [word, setWord] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const maxGuesses = 6
  const [error, setError] = useState(false)

  // Initialize game
  useEffect(() => {
    if (gameStarted) {
      const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
      setWord(randomWord)
      setGuesses([])
      setCurrentGuess('')
      setGameOver(false)
      setWon(false)
    }
  }, [gameStarted])

  const handleKeyPress = (key: string) => {
    if (!gameStarted || gameOver) return

    if (key === 'ENTER') {
      if (currentGuess.length !== 5) {
        // Show error if word is not 5 letters
        setError(true)
        setTimeout(() => setError(false), 1000)
        return
      }

      if (!WORDS.includes(currentGuess)) {
        // Show error if word is not in list
        setError(true)
        setTimeout(() => setError(false), 1000)
        return
      }
      
      const newGuesses = [...guesses, currentGuess]
      setGuesses(newGuesses)
      setCurrentGuess('')

      if (currentGuess === word) {
        setWon(true)
        setGameOver(true)
      } else if (newGuesses.length >= maxGuesses) {
        setGameOver(true)
      }
    } else if (key === '⌫') {
      setCurrentGuess(prev => prev.slice(0, -1))
    } else if (currentGuess.length < 5) {
      setCurrentGuess(prev => (prev + key).toUpperCase())
    }
  }

  // Update keyboard event handler to use handleKeyPress
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleKeyPress('ENTER')
      } else if (e.key === 'Backspace') {
        handleKeyPress('⌫')
      } else if (/^[A-Za-z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase())
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameStarted, gameOver, currentGuess, word, guesses])

  const getLetterColor = (letter: string, index: number, guess: string) => {
    if (guess[index] === word[index]) {
      return 'bg-green-500'
    }
    if (word.includes(letter)) {
      return 'bg-yellow-500'
    }
    return 'bg-gray-600'
  }

  const getKeyColor = (key: string) => {
    if (!gameStarted) return 'bg-white'
    
    for (const guess of guesses) {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === key) {
          if (word[i] === key) return 'bg-green-500 text-white'
          if (word.includes(key)) return 'bg-yellow-500 text-white'
          return 'bg-gray-400 text-white'
        }
      }
    }
    return 'bg-white'
  }

  return (
    <section className="w-full bg-white text-black py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-lg text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-600">
          Answer Wordles to Earn Points
        </h2>
        
        {!gameStarted ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGameStarted(true)}
            className="bg-gradient-to-r from-orange-400 to-pink-600 px-8 py-3 rounded-full 
              font-bold text-lg shadow-lg hover:shadow-xl transition-shadow text-white"
          >
            Start Game
          </motion.button>
        ) : (
          <div className="space-y-8">
            {/* Current row error shake animation */}
            <motion.div 
              className="grid grid-rows-6 gap-3"
              animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              {/* Guesses Grid */}
              {Array(maxGuesses).fill(0).map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-5 gap-3">
                  {Array(5).fill(0).map((_, colIndex) => {
                    const letter = rowIndex < guesses.length 
                      ? guesses[rowIndex][colIndex]
                      : rowIndex === guesses.length && currentGuess[colIndex]
                        ? currentGuess[colIndex]
                        : ''

                    return (
                      <motion.div
                        key={colIndex}
                        initial={{ scale: letter ? 0 : 1 }}
                        animate={{ scale: 1 }}
                        className={`h-14 md:h-16 flex items-center justify-center text-2xl font-bold rounded-xl
                          shadow-md border border-gray-200
                          ${letter && rowIndex < guesses.length 
                            ? getLetterColor(letter, colIndex, guesses[rowIndex])
                            : 'bg-white'}`}
                      >
                        {letter}
                      </motion.div>
                    )
                  })}
                </div>
              ))}
            </motion.div>

            {/* Virtual Keyboard */}
            <div className="md:hidden space-y-2">
              {KEYBOARD_KEYS.map((row, i) => (
                <div key={i} className="flex justify-center gap-1">
                  {row.map((key) => (
                    <button
                      key={key}
                      onClick={() => handleKeyPress(key)}
                      className={`${
                        key === 'ENTER' || key === '⌫' 
                          ? 'px-3 text-xs' 
                          : 'w-8'
                      } h-12 text-sm font-medium rounded-lg shadow-sm
                      ${getKeyColor(key)}
                      active:scale-95 transition-transform
                      disabled:opacity-50`}
                      disabled={
                        (key === 'ENTER' && currentGuess.length !== 5) ||
                        (key !== 'ENTER' && key !== '⌫' && currentGuess.length >= 5)
                      }
                    >
                      {key}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Game Over State */}
            {gameOver && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 mt-8"
              >
                <p className="text-2xl font-bold">
                  {won ? '🎉 Congratulations! 🎉' : `Word was: ${word}`}
                </p>
                <button
                  onClick={() => {
                    setGameStarted(true)
                  }}
                  className="bg-gradient-to-r from-orange-400 to-pink-600 text-white
                    px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-shadow"
                >
                  Play Again
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
