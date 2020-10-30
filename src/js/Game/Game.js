import React, {useEffect, useState} from "react";
import uuid from "uuid";

import deepcopy from "deepcopy";
import Card from "../Card/Card";

const cardImages = [
	"clubs_10.png", "clubs_2.png", "clubs_3.png", "clubs_4.png", "clubs_5.png",
	"clubs_6.png", "clubs_7.png", "clubs_8.png", "clubs_9.png", "clubs_A.png",
	"clubs_J.png", "clubs_K.png", "clubs_Q.png",
	"diamonds_10.png", "diamonds_2.png", "diamonds_3.png", "diamonds_4.png",
	"diamonds_5.png", "diamonds_6.png", "diamonds_7.png", "diamonds_8.png",
	"diamonds_9.png", "diamonds_A.png", "diamonds_J.png", "diamonds_K.png",
	"diamonds_Q.png",
	"hearts_10.png", "hearts_2.png", "hearts_3.png", "hearts_4.png",
	"hearts_5.png", "hearts_6.png", "hearts_7.png", "hearts_8.png",
	"hearts_9.png", "hearts_A.png", "hearts_J.png", "hearts_K.png",
	"hearts_Q.png",
	"spades_10.png", "spades_2.png", "spades_3.png", "spades_4.png",
	"spades_5.png", "spades_6.png", "spades_7.png", "spades_8.png",
	"spades_9.png", "spades_A.png", "spades_J.png", "spades_K.png",
	"spades_Q.png"
];

function shuffleArray(array) {
	return array.sort(() => .5 - Math.random());
}

function generateCards(count) {
	if (count % 2 !== 0)
		throw "Count must be even: 2, 4, 6, etc. but it is " + count;

	const cards = shuffleArray(cardImages)
		.slice(0, count / 2)
		.map(imageURL => ({
			id: uuid.v4(),
			imageURL: "static/images/cards/" + imageURL,
			isFlipped: false,
			canFlip: true
		}))
		.flatMap(e => [e, {...deepcopy(e), id: uuid.v4()}]);

	return shuffleArray(cards);
}

export default function Game({fieldWidth=6, fieldHeight=3}) {
	const totalCards = fieldWidth * fieldHeight;

	const [cards, setCards] = useState(generateCards(totalCards));
	const [canFlip, setCanFlip] = useState(false);
	const [firstCard, setFirstCard] = useState(null);
	const [secondCard, setSecondCard] = useState(null);

	function setCardIsFlipped(cardID, isFlipped) {
		setCards(prev => prev.map(c => {
			if (c.id !== cardID)
				return c;
			return {...c, isFlipped};
		}));
	}
	function setCardCanFlip(cardID, canFlip) {
		setCards(prev => prev.map(c => {
			if (c.id !== cardID)
				return c;
			return {...c, canFlip};
		}));
	}

	// showcase
	useEffect(() => {
		setTimeout(() => {
			let index = 0;
			for (const card of cards) {
				setTimeout(() => setCardIsFlipped(card.id, true), index++ * 100);
			}
			setTimeout(() => setCanFlip(true), cards.length * 100);
		}, 3000);
	}, []);


	function resetFirstAndSecondCards() {
		setFirstCard(null);
		setSecondCard(null);
	}

	function onSuccessGuess() {
		setCardCanFlip(firstCard.id, false);
		setCardCanFlip(secondCard.id, false);
		setCardIsFlipped(firstCard.id, false);
		setCardIsFlipped(secondCard.id, false);
		resetFirstAndSecondCards();
	}
	function onFailureGuess() {
		const firstCardID = firstCard.id;
		const secondCardID = secondCard.id;

		setTimeout(() => {
			setCardIsFlipped(firstCardID, true);
		}, 1000);
		setTimeout(() => {
			setCardIsFlipped(secondCardID, true);
		}, 1200);

		resetFirstAndSecondCards();
	}

	useEffect(() => {
		if (!firstCard || !secondCard)
			return;
		(firstCard.imageURL === secondCard.imageURL) ? onSuccessGuess() : onFailureGuess();
	}, [firstCard, secondCard]);


	function onCardClick(card) {
		if (!canFlip)
			return;
		if (!card.canFlip)
			return;

		if ((firstCard && (card.id === firstCard.id)) || (secondCard && (card.id === secondCard.id)))
			return;

		setCardIsFlipped(card.id, false);

		(firstCard) ? setSecondCard(card) : setFirstCard(card);
	}

	return <div className="game container-md">



		<div className="cards-container">
			{cards.map(card => <Card onClick={() => onCardClick(card)} key={card.id} {...card}/>)}
		</div>
	</div>;
}