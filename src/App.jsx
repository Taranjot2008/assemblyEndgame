import Header from './components/Header';
import languages from './components/languages';
import React from 'react';
import clsx from 'clsx'
import generateRandomWord from './components/utils'
import Confetti from 'react-confetti'
import tokens from './assets/shield-tokens.svg'

export default function App() {

    const [currentWord, setCurrentWord] = React.useState(() => generateRandomWord());
    const [guessedLetter, setGuessedLetter] = React.useState([])
    const [points, setPoints] = React.useState(0)

    const wordarray = currentWord.split("");

    const wrongGuessCount = guessedLetter.filter(letter  => !currentWord.includes(letter)).length

    //keyboard
    const alphabets = 'abcdefghijklmnopqrstuvwxyz' 
    const isGameWon = currentWord.split('').every(letter => guessedLetter.includes(letter))
    const isGameLost = wrongGuessCount >= languages.length - 1
    const isGameOver = isGameWon || isGameLost

    //points awarded check
    const [hasAwardedPoints, setHasAwardedPoints] = React.useState(false)


    function AddguessedLetter(letter) {
        setGuessedLetter(prevletters => (
            prevletters.includes(letter) ? prevletters : [...prevletters, letter]
        ))
    }
    
    const languageElement = languages.map((language, index) => {
        const isLanguageLost = index < wrongGuessCount

        return (
            <div 
            key={index} 
            style={{ backgroundColor: language.backgroundColor, color: language.textColor }}    
            className={`language-card ${isLanguageLost ? 'lost' : ''}`}>
                <p>{language.name}</p>
            </div>
        )
    })

    function setGameStatus(){
        if (!isGameOver) {
            return null
        }

        if (isGameWon){
            return (
                <>
                    <p className="status-heading text-4xl mb-5 font-bold">🏆 You Win!</p>
                    <p className="status-subheading text-lg font-medium max-sm:text-sm">The word was '{currentWord}'. Click 'New Game' to play again!</p>
                </>
            )
        }

        if (isGameLost) {
            return (
                <>
                    <p className="status-heading text-4xl mb-5 font-bold">👎 You Lost!</p>
                    <p className="status-subheading text-lg font-medium max-sm:text-sm text-center">The word was '{currentWord}''. Click 'New Game' to play again!</p>
                </>
            )
        }
    }

    function startNewGame() {
        setCurrentWord(generateRandomWord())
        setGuessedLetter([])
        setHasAwardedPoints(false)
    }

    const word = wordarray.map((letter, index) => {
        const revealLetter = isGameLost || guessedLetter.includes(letter)

        const missedLetter = clsx (
            isGameLost && !guessedLetter.includes(letter) && 'missed-letter'
        )

        return (
            <span key={index} className={`word-letter ${missedLetter} text-4xl font-bold uppercase bg-gray-700 px-5 py-4
            border-b-4 border-b-sky-400 min-w-[64px] max-[430px]:text-2xl max-[430px]:min-w-[32px]
            max-[430px]:px-3 max-[430px]:py-2 max-sm:text-center`}>
                {revealLetter ? letter.toUpperCase() : ' '}
            </span>
    )})



    const keyboardLetters = alphabets.split('').map(letter => {
        const isGuessed = guessedLetter.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)

        const className = clsx({
            correct: isCorrect,
            wrong: isWrong, 
        })

        return (
            <button
                type='button'
                aria-label={`Letter is ${letter}`}
                key={letter}
                onClick={() => AddguessedLetter(letter)}
                disabled={guessedLetter.includes(letter) || isGameOver}
                className={`${className} key-letter bg-amber-500 text-white duration-300 transition-all text-4xl p-4 min-w-[64px] z-10
                    text-center font-bold rounded-sm hover:cursor-pointer hover:bg-amber-600 sm:text-3xl max-sm:text-xl
                    max-sm:min-w-[48px] max-sm:p-2`}
                >
                {letter.toUpperCase()}
            </button>

        )
    })

    const gameStatusClass = clsx({
        active: isGameOver,
        gameWon: isGameWon,
        gameLost: isGameLost
    })

    React.useEffect(() => {
        if (isGameWon && !hasAwardedPoints) {
            setPoints(prev => prev + 500)
            setHasAwardedPoints(true)
        }

        if (isGameLost && !hasAwardedPoints) {
            setPoints(prev => prev - 100)
            setHasAwardedPoints(true)
        }

        console.log(hasAwardedPoints)

    }, [isGameWon, isGameLost, points, hasAwardedPoints])

    

    return (
        <main className='main-app flex flex-col items-center mb-10'>
            <Header />

            <div className="points-section bg-gray-50/[0.10] absolute lg:top-8 lg:right-8 min-w-[120px] flex
            justify-center px-4 py-2 gap-3 rounded-full sm:top-3 sm:right-3 sm:min-w-[100px]
            max-sm:top-0 max-sm:right-0 max-sm:bg-(--root-color) -z-10">
                <img src={tokens} alt="Shield tokens" className='w-5 max-sm:w-4' />
                <p className="points-counter font-bold ma-sm:text-[12px]">: {points}</p>
            </div>

            <div className="fixed z-0 w-full h-screen ">
                {isGameWon && <Confetti
                drawShape={ctx => {
                    ctx.beginPath()
                    for(let i = 0; i < 22; i++) {
                        const angle = 0.35 * i
                        const x = (0.2 + (1.5 * angle)) * Math.cos(angle)
                        const y = (0.2 + (1.5 * angle)) * Math.sin(angle)
                        ctx.lineTo(x, y)
                    }
                    ctx.stroke()
                    ctx.closePath()
                    }}
                />}
            </div>
            

            <div className="fixed z-0 w-full h-screen">
                {isGameLost && <Confetti
                    drawShape={ctx => {
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.bezierCurveTo(-5, -5, -10, 5, 0, 10);
                        ctx.bezierCurveTo(10, 5, 5, -5, 0, 0);
                        ctx.closePath();
                        ctx.fill();
                }}
                    numberOfPieces={200}
                    gravity={0.1}
                    wind={0}
                    colors={['#ff4d4d', '#ff9999', '#cc0000']} // muted grays
                    recycle={false}
                    />
                }
            </div>

            <section aria-live='polite' role='status' className={`${gameStatusClass} hidden lg:w-2/5 min-h-35 mt-10 p-5
            sm:w-4/5 max-sm:w-4/5`}>
                {setGameStatus()}
            </section>

            <section className="languages flex flex-wrap justify-center gap-3 mt-15 lg:w-2/5 sm:w-4/5 max-sm:w-9/10 max-sm:mt-10 -z-10">
                {languageElement}
            </section>

            <section className="word-container mt-10 flex gap-1 px-2">
                {word}
            </section>

            <section className="sr-only" aria-live='polite' role='status'>
                <p>Current Word is: {currentWord.split('').map(letter => 
                    guessedLetter.includes(letter) ? letter + '.' : 'blank.'
                )}</p>
            </section>

            <section className='keyboard flex flex-wrap max-w-2xl gap-2 justify-center mt-[24px]'>
                {keyboardLetters}
            </section>

            {isGameOver && 
            <button 
                type='button'
                className="newGame-btn text-2xl font-semibold bg-sky-500 transition-all duration-300 text-white py-2 px-4 z-10
                lg:w-1/4 mt-6 rounded-md ring-white ring-2 hover:cursor-pointer hover:bg-sky-600
                max-sm:2/5" 
                onClick={startNewGame}>
                <span>🎯</span>
                New Game
            </button>}
        </main>
    )
}