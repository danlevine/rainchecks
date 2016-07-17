import React from 'react';

const Item = ({ 
  onDeleteClick,
  name,
  year,
  rated,
  runtime,
  genre,
  director,
  actors,
  description,
  country,
  awards,
  poster,
  scoreMetacritic,
  scoreImdb,
  scoreTomato,
  scoreTomatoUser,
  tomatoConsensus }) =>
    <li className="item">
      <img className="item__poster" src={poster} alt={`${name} movie poster`} />
      <div className="item__info">
        <div>
          <h2 className="item__info__name">{name}</h2>
          <p className="item__info__genre">{genre}</p>
          <p className="item__info__tech">{`${year} ${rated} ${runtime}`}</p>
        </div>
        <ul className="item__info__scores">
          <li>{scoreTomato}%</li>
          <li>{scoreTomatoUser}%</li>
          <li>{scoreImdb}</li>
          <li>{scoreMetacritic}</li>
        </ul>
        <p>{description}</p>
        <p>
          Starring: {actors}
          <br/>
          Director: {director}
        </p>
        <button className="item__btn-delete" onClick={onDeleteClick}>X</button>
      </div>
    </li>

export default Item;