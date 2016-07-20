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
      <div className="item__info-block">
        <div className="item__label">
          <h2 className="item__name">{name}</h2>
          <p className="item__genre">{genre}</p>
          <p className="item__tech-info">{`${year} ${rated} ${runtime}`}</p>
        </div>
        <ul className="item__scores">
          <li>{scoreTomato}%</li>
          <li>{scoreTomatoUser}%</li>
          <li>{scoreImdb}</li>
          <li>{scoreMetacritic}</li>
        </ul>
        <div className="item__description">
          <p>{description}</p>
          <p>
            Starring: {actors}
            <br/>
            Director: {director}
          </p>
        </div>
        <button className="item__btn-moreinfo" onClick={onDeleteClick}>More Information</button>
        <button className="item__btn-delete" onClick={onDeleteClick}>X</button>
      </div>
    </li>

export default Item;